import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api"; 
import { getProvinsi, getKota, getKecamatan, getKelurahan } from "../../services/wilayah.service";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, 
  User as UserIcon, Loader2, Upload, FileSpreadsheet,
  GraduationCap, MapPin, Mail, CheckCircle
} from 'lucide-react';

// Import CSS khusus halaman ini
import './adminstyles/TambahAsesi.css'; 

const TambahAsesi = () => {
  // --- STATE UTAMA ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isDetailMode, setIsDetailMode] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);
  
  // Pagination
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0 });

  // --- STATE WILAYAH ---
  const [provinsiList, setProvinsiList] = useState([]);
  const [kotaList, setKotaList] = useState([]);
  const [kecamatanList, setKecamatanList] = useState([]);
  const [kelurahanList, setKelurahanList] = useState([]);

  const [selectedProvinsiId, setSelectedProvinsiId] = useState('');
  const [selectedKotaId, setSelectedKotaId] = useState('');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState('');

  // --- FORM DATA ---
  const initialFormState = {
    nik: '',
    email: '',
    no_hp: '',
    nama_lengkap: '',
    jenis_kelamin: 'laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '', 
    kebangsaan: 'Indonesia',
    
    // Alamat
    alamat: '',
    rt: '',
    rw: '',
    provinsi: '', 
    kota: '',     
    kecamatan: '',
    kelurahan: '',
    kode_pos: '',

    // Pendidikan
    pendidikan_terakhir: 'S1',
    universitas: '',
    jurusan: '',
    tahun_lulus: '',

    // Pekerjaan
    pekerjaan: '',
    nama_perusahaan: '',
    jabatan: ''
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/asesi?page=${page}&limit=${pagination.limit}&search=${search}`);
      const resBody = response.data !== undefined ? response.data : response;

      let listData = [];
      let pag = null;

      if (Array.isArray(resBody.data)) {
          listData = resBody.data;
      } else if (resBody.data?.data && Array.isArray(resBody.data.data)) {
          listData = resBody.data.data;
          pag = resBody.data.pagination;
      } else if (Array.isArray(resBody)) {
          listData = resBody;
      }

      setData(listData); 
      setPagination(prev => ({
        ...prev,
        page: pag?.currentPage || page,
        total: pag?.totalItems || listData.length,
        totalPages: pag?.totalPages || 1
      }));

    } catch (error) {
      console.error("Error fetching asesi:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page, searchTerm);
  }, [pagination.page, searchTerm]);

  // --- LOAD PROVINSI ---
  useEffect(() => {
    const loadProvinsi = async () => {
      try {
        const res = await getProvinsi();
        setProvinsiList(res.data || res);
      } catch (err) { console.error("Gagal load provinsi", err); }
    };
    loadProvinsi();
  }, []);

  // --- HANDLERS WILAYAH ---
  const handleProvinsiChange = async (e) => {
    const id = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text; 

    setSelectedProvinsiId(id);
    setFormData({ ...formData, provinsi: id ? text : '', kota: '', kecamatan: '', kelurahan: '' });
    
    setKotaList([]); setKecamatanList([]); setKelurahanList([]);
    setSelectedKotaId(''); setSelectedKecamatanId('');

    if (id) {
      try {
        const res = await getKota(id);
        setKotaList(res.data || res);
      } catch (err) { console.error(err); }
    }
  };

  const handleKotaChange = async (e) => {
    const id = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    setSelectedKotaId(id);
    setFormData({ ...formData, kota: id ? text : '', kecamatan: '', kelurahan: '' });
    
    setKecamatanList([]); setKelurahanList([]); setSelectedKecamatanId('');

    if (id) {
      try {
        const res = await getKecamatan(id);
        setKecamatanList(res.data || res);
      } catch (err) { console.error(err); }
    }
  };

  const handleKecamatanChange = async (e) => {
    const id = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text;

    setSelectedKecamatanId(id);
    setFormData({ ...formData, kecamatan: id ? text : '', kelurahan: '' });
    setKelurahanList([]);

    if (id) {
      try {
        const res = await getKelurahan(id);
        setKelurahanList(res.data || res);
      } catch (err) { console.error(err); }
    }
  };

  const handleKelurahanChange = (e) => {
    const text = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, kelurahan: e.target.value ? text : '' });
  };

  // --- INPUT HANDLER ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // --- SUBMIT HANDLER ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if(!formData.nik || !formData.email || !formData.nama_lengkap) {
        Swal.fire('Peringatan', 'NIK, Email, dan Nama Lengkap wajib diisi!', 'warning');
        return;
    }

    try {
      Swal.fire({
        title: 'Menyimpan...',
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading()
      });

      const payload = { ...formData };
      if (payload.tanggal_lahir === "") payload.tanggal_lahir = null;
      payload.tahun_lulus = payload.tahun_lulus ? parseInt(payload.tahun_lulus) : null;

      if (isEditMode) {
        await api.put(`/admin/asesi/${currentId}`, payload);
        Swal.fire('Berhasil', 'Data asesi diperbarui', 'success');
      } else {
        await api.post('/admin/asesi', payload);
        Swal.fire('Berhasil', 'Asesi baru ditambahkan', 'success');
      }

      setShowModal(false);
      fetchData(pagination.page); 
      resetForm();

    } catch (error) {
      console.error("Submit Error:", error);
      const msg = error.response?.data?.message || 'Gagal menyimpan data.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  // --- FUNGSI KIRIM EMAIL (DENGAN LOGIKA REDUP) ---
  const handleSendAccount = async (id_user) => {
    if (!id_user) return Swal.fire('Error', 'ID User tidak ditemukan.', 'error');

    const confirm = await Swal.fire({
      title: 'Kirim Informasi Akun?',
      text: "Username dan Password akan dikirim ke email Asesi. Aksi ini tidak dapat dibatalkan.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#28a745',
      cancelButtonColor: '#6c757d',
      confirmButtonText: 'Ya, Kirim Email'
    });

    if (confirm.isConfirmed) {
      try {
        Swal.fire({
          title: 'Mengirim Email...',
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading()
        });

        await api.post(`/admin/send-email-asesi/${id_user}`);

        Swal.fire('Terkirim!', 'Informasi akun berhasil dikirim.', 'success');
        
        // Refresh data agar status tombol berubah
        fetchData(pagination.page);

      } catch (error) {
        console.error("Gagal mengirim email:", error);
        Swal.fire('Gagal', error.response?.data?.message || 'Gagal kirim email.', 'error');
      }
    }
  };

  const isEmailSent = (item) => {
    // Sesuaikan properti Notifikasis dengan respons API backend Anda
    return item.user?.Notifikasis?.length > 0 || item.user?.notifikasis?.length > 0;
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedProvinsiId(''); setSelectedKotaId(''); setSelectedKecamatanId('');
    setIsEditMode(false); setIsDetailMode(false);
    setCurrentId(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item) => {
    resetForm();
    setIsEditMode(true);
    setCurrentId(item.id_user); 
    
    setFormData({
        nik: item.nik || '',
        email: item.user?.email || item.email || '', 
        no_hp: item.user?.no_hp || item.no_hp || '',
        nama_lengkap: item.nama_lengkap || '',
        jenis_kelamin: item.jenis_kelamin || 'laki-laki',
        tempat_lahir: item.tempat_lahir || '',
        tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '',
        kebangsaan: item.kebangsaan || 'Indonesia',
        
        alamat: item.alamat || '',
        rt: item.rt || '',
        rw: item.rw || '',
        provinsi: item.provinsi || '',
        kota: item.kota || '',
        kecamatan: item.kecamatan || '',
        kelurahan: item.kelurahan || '',
        kode_pos: item.kode_pos || '',

        pendidikan_terakhir: item.pendidikan_terakhir || 'S1',
        universitas: item.universitas || '',
        jurusan: item.jurusan || '',
        tahun_lulus: item.tahun_lulus || '',

        pekerjaan: item.pekerjaan || '',
        nama_perusahaan: item.nama_perusahaan || '',
        jabatan: item.jabatan || ''
    });
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Asesi?',
      text: "Data dan Akun User terkait akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/asesi/${id}`);
        Swal.fire('Terhapus!', 'Data asesi telah dihapus.', 'success');
        fetchData(pagination.page);
      } catch (error) {
        Swal.fire('Gagal', 'Tidak bisa menghapus data.', 'error');
      }
    }
  };

  return (
    <div className="asesi-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Asesi</h1>
          <p className="page-subtitle">Kelola data peserta sertifikasi (Asesi)</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn-action-primary" onClick={handleAdd}>
            <Plus size={18} /> Tambah Asesi
          </button>
          <button className="btn-action-secondary" onClick={() => setShowImportModal(true)}>
            <FileSpreadsheet size={18} /> Import Excel
          </button>
        </div>
      </div>

      {/* SEARCH */}
      <div className="filter-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Cari Nama, NIK, atau Email..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="loading-container"><Loader2 className="animate-spin" size={40} /></div>
      ) : (
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama Lengkap</th>
                <th>Pendidikan / Jurusan</th>
                <th>No. HP</th>
                <th>Perusahaan</th>
                <th style={{width: '200px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const emailSent = isEmailSent(item);

                  return (
                    <tr key={item.id_user || index}>
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>{item.nik}</td>
                      <td>
                        <div className="font-medium text-dark">{item.nama_lengkap}</div>
                        <div className="text-small text-muted">{item.user?.email || item.email}</div>
                      </td>
                      <td>
                        <div className="text-normal">{item.pendidikan_terakhir}</div>
                        <div className="text-small text-muted">{item.jurusan || '-'}</div>
                      </td>
                      <td>{item.user?.no_hp || item.no_hp || '-'}</td>
                      <td>{item.nama_perusahaan || '-'}</td>
                      <td>
                        <div className="action-buttons">
                          
                          {/* TOMBOL SEND ACCOUNT */}
                          <button 
                              className={`btn-icon-mail ${emailSent ? 'disabled' : ''}`}
                              onClick={() => !emailSent && handleSendAccount(item.id_user)} 
                              disabled={emailSent}
                              title={emailSent ? "Email Akun Sudah Dikirim" : "Kirim Akun via Email"}
                          >
                            {emailSent ? <CheckCircle size={16} /> : <Mail size={16} />}
                          </button>

                          <button className="btn-icon-view" onClick={() => { handleEdit(item); setIsDetailMode(true); }} title="Detail">
                            <Eye size={18} />
                          </button>
                          <button className="btn-icon-edit" onClick={() => handleEdit(item)} title="Edit">
                            <Edit2 size={18} />
                          </button>
                          <button className="btn-icon-delete" onClick={() => handleDelete(item.id_user)} title="Hapus">
                            <Trash2 size={18} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-muted">Belum ada data asesi.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header-modern">
              <div className="header-content">
                <div className="header-icon-box">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="modal-title">
                    {isDetailMode ? 'Detail Asesi' : isEditMode ? 'Edit Data Asesi' : 'Tambah Asesi Baru'}
                  </h3>
                  <p className="modal-subtitle">Data peserta sertifikasi.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="close-btn">
                <X size={24}/>
              </button>
            </div>

            <form onSubmit={handleSubmit} className="modal-form">
              <div className="modal-content-scroll">
                
                {/* Section: Identitas */}
                <div className="form-section-title"><UserIcon size={18}/> Identitas Pribadi</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>NIK <span className="text-red">*</span></label>
                    <input type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength="16" required disabled={isDetailMode} placeholder="16 digit angka"/>
                  </div>
                  <div className="form-group">
                    <label>Nama Lengkap <span className="text-red">*</span></label>
                    <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Email (Login) <span className="text-red">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isDetailMode || isEditMode}/>
                  </div>
                  <div className="form-group">
                    <label>No. HP / WA</label>
                    <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Tempat Lahir</label>
                    <input type="text" name="tempat_lahir" value={formData.tempat_lahir} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Tanggal Lahir</label>
                    <input type="date" name="tanggal_lahir" value={formData.tanggal_lahir} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Jenis Kelamin</label>
                    <select name="jenis_kelamin" value={formData.jenis_kelamin} onChange={handleChange} disabled={isDetailMode}>
                      <option value="laki-laki">Laki-laki</option>
                      <option value="perempuan">Perempuan</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Kebangsaan</label>
                    <input type="text" name="kebangsaan" value={formData.kebangsaan} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                </div>

                {/* Section: Alamat */}
                <div className="form-section-title mt-4"><MapPin size={18}/> Alamat Domisili</div>
                <div className="form-grid">
                  <div className="form-group col-span-2">
                    <label>Alamat Lengkap</label>
                    <textarea name="alamat" rows="2" value={formData.alamat} onChange={handleChange} disabled={isDetailMode} placeholder="Jalan, No. Rumah..."></textarea>
                  </div>
                  
                  <div className="form-group">
                    <label>Provinsi</label>
                    <select onChange={handleProvinsiChange} value={selectedProvinsiId} disabled={isDetailMode}>
                      <option value="">Pilih Provinsi</option>
                      {provinsiList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    {!selectedProvinsiId && formData.provinsi && <small className="text-muted">{formData.provinsi}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kota / Kabupaten</label>
                    <select onChange={handleKotaChange} value={selectedKotaId} disabled={!selectedProvinsiId || isDetailMode}>
                      <option value="">Pilih Kota</option>
                      {kotaList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {!selectedKotaId && formData.kota && <small className="text-muted">{formData.kota}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kecamatan</label>
                    <select onChange={handleKecamatanChange} value={selectedKecamatanId} disabled={!selectedKotaId || isDetailMode}>
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {!selectedKecamatanId && formData.kecamatan && <small className="text-muted">{formData.kecamatan}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kelurahan</label>
                    <select onChange={handleKelurahanChange} disabled={!selectedKecamatanId || isDetailMode}>
                      <option value="">Pilih Kelurahan</option>
                      {kelurahanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {formData.kelurahan && <small className="text-muted">{formData.kelurahan}</small>}
                  </div>
                  
                  <div className="form-group">
                    <label>RT</label>
                    <input type="text" name="rt" value={formData.rt} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>RW</label>
                    <input type="text" name="rw" value={formData.rw} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Kode Pos</label>
                    <input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                </div>

                {/* Section: Pendidikan & Pekerjaan */}
                <div className="form-section-title mt-4"><GraduationCap size={18}/> Pendidikan & Pekerjaan</div>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Pendidikan Terakhir</label>
                    <select name="pendidikan_terakhir" value={formData.pendidikan_terakhir} onChange={handleChange} disabled={isDetailMode}>
                      <option value="SMA/SMK">SMA/SMK</option>
                      <option value="D3">D3</option>
                      <option value="D4">D4</option>
                      <option value="S1">S1</option>
                      <option value="S2">S2</option>
                      <option value="S3">S3</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Tahun Lulus</label>
                    <input type="number" name="tahun_lulus" value={formData.tahun_lulus} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Universitas / Sekolah</label>
                    <input type="text" name="universitas" value={formData.universitas} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Jurusan</label>
                    <input type="text" name="jurusan" value={formData.jurusan} onChange={handleChange} disabled={isDetailMode}/>
                  </div>

                  <div className="form-group">
                    <label>Pekerjaan</label>
                    <input type="text" name="pekerjaan" value={formData.pekerjaan} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Nama Perusahaan</label>
                    <input type="text" name="nama_perusahaan" value={formData.nama_perusahaan} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group col-span-2">
                    <label>Jabatan</label>
                    <input type="text" name="jabatan" value={formData.jabatan} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                </div>

              </div>

              <div className="modal-footer-modern">
                {isDetailMode ? (
                  <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Tutup</button>
                ) : (
                  <>
                    <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Batal</button>
                    <button type="submit" className="btn-primary">
                      <Save size={16} className="mr-2"/> Simpan Data
                    </button>
                  </>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* IMPORT MODAL */}
      {showImportModal && (
        <div className="modal-backdrop">
          <div className="modal-card modal-sm">
            <div className="modal-header-modern">
              <h3>Import Data Excel</h3>
              <button onClick={() => setShowImportModal(false)} className="close-btn"><X size={24}/></button>
            </div>
            <div className="p-6">
              <div className="upload-area">
                <Upload className="upload-icon" size={40} />
                <p className="upload-text">Upload file template Excel (.xlsx)</p>
                <input type="file" className="file-input"/>
              </div>
            </div>
            <div className="modal-footer-modern">
              <button className="btn-secondary" onClick={() => setShowImportModal(false)}>Batal</button>
              <button className="btn-primary">Upload</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TambahAsesi;