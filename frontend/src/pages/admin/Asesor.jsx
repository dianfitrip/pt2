import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api"; 
import { getProvinsi, getKota, getKecamatan, getKelurahan } from "../../services/wilayah.service";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, 
  User as UserIcon, Loader2, Upload, FileSpreadsheet,
  Briefcase, GraduationCap, MapPin
} from 'lucide-react';
import './adminstyles/Asesor.css'; 

const Asesor = () => {
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

  // State ID untuk memicu fetch wilayah anak (kota/kecamatan), tapi tidak dikirim ke DB
  const [selectedProvinsiId, setSelectedProvinsiId] = useState('');
  const [selectedKotaId, setSelectedKotaId] = useState('');
  const [selectedKecamatanId, setSelectedKecamatanId] = useState('');

  // --- FORM DATA (Sesuai Struktur Database Backend) ---
  const initialFormState = {
    nik: '',
    email: '',
    no_hp: '',
    gelar_depan: '',
    nama_lengkap: '',
    gelar_belakang: '',
    jenis_kelamin: 'laki-laki',
    tempat_lahir: '',
    tanggal_lahir: '', // Frontend pakai string kosong utk input date
    kebangsaan: 'Indonesia',
    pendidikan_terakhir: 'S1',
    tahun_lulus: '',
    institut_asal: '',
    alamat: '',
    rt: '',
    rw: '',
    provinsi: '', // Backend butuh String Nama
    kota: '',     // Backend butuh String Nama
    kecamatan: '',// Backend butuh String Nama
    kelurahan: '',// Backend butuh String Nama
    kode_pos: '',
    bidang_keahlian: '',
    no_reg_asesor: '',
    no_lisensi: '',
    masa_berlaku: '', // Frontend pakai string kosong utk input date
    status_asesor: 'aktif'
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA LIST ---
  const fetchData = async (page = 1, search = '') => {
    setLoading(true);
    try {
      const response = await api.get(`/admin/asesor?page=${page}&limit=${pagination.limit}&search=${search}`);
      const { data: listData, pagination: pag } = response.data.data; 
      
      setData(listData || []); 
      setPagination(prev => ({
        ...prev,
        page: pag?.currentPage || 1,
        total: pag?.totalItems || 0,
        totalPages: pag?.totalPages || 1
      }));
    } catch (error) {
      console.error("Error fetching:", error);
      // Jangan tampilkan alert error saat loading awal agar tidak mengganggu UX jika token expired
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(pagination.page, searchTerm);
  }, [pagination.page, searchTerm]);

  // --- LOAD PROVINSI AWAL ---
  useEffect(() => {
    const loadProvinsi = async () => {
      try {
        const res = await getProvinsi();
        setProvinsiList(res.data || res);
      } catch (err) {
        console.error("Gagal load provinsi", err);
      }
    };
    loadProvinsi();
  }, []);

  // --- HANDLERS WILAYAH (Frontend Logic: ID utk Fetch, Nama utk DB) ---
  const handleProvinsiChange = async (e) => {
    const id = e.target.value;
    const index = e.target.selectedIndex;
    const text = e.target.options[index].text; 

    setSelectedProvinsiId(id);
    // Simpan NAMA provinsi ke formData agar backend senang
    setFormData({ ...formData, provinsi: id ? text : '', kota: '', kecamatan: '', kelurahan: '' });
    
    // Reset anak-anaknya
    setKotaList([]);
    setKecamatanList([]);
    setKelurahanList([]);
    setSelectedKotaId('');
    setSelectedKecamatanId('');

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
    
    setKecamatanList([]);
    setKelurahanList([]);
    setSelectedKecamatanId('');

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
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  // --- SUBMIT HANDLER (PERBAIKAN UTAMA DISINI) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // 1. Validasi Wajib
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

      // 2. SANITASI DATA AGAR BACKEND TIDAK ERROR 500
      // Kita copy formData dan ubah field yang bermasalah sebelum dikirim
      const payload = { ...formData };

      // Fix Date: Ubah string kosong "" menjadi null
      if (payload.tanggal_lahir === "") payload.tanggal_lahir = null;
      if (payload.masa_berlaku === "") payload.masa_berlaku = null;

      // Fix Number: Ubah string jadi integer, kosong jadi null
      payload.tahun_lulus = payload.tahun_lulus ? parseInt(payload.tahun_lulus) : null;

      // Fix String: Pastikan NIK & HP string murni
      payload.nik = String(payload.nik).trim();
      payload.no_hp = String(payload.no_hp).trim();

      // Kirim ke Backend
      if (isEditMode) {
        await api.put(`/admin/asesor/${currentId}`, payload);
        Swal.fire('Berhasil', 'Data asesor diperbarui', 'success');
      } else {
        await api.post('/admin/asesor', payload);
        Swal.fire('Berhasil', 'Asesor baru ditambahkan', 'success');
      }

      setShowModal(false);
      fetchData(pagination.page); // Refresh tabel
      resetForm();

    } catch (error) {
      console.error("Submit Error:", error);
      // Ambil pesan error dari backend jika ada
      const msg = error.response?.data?.message || 'Gagal menyimpan data. Cek inputan Anda.';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  // --- RESET FORM ---
  const resetForm = () => {
    setFormData(initialFormState);
    setSelectedProvinsiId('');
    setSelectedKotaId('');
    setSelectedKecamatanId('');
    setIsEditMode(false);
    setIsDetailMode(false);
    setCurrentId(null);
  };

  // --- HELPER BUTTONS ---
  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = async (item) => {
    resetForm();
    setIsEditMode(true);
    setCurrentId(item.id_user || item.id);
    
    // Isi data ke form
    // Note: Utk tanggal, kita ambil bagian 'YYYY-MM-DD' saja dari ISO string
    setFormData({
        nik: item.nik,
        email: item.user?.email || item.email || '', 
        no_hp: item.user?.no_hp || item.no_hp || '',
        gelar_depan: item.gelar_depan || '',
        nama_lengkap: item.nama_lengkap,
        gelar_belakang: item.gelar_belakang || '',
        jenis_kelamin: item.jenis_kelamin || 'laki-laki',
        tempat_lahir: item.tempat_lahir || '',
        tanggal_lahir: item.tanggal_lahir ? item.tanggal_lahir.split('T')[0] : '',
        kebangsaan: item.kebangsaan || 'Indonesia',
        pendidikan_terakhir: item.pendidikan_terakhir || 'S1',
        tahun_lulus: item.tahun_lulus || '',
        institut_asal: item.institut_asal || '',
        alamat: item.alamat || '',
        rt: item.rt || '',
        rw: item.rw || '',
        provinsi: item.provinsi || '',
        kota: item.kota || '',
        kecamatan: item.kecamatan || '',
        kelurahan: item.kelurahan || '',
        kode_pos: item.kode_pos || '',
        bidang_keahlian: item.bidang_keahlian || '',
        no_reg_asesor: item.no_reg_asesor || '',
        no_lisensi: item.no_lisensi || '',
        masa_berlaku: item.masa_berlaku ? item.masa_berlaku.split('T')[0] : '',
        status_asesor: item.status_asesor || 'aktif'
    });
    
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Data?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/asesor/${id}`);
        Swal.fire('Terhapus!', 'Data asesor telah dihapus.', 'success');
        fetchData(pagination.page);
      } catch (error) {
        Swal.fire('Gagal', 'Tidak bisa menghapus data.', 'error');
      }
    }
  };

  return (
    <div className="asesor-container">
      {/* HEADER */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Data Asesor</h1>
          <p className="page-subtitle">Kelola data asesor kompetensi LSP</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn-action-primary" onClick={handleAdd}>
            <Plus size={18} /> Tambah Asesor
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
            placeholder="Cari Nama atau NIK..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="flex justify-center p-12"><Loader2 className="animate-spin text-orange-500" size={40} /></div>
      ) : (
        <div className="table-responsive">
          <table className="modern-table">
            <thead>
              <tr>
                <th>No</th>
                <th>NIK</th>
                <th>Nama Lengkap</th>
                <th>Bidang Keahlian</th>
                <th>No. MET</th>
                <th>Status</th>
                <th style={{width: '150px'}}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id_user || index}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td>{item.nik}</td>
                    <td>
                      <div className="font-medium text-gray-900">
                        {item.gelar_depan} {item.nama_lengkap} {item.gelar_belakang}
                      </div>
                      <div className="text-xs text-gray-500">{item.user?.email || item.email}</div>
                    </td>
                    <td>{item.bidang_keahlian}</td>
                    <td>{item.no_reg_asesor || '-'}</td>
                    <td>
                      <span className={`status-badge ${item.status_asesor === 'aktif' ? 'status-active' : 'status-inactive'}`}>
                        {item.status_asesor}
                      </span>
                    </td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-icon-view" onClick={() => { handleEdit(item); setIsDetailMode(true); }} title="Detail">
                          <Eye size={18} />
                        </button>
                        <button className="btn-icon-edit" onClick={() => handleEdit(item)} title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button className="btn-icon-delete" onClick={() => handleDelete(item.id_user || item.id)} title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center p-8 text-gray-500">Belum ada data asesor.</td>
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
            
            {/* Header Fixed */}
            <div className="modal-header-modern">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-orange-100 rounded-lg text-orange-600">
                  <UserIcon size={24} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-gray-800">
                    {isDetailMode ? 'Detail Asesor' : isEditMode ? 'Edit Data Asesor' : 'Tambah Asesor Baru'}
                  </h3>
                  <p className="text-xs text-gray-500">Lengkapi form berikut dengan benar.</p>
                </div>
              </div>
              <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600">
                <X size={24}/>
              </button>
            </div>

            {/* Body Scrollable */}
            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden', height: '100%' }}>
              <div className="modal-content-scroll">
                
                {/* Section: Identitas */}
                <div className="form-section-title"><UserIcon size={18}/> Identitas Pribadi</div>
                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label>NIK <span className="text-red-500">*</span></label>
                    <input type="text" name="nik" value={formData.nik} onChange={handleChange} maxLength="16" required disabled={isDetailMode} placeholder="16 digit angka"/>
                  </div>
                  <div className="form-group">
                    <label>Nama Lengkap <span className="text-red-500">*</span></label>
                    <input type="text" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} required disabled={isDetailMode} placeholder="Tanpa gelar"/>
                  </div>
                  <div className="form-group">
                    <label>Gelar Depan</label>
                    <input type="text" name="gelar_depan" value={formData.gelar_depan} onChange={handleChange} disabled={isDetailMode} placeholder="Contoh: Dr., Ir."/>
                  </div>
                  <div className="form-group">
                    <label>Gelar Belakang</label>
                    <input type="text" name="gelar_belakang" value={formData.gelar_belakang} onChange={handleChange} disabled={isDetailMode} placeholder="Contoh: S.Kom, M.T"/>
                  </div>
                  <div className="form-group">
                    <label>Email (Login) <span className="text-red-500">*</span></label>
                    <input type="email" name="email" value={formData.email} onChange={handleChange} required disabled={isDetailMode || isEditMode}/>
                  </div>
                  <div className="form-group">
                    <label>No. HP / WA <span className="text-red-500">*</span></label>
                    <input type="text" name="no_hp" value={formData.no_hp} onChange={handleChange} required disabled={isDetailMode}/>
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
                <div className="form-section-title mt-6"><MapPin size={18}/> Alamat & Domisili</div>
                <div className="grid grid-cols-2">
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Alamat Lengkap</label>
                    <textarea name="alamat" rows="2" value={formData.alamat} onChange={handleChange} disabled={isDetailMode} placeholder="Nama jalan, gedung, dll"></textarea>
                  </div>
                  
                  {/* Wilayah Dropdown */}
                  <div className="form-group">
                    <label>Provinsi</label>
                    <select onChange={handleProvinsiChange} value={selectedProvinsiId} disabled={isDetailMode}>
                      <option value="">Pilih Provinsi</option>
                      {provinsiList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                    {/* Tampilkan data lama jika belum diubah */}
                    {!selectedProvinsiId && formData.provinsi && <small className="text-gray-500">Saat ini: {formData.provinsi}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kota / Kabupaten</label>
                    <select onChange={handleKotaChange} value={selectedKotaId} disabled={!selectedProvinsiId || isDetailMode}>
                      <option value="">Pilih Kota</option>
                      {kotaList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {!selectedKotaId && formData.kota && <small className="text-gray-500">Saat ini: {formData.kota}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kecamatan</label>
                    <select onChange={handleKecamatanChange} value={selectedKecamatanId} disabled={!selectedKotaId || isDetailMode}>
                      <option value="">Pilih Kecamatan</option>
                      {kecamatanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {!selectedKecamatanId && formData.kecamatan && <small className="text-gray-500">Saat ini: {formData.kecamatan}</small>}
                  </div>

                  <div className="form-group">
                    <label>Kelurahan</label>
                    <select onChange={handleKelurahanChange} disabled={!selectedKecamatanId || isDetailMode}>
                      <option value="">Pilih Kelurahan</option>
                      {kelurahanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                    </select>
                    {/* Utk kelurahan agak tricky utk set default value select jika hanya punya nama, jadi tampilkan text saja */}
                    {formData.kelurahan && <small className="text-gray-500">Saat ini: {formData.kelurahan}</small>}
                  </div>

                  <div className="grid grid-cols-3 gap-2" style={{ gridColumn: 'span 2' }}>
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
                </div>

                {/* Section: Pendidikan */}
                <div className="form-section-title mt-6"><GraduationCap size={18}/> Pendidikan & Keahlian</div>
                <div className="grid grid-cols-2">
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
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Nama Institusi / Universitas</label>
                    <input type="text" name="institut_asal" value={formData.institut_asal} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group" style={{ gridColumn: 'span 2' }}>
                    <label>Bidang Keahlian <span className="text-red-500">*</span></label>
                    <input type="text" name="bidang_keahlian" value={formData.bidang_keahlian} onChange={handleChange} required disabled={isDetailMode} placeholder="Contoh: Teknik Informatika, Manajemen..."/>
                  </div>
                </div>

                {/* Section: Data Asesor */}
                <div className="form-section-title mt-6"><Briefcase size={18}/> Data Sertifikasi</div>
                <div className="grid grid-cols-2">
                  <div className="form-group">
                    <label>No. Registrasi (MET)</label>
                    <input type="text" name="no_reg_asesor" value={formData.no_reg_asesor} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>No. Lisensi</label>
                    <input type="text" name="no_lisensi" value={formData.no_lisensi} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Masa Berlaku Sertifikat</label>
                    <input type="date" name="masa_berlaku" value={formData.masa_berlaku} onChange={handleChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status_asesor" value={formData.status_asesor} onChange={handleChange} disabled={isDetailMode}>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>

              </div>

              {/* Footer Fixed */}
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

      {/* IMPORT MODAL (Dummy) */}
      {showImportModal && (
        <div className="modal-backdrop">
          <div className="modal-card" style={{ maxWidth: '500px', height: 'auto' }}>
            <div className="modal-header-modern">
              <h3>Import Data Excel</h3>
              <button onClick={() => setShowImportModal(false)}><X size={24}/></button>
            </div>
            <div className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                <Upload className="mx-auto text-gray-400 mb-4" size={40} />
                <p className="text-sm text-gray-600 mb-2">Upload file template Excel (.xlsx)</p>
                <input type="file" className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
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

export default Asesor;