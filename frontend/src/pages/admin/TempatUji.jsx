import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { getProvinsi, getKota, getKecamatan, getKelurahan } from "../../services/wilayah.service";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, Upload, FileSpreadsheet,
  MapPin, User, Building2, Loader2, FileText, Home
} from 'lucide-react';
import './adminstyles/TempatUji.css';

const TempatUji = () => {
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

  // --- FORM DATA ---
  const initialFormState = {
    // Data Akun (User)
    email: '',
    no_hp: '',

    // Data Profile TUK
    kode_tuk: '',
    nama_tuk: '',
    jenis_tuk: 'sewaktu',
    profil_singkat: '',
    
    // Alamat
    alamat: '',
    rt: '',
    rw: '',
    provinsi: '',
    kota: '',
    kecamatan: '',
    kelurahan: '',
    kode_pos: '',
    
    // Legalitas
    no_lisensi: '',
    masa_berlaku_lisensi: '',
    status_tuk: 'aktif'
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- LOAD DATA ---
  useEffect(() => {
    fetchData();
    fetchProvinsi();
  }, [pagination.page, searchTerm]);

  // --- API FUNCTIONS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Backend: router.get("/tuk") -> /admin/tuk
      const response = await api.get('/admin/tuk', {
        params: {
          page: pagination.page,
          limit: pagination.limit,
          search: searchTerm
        }
      });

      const result = response.data.data || response.data;
      if (Array.isArray(result)) {
        setData(result);
      } else if (result.rows) {
        setData(result.rows);
        setPagination(prev => ({ ...prev, total: result.count }));
      }
    } catch (error) {
      console.error("Error fetching TUK:", error);
    } finally {
      setLoading(false);
    }
  };

  const fetchProvinsi = async () => {
    try {
      const res = await getProvinsi();
      setProvinsiList(res);
    } catch (err) { console.error("Gagal load provinsi", err); }
  };

  // --- HANDLER WILAYAH ---
  const handleProvinsiChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, provinsi: name, kota: '', kecamatan: '', kelurahan: '' });
    setKotaList([]); setKecamatanList([]); setKelurahanList([]);
    if (id) setKotaList(await getKota(id));
  };

  const handleKotaChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, kota: name, kecamatan: '', kelurahan: '' });
    setKecamatanList([]); setKelurahanList([]);
    if (id) setKecamatanList(await getKecamatan(id));
  };

  const handleKecamatanChange = async (e) => {
    const id = e.target.value;
    const name = e.target.options[e.target.selectedIndex].text;
    setFormData({ ...formData, kecamatan: name, kelurahan: '' });
    setKelurahanList([]);
    if (id) setKelurahanList(await getKelurahan(id));
  };

  // --- FORM HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const resetForm = () => {
    setFormData(initialFormState);
    setKotaList([]); setKecamatanList([]); setKelurahanList([]);
    setIsEditMode(false); setIsDetailMode(false); setCurrentId(null);
  };

  const openCreateModal = () => {
    resetForm();
    setShowModal(true);
  };

  const fetchDetail = async (id) => {
    try {
      // Backend: router.get("/tuk/:id") -> /admin/tuk/:id
      const res = await api.get(`/admin/tuk/${id}`);
      const item = res.data.data || res.data;
      
      const toDateInput = (dateStr) => dateStr ? new Date(dateStr).toISOString().split('T')[0] : '';

      setFormData({
        email: item.User?.email || '',
        no_hp: item.User?.no_hp || '',
        kode_tuk: item.kode_tuk,
        nama_tuk: item.nama_tuk,
        jenis_tuk: item.jenis_tuk || 'sewaktu',
        profil_singkat: item.profil_singkat || '',
        alamat: item.alamat || '',
        rt: item.rt || '',
        rw: item.rw || '',
        provinsi: item.provinsi || '',
        kota: item.kota || '',
        kecamatan: item.kecamatan || '',
        kelurahan: item.kelurahan || '',
        kode_pos: item.kode_pos || '',
        no_lisensi: item.no_lisensi || '',
        masa_berlaku_lisensi: toDateInput(item.masa_berlaku_lisensi),
        status_tuk: item.status_tuk || 'aktif'
      });
      return true;
    } catch (error) {
      Swal.fire('Error', 'Gagal mengambil detail TUK', 'error');
      return false;
    }
  };

  const openEditModal = async (id) => {
    resetForm();
    const success = await fetchDetail(id);
    if (success) {
      setCurrentId(id);
      setIsEditMode(true);
      setShowModal(true);
    }
  };

  const openDetailModal = async (id) => {
    resetForm();
    const success = await fetchDetail(id);
    if (success) {
      setIsDetailMode(true);
      setShowModal(true);
    }
  };

  // --- SUBMIT HANDLE (MODIFIKASI DI SINI UNTUK SESUAIKAN ROUTE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Sanitasi Data
    const payload = { ...formData };
    if (!payload.masa_berlaku_lisensi) payload.masa_berlaku_lisensi = null;
    
    if (!payload.kode_tuk || !payload.nama_tuk) {
      Swal.fire('Peringatan', 'Kode TUK dan Nama TUK wajib diisi!', 'warning');
      return;
    }

    try {
      if (isEditMode) {
        // Edit: Backend router.put("/tuk/:id") -> /admin/tuk/:id (Route Standar)
        await api.put(`/admin/tuk/${currentId}`, payload);
        Swal.fire('Sukses', 'Data TUK berhasil diperbarui', 'success');
      } else {
        // Create: Backend router.post("/tuk-akun") -> /admin/tuk-akun (Route Khusus Anda)
        // PERUBAHAN: Endpoint diganti dari '/admin/tuk' menjadi '/admin/tuk-akun'
        await api.post('/admin/tuk-akun', payload);
        Swal.fire('Sukses', 'TUK baru berhasil dibuat.', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error);
      const msg = error.response?.data?.message || 'Gagal menyimpan data';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    const confirm = await Swal.fire({
      title: 'Hapus TUK?',
      text: "Data akan dihapus permanen!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    });

    if (confirm.isConfirmed) {
      try {
        // Delete: Backend router.delete("/tuk/:id") -> /admin/tuk/:id
        await api.delete(`/admin/tuk/${id}`);
        Swal.fire('Terhapus', 'Data TUK telah dihapus', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus data', 'error');
      }
    }
  };

  // --- IMPORT EXCEL (MODIFIKASI DI SINI) ---
  const handleImportSubmit = async (e) => {
    e.preventDefault();
    const file = e.target.elements[0].files[0];
    if (!file) return Swal.fire('Warning', 'Pilih file excel dulu', 'warning');

    const form = new FormData();
    form.append('file', file);

    try {
      // Import: Backend router.post("/import-tuk") -> /admin/import-tuk
      // PERUBAHAN: Endpoint diganti dari '/admin/tuk/import' menjadi '/admin/import-tuk'
      await api.post('/admin/import-tuk', form);
      Swal.fire('Sukses', 'Import berhasil', 'success');
      setShowImportModal(false);
      fetchData();
    } catch (err) {
      Swal.fire('Gagal', err.response?.data?.message || 'Import gagal', 'error');
    }
  };

  return (
    <div className="tuk-container">
      {/* HEADER */}
      <div className="header-section">
        <div className="title-box">
          <h2>Data Tempat Uji Kompetensi (TUK)</h2>
          <p>Kelola data TUK, lokasi, dan status lisensi.</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn-action-secondary" onClick={() => setShowImportModal(true)}>
            <FileSpreadsheet size={18} /> Import
          </button>
          <button className="btn-action-primary" onClick={openCreateModal}>
            <Plus size={18} /> Tambah TUK
          </button>
        </div>
      </div>

      {/* CONTENT */}
      <div className="content-card">
        <div className="search-bar-wrapper">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            className="search-input" 
            placeholder="Cari Kode atau Nama TUK..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        {loading ? (
          <div className="p-8 text-center flex justify-center">
            <Loader2 className="animate-spin text-orange-500" size={40} />
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Kode TUK</th>
                  <th>Nama TUK</th>
                  <th>Jenis</th>
                  <th>Status</th>
                  <th>Aksi</th>
                </tr>
              </thead>
              <tbody>
                {data.length > 0 ? (
                  data.map((item, idx) => (
                    <tr key={item.id_user || idx}>
                      <td>{(pagination.page - 1) * pagination.limit + idx + 1}</td>
                      <td><span className="font-mono font-medium">{item.kode_tuk}</span></td>
                      <td>
                        <div className="font-medium">{item.nama_tuk}</div>
                        <div className="text-xs text-gray-500">{item.kota}, {item.provinsi}</div>
                      </td>
                      <td>{item.jenis_tuk}</td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs ${item.status_tuk === 'aktif' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                          {item.status_tuk}
                        </span>
                      </td>
                      <td>
                        <div className="flex gap-2">
                          <button onClick={() => openDetailModal(item.id_user)} className="text-blue-500 hover:text-blue-700" title="Detail"><Eye size={18}/></button>
                          <button onClick={() => openEditModal(item.id_user)} className="text-yellow-500 hover:text-yellow-700" title="Edit"><Edit2 size={18}/></button>
                          <button onClick={() => handleDelete(item.id_user)} className="text-red-500 hover:text-red-700" title="Hapus"><Trash2 size={18}/></button>
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr><td colSpan="6" className="text-center p-4">Data tidak ditemukan</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL UTAMA --- */}
      {showModal && (
        <div className="modal-backdrop">
          <div className="modal-card wide-modal">
            <div className="modal-header-modern">
              <h3>{isDetailMode ? 'Detail TUK' : isEditMode ? 'Edit Data TUK' : 'Tambah TUK Baru'}</h3>
              <button onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-body-scroll">
              
              {/* AKUN */}
              <div className="form-section">
                <h4 className="section-title"><User size={18}/> Informasi Akun & Kontak</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Email {isEditMode && <small>(Readonly)</small>}</label>
                    <input type="email" name="email" value={formData.email} onChange={handleInputChange} disabled={isEditMode || isDetailMode} required={!isEditMode}/>
                  </div>
                  <div className="form-group">
                    <label>No Handphone / Telp</label>
                    <input type="text" name="no_hp" value={formData.no_hp} onChange={handleInputChange} disabled={isEditMode || isDetailMode} required={!isEditMode}/>
                  </div>
                </div>
              </div>

              {/* PROFIL TUK */}
              <div className="form-section">
                <h4 className="section-title"><Building2 size={18}/> Profil TUK</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>Kode TUK <span className="text-red-500">*</span></label>
                    <input type="text" name="kode_tuk" value={formData.kode_tuk} onChange={handleInputChange} disabled={isDetailMode} required/>
                  </div>
                  <div className="form-group">
                    <label>Nama TUK <span className="text-red-500">*</span></label>
                    <input type="text" name="nama_tuk" value={formData.nama_tuk} onChange={handleInputChange} disabled={isDetailMode} required/>
                  </div>
                  <div className="form-group">
                    <label>Jenis TUK</label>
                    <select name="jenis_tuk" value={formData.jenis_tuk} onChange={handleInputChange} disabled={isDetailMode}>
                      <option value="sewaktu">TUK Sewaktu</option>
                      <option value="tempat_kerja">TUK Tempat Kerja</option>
                      <option value="mandiri">TUK Mandiri</option>
                    </select>
                  </div>
                  <div className="form-group full-width">
                    <label>Profil Singkat</label>
                    <textarea name="profil_singkat" rows="2" value={formData.profil_singkat} onChange={handleInputChange} disabled={isDetailMode}></textarea>
                  </div>
                </div>
              </div>

              {/* ALAMAT */}
              <div className="form-section">
                <h4 className="section-title"><Home size={18}/> Alamat & Lokasi</h4>
                <div className="form-grid">
                  <div className="form-group full-width">
                    <label>Alamat Lengkap</label>
                    <textarea name="alamat" rows="2" value={formData.alamat} onChange={handleInputChange} disabled={isDetailMode}></textarea>
                  </div>
                  
                  {/* Dropdown Wilayah */}
                  {!isDetailMode ? (
                    <>
                      <div className="form-group">
                        <label>Provinsi</label>
                        <select onChange={handleProvinsiChange}>
                          <option value="">{formData.provinsi || "Pilih Provinsi"}</option>
                          {provinsiList.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Kota/Kab</label>
                        <select onChange={handleKotaChange} disabled={!kotaList.length}>
                          <option value="">{formData.kota || "Pilih Kota"}</option>
                          {kotaList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Kecamatan</label>
                        <select onChange={handleKecamatanChange} disabled={!kecamatanList.length}>
                          <option value="">{formData.kecamatan || "Pilih Kecamatan"}</option>
                          {kecamatanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </select>
                      </div>
                      <div className="form-group">
                        <label>Kelurahan</label>
                        <select onChange={(e) => setFormData({...formData, kelurahan: e.target.options[e.target.selectedIndex].text})} disabled={!kelurahanList.length}>
                          <option value="">{formData.kelurahan || "Pilih Kelurahan"}</option>
                          {kelurahanList.map(k => <option key={k.id} value={k.id}>{k.name}</option>)}
                        </select>
                      </div>
                    </>
                  ) : (
                    <div className="form-group full-width">
                      <label>Wilayah</label>
                      <input value={`${formData.kelurahan}, ${formData.kecamatan}, ${formData.kota}, ${formData.provinsi}`} disabled />
                    </div>
                  )}
                  
                  <div className="form-group"><label>RT</label><input type="text" name="rt" value={formData.rt} onChange={handleInputChange} disabled={isDetailMode}/></div>
                  <div className="form-group"><label>RW</label><input type="text" name="rw" value={formData.rw} onChange={handleInputChange} disabled={isDetailMode}/></div>
                  <div className="form-group"><label>Kode Pos</label><input type="text" name="kode_pos" value={formData.kode_pos} onChange={handleInputChange} disabled={isDetailMode}/></div>
                </div>
              </div>

              {/* LEGALITAS */}
              <div className="form-section">
                <h4 className="section-title"><FileText size={18}/> Legalitas & Status</h4>
                <div className="form-grid">
                  <div className="form-group">
                    <label>No. Lisensi</label>
                    <input type="text" name="no_lisensi" value={formData.no_lisensi} onChange={handleInputChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Masa Berlaku Lisensi</label>
                    <input type="date" name="masa_berlaku_lisensi" value={formData.masa_berlaku_lisensi} onChange={handleInputChange} disabled={isDetailMode}/>
                  </div>
                  <div className="form-group">
                    <label>Status TUK</label>
                    <select name="status_tuk" value={formData.status_tuk} onChange={handleInputChange} disabled={isDetailMode}>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Nonaktif</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer-modern">
                <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>
                  {isDetailMode ? 'Tutup' : 'Batal'}
                </button>
                {!isDetailMode && (
                  <button type="submit" className="btn-primary">
                    <Save size={16} className="mr-2"/> Simpan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}

      {/* MODAL IMPORT */}
      {showImportModal && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header-modern">
              <h3>Import Data TUK</h3>
              <button onClick={() => setShowImportModal(false)}><X size={24}/></button>
            </div>
            <form onSubmit={handleImportSubmit} className="p-6">
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center">
                <Upload className="mx-auto text-gray-400 mb-4" size={48} />
                <p>Upload file Excel (.xlsx) data TUK.</p>
                <input type="file" accept=".xlsx, .xls" className="mt-4 block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:bg-orange-50 file:text-orange-700 hover:file:bg-orange-100"/>
              </div>
              <div className="modal-footer-modern mt-4">
                <button type="button" className="btn-secondary" onClick={() => setShowImportModal(false)}>Batal</button>
                <button type="submit" className="btn-primary">Upload</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default TempatUji;