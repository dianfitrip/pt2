import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  User, Mail, MapPin, Edit2, Save, X, Camera, Shield, 
  CreditCard, Calendar, BookOpen, FileText, Home, Loader2
} from 'lucide-react';
import './adminstyles/ProfileAdmin.css';

const ProfileAdmin = () => {
  // --- STATE DATA ---
  const [profile, setProfile] = useState({
    nip_admin: '', nik: '', nama_lengkap: '', 
    tempat_lahir: '', tanggal_lahir: '',
    alamat: '', provinsi: '', kota: '', kecamatan: '', kelurahan: '', rt: '', rw: '',
    pendidikan_terakhir: '', no_lisensi: '', masa_berlaku: '', foto: ''
  });
  
  const [userAccount, setUserAccount] = useState({
    username: '', email: '', role: 'Administrator'
  });

  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);

  // --- STATE WILAYAH ---
  const [provinsiList, setProvinsiList] = useState([]);
  const [kotaList, setKotaList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);
  
  const [selectedWilayahId, setSelectedWilayahId] = useState({
    provinsi: '', kota: '', kecamatan: ''
  });

  // --- FETCH DATA ---
  const fetchProfile = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/profile');
      if (response.data.success) {
        const data = response.data.data || {};
        setProfile({
          nip_admin: data.nip_admin || '',
          nik: data.nik || '',
          nama_lengkap: data.nama_lengkap || '',
          tempat_lahir: data.tempat_lahir || '',
          tanggal_lahir: data.tanggal_lahir ? data.tanggal_lahir.split('T')[0] : '',
          alamat: data.alamat || '',
          provinsi: data.provinsi || '',
          kota: data.kota || '',
          kecamatan: data.kecamatan || '',
          kelurahan: data.kelurahan || '',
          rt: data.rt || '',
          rw: data.rw || '',
          pendidikan_terakhir: data.pendidikan_terakhir || '',
          no_lisensi: data.no_lisensi || '',
          masa_berlaku: data.masa_berlaku ? data.masa_berlaku.split('T')[0] : '',
          foto: data.foto || ''
        });
      }

      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      setUserAccount({
        username: storedUser.username || 'Admin',
        email: storedUser.email || '-',
        role: storedUser.role || 'Administrator'
      });

    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  // --- FETCH WILAYAH (Saat Mode Edit) ---
  useEffect(() => {
    if (isEditing) {
      api.get('/public/provinsi')
        .then(res => setProvinsiList(res.data || []))
        .catch(err => console.error("Gagal load provinsi", err));
    }
  }, [isEditing]);

  const fetchKota = async (provId) => {
    try { const res = await api.get(`/public/kota/${provId}`); setKotaList(res.data || []); } 
    catch (err) { console.error(err); }
  };

  const fetchKecamatan = async (kotaId) => {
    try { const res = await api.get(`/public/kecamatan/${kotaId}`); setKecamatanList(res.data || []); } 
    catch (err) { console.error(err); }
  };

  const fetchKelurahan = async (kecId) => {
    try { const res = await api.get(`/public/kelurahan/${kecId}`); setKelurahanList(res.data || []); } 
    catch (err) { console.error(err); }
  };

  // --- HANDLERS WILAYAH ---
  const handleProvinsiChange = (e) => {
    const id = e.target.value;
    const name = provinsiList.find(p => p.id === id)?.name || '';
    setProfile(prev => ({ ...prev, provinsi: name, kota: '', kecamatan: '', kelurahan: '' }));
    setSelectedWilayahId(prev => ({ ...prev, provinsi: id, kota: '', kecamatan: '' }));
    setKotaList([]); setKecamatanList([]); setKelurahanList([]);
    if (id) fetchKota(id);
  };

  const handleKotaChange = (e) => {
    const id = e.target.value;
    const name = kotaList.find(k => k.id === id)?.name || '';
    setProfile(prev => ({ ...prev, kota: name, kecamatan: '', kelurahan: '' }));
    setSelectedWilayahId(prev => ({ ...prev, kota: id, kecamatan: '' }));
    setKecamatanList([]); setKelurahanList([]);
    if (id) fetchKecamatan(id);
  };

  const handleKecamatanChange = (e) => {
    const id = e.target.value;
    const name = kecamatanList.find(k => k.id === id)?.name || '';
    setProfile(prev => ({ ...prev, kecamatan: name, kelurahan: '' }));
    setSelectedWilayahId(prev => ({ ...prev, kecamatan: id }));
    setKelurahanList([]);
    if (id) fetchKelurahan(id);
  };

  const handleKelurahanChange = (e) => {
    const id = e.target.value;
    const name = kelurahanList.find(k => k.id === id)?.name || '';
    setProfile(prev => ({ ...prev, kelurahan: name }));
  };

  // --- GENERAL HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setProfile(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.put('/admin/profile', profile);
      
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      storedUser.name = profile.nama_lengkap; 
      localStorage.setItem('user', JSON.stringify(storedUser));

      Swal.fire({ icon: 'success', title: 'Berhasil', text: 'Profil berhasil diperbarui', timer: 1500, showConfirmButton: false });
      setIsEditing(false);
      fetchProfile();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Gagal update profil', 'error');
    }
  };

  if (loading) return <div className="loading-screen"><Loader2 className="animate-spin" size={40}/></div>;

  return (
    <div className="profile-page-container">
      
      {/* 1. HEADER GELAP (DARK HEADER) */}
      <div className="profile-header-dark">
        <div className="header-inner">
          <h1 className="header-title">Profil Saya</h1>
          <p className="header-desc">Kelola informasi akun dan data diri administrator.</p>
        </div>
      </div>

      {/* 2. KONTEN (TERPISAH, TIDAK TIMPANG TINDIH) */}
      <div className="profile-content-body">
        
        {/* Sidebar Kiri: Foto & Info Akun */}
        <div className="profile-left-col">
          <div className="card profile-summary-card">
            <div className="avatar-section">
              <div className="avatar-box">
                {profile.nama_lengkap ? profile.nama_lengkap.charAt(0).toUpperCase() : <User size={40}/>}
              </div>
              <h2 className="user-fullname">{profile.nama_lengkap || userAccount.username}</h2>
              <span className="user-role-badge">{userAccount.role}</span>
            </div>
            
            <div className="account-details">
              <div className="detail-item">
                <div className="icon"><Mail size={18}/></div>
                <div>
                  <label>Email Akun</label>
                  <p>{userAccount.email}</p>
                </div>
              </div>
              <div className="detail-item">
                <div className="icon"><Shield size={18}/></div>
                <div>
                  <label>NIP Admin</label>
                  <p>{profile.nip_admin || '-'}</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Kolom Kanan: Form Data */}
        <div className="profile-right-col">
          <div className="card form-card">
            <div className="card-header-flex">
              <h3>Informasi Pribadi</h3>
              {!isEditing ? (
                <button className="btn-action edit" onClick={() => setIsEditing(true)}>
                  <Edit2 size={16}/> Edit Profil
                </button>
              ) : (
                <button className="btn-action cancel" onClick={() => { setIsEditing(false); fetchProfile(); }}>
                  <X size={16}/> Batal
                </button>
              )}
            </div>

            <form onSubmit={handleSubmit} className="profile-form-layout">
              
              {/* SECTION: DATA DIRI */}
              <div className="form-section">
                <h4 className="form-section-title">Data Identitas</h4>
                <div className="grid-2">
                  <div className="input-group">
                    <label>Nama Lengkap</label>
                    <input type="text" name="nama_lengkap" value={profile.nama_lengkap} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div className="input-group">
                    <label>NIK</label>
                    <input type="text" name="nik" value={profile.nik} onChange={handleChange} disabled={!isEditing} maxLength={16} />
                  </div>
                  <div className="input-group">
                    <label>Tempat Lahir</label>
                    <input type="text" name="tempat_lahir" value={profile.tempat_lahir} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div className="input-group">
                    <label>Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" value={profile.tanggal_lahir} onChange={handleChange} disabled={!isEditing} />
                  </div>
                </div>
              </div>

              {/* SECTION: ALAMAT (DROPDOWN API) */}
              <div className="form-section">
                <h4 className="form-section-title">Alamat Domisili</h4>
                <div className="input-group full-width">
                  <label>Alamat Lengkap (Jalan/Gang)</label>
                  <textarea name="alamat" value={profile.alamat} onChange={handleChange} disabled={!isEditing} rows="2"></textarea>
                </div>

                <div className="grid-2">
                  {/* Provinsi */}
                  <div className="input-group">
                    <label>Provinsi</label>
                    {isEditing ? (
                      <select name="provinsi" onChange={handleProvinsiChange} value={selectedWilayahId.provinsi} className="form-select">
                        <option value="">Pilih Provinsi</option>
                        {provinsiList.map(p => (<option key={p.id} value={p.id}>{p.name}</option>))}
                      </select>
                    ) : (
                      <input type="text" value={profile.provinsi} disabled />
                    )}
                  </div>

                  {/* Kota */}
                  <div className="input-group">
                    <label>Kota/Kabupaten</label>
                    {isEditing ? (
                      <select name="kota" onChange={handleKotaChange} value={selectedWilayahId.kota} disabled={!selectedWilayahId.provinsi} className="form-select">
                        <option value="">Pilih Kota</option>
                        {kotaList.map(k => (<option key={k.id} value={k.id}>{k.name}</option>))}
                      </select>
                    ) : (
                      <input type="text" value={profile.kota} disabled />
                    )}
                  </div>

                  {/* Kecamatan */}
                  <div className="input-group">
                    <label>Kecamatan</label>
                    {isEditing ? (
                      <select name="kecamatan" onChange={handleKecamatanChange} value={selectedWilayahId.kecamatan} disabled={!selectedWilayahId.kota} className="form-select">
                        <option value="">Pilih Kecamatan</option>
                        {kecamatanList.map(k => (<option key={k.id} value={k.id}>{k.name}</option>))}
                      </select>
                    ) : (
                      <input type="text" value={profile.kecamatan} disabled />
                    )}
                  </div>

                  {/* Kelurahan */}
                  <div className="input-group">
                    <label>Kelurahan</label>
                    {isEditing ? (
                      <select name="kelurahan" onChange={handleKelurahanChange} value={kelurahanList.find(k => k.name === profile.kelurahan)?.id || ''} disabled={!selectedWilayahId.kecamatan} className="form-select">
                        <option value="">Pilih Kelurahan</option>
                        {kelurahanList.map(k => (<option key={k.id} value={k.id}>{k.name}</option>))}
                      </select>
                    ) : (
                      <input type="text" value={profile.kelurahan} disabled />
                    )}
                  </div>
                </div>

                <div className="grid-2 mt-3">
                  <div className="input-group"><label>RT</label><input type="text" name="rt" value={profile.rt} onChange={handleChange} disabled={!isEditing}/></div>
                  <div className="input-group"><label>RW</label><input type="text" name="rw" value={profile.rw} onChange={handleChange} disabled={!isEditing}/></div>
                </div>
              </div>

              {/* SECTION: PENDIDIKAN */}
              <div className="form-section no-border">
                <h4 className="form-section-title">Pendidikan & Lisensi</h4>
                <div className="input-group full-width">
                  <label>Pendidikan Terakhir</label>
                  <input type="text" name="pendidikan_terakhir" value={profile.pendidikan_terakhir} onChange={handleChange} disabled={!isEditing} placeholder="Contoh: S1 Teknik Informatika"/>
                </div>
                <div className="grid-2">
                  <div className="input-group">
                    <label>No. Lisensi</label>
                    <input type="text" name="no_lisensi" value={profile.no_lisensi} onChange={handleChange} disabled={!isEditing} />
                  </div>
                  <div className="input-group">
                    <label>Masa Berlaku</label>
                    <input type="date" name="masa_berlaku" value={profile.masa_berlaku} onChange={handleChange} disabled={!isEditing} />
                  </div>
                </div>
              </div>

              {isEditing && (
                <div className="form-submit-area">
                  <button type="submit" className="btn-save-changes">
                    <Save size={18} className="mr-2"/> Simpan Perubahan
                  </button>
                </div>
              )}

            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProfileAdmin;