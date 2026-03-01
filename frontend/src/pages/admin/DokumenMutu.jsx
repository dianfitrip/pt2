import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, FileText, 
  Filter, Download, Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import './adminstyles/DokumenMutu.css'; 

const DokumenMutu = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState(''); 
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Pagination
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Form State
  const [formData, setFormData] = useState({
    jenis_dokumen: 'kebijakan_mutu',
    kategori: '',
    nama_dokumen: '',
    deskripsi: '',
    nomor_dokumen: '',
    nomor_revisi: '',
    penyusun: '',
    disahkan_oleh: '',
    tanggal_dokumen: ''
  });

  // State Khusus File
  const [files, setFiles] = useState({
    file_dokumen: null,
    file_pendukung: null
  });

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Panggil API
      const response = await api.get('/admin/dokumen-mutu');
      
      // DEBUG: Cek isi response di Console Browser
      console.log("Response dari Backend:", response);

      // Sesuai Controller: res.json({ data: [...] })
      // Maka data ada di response.data.data
      const resultData = response.data.data || [];
      
      // Validasi array
      if (Array.isArray(resultData)) {
        setData(resultData);
      } else {
        console.error("Format data bukan array:", resultData);
        setData([]);
      }

    } catch (error) {
      console.error("Error Fetching:", error);
      Swal.fire({
        title: 'Gagal', 
        text: error.response?.data?.message || 'Gagal mengambil data. Cek Console.', 
        icon: 'error'
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e, fieldName) => {
    const file = e.target.files[0];
    setFiles(prev => ({
      ...prev,
      [fieldName]: file // fieldName: 'file_dokumen' atau 'file_pendukung'
    }));
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);

    if (type === 'create') {
      setFormData({
        jenis_dokumen: 'kebijakan_mutu',
        kategori: '',
        nama_dokumen: '',
        deskripsi: '',
        nomor_dokumen: '',
        nomor_revisi: '',
        penyusun: '',
        disahkan_oleh: '',
        tanggal_dokumen: ''
      });
      setFiles({ file_dokumen: null, file_pendukung: null });
    } else if (item) {
      setFormData({
        jenis_dokumen: item.jenis_dokumen,
        kategori: item.kategori || '',
        nama_dokumen: item.nama_dokumen,
        deskripsi: item.deskripsi || '',
        nomor_dokumen: item.nomor_dokumen || '',
        nomor_revisi: item.nomor_revisi || '',
        penyusun: item.penyusun || '',
        disahkan_oleh: item.disahkan_oleh || '',
        tanggal_dokumen: item.tanggal_dokumen ? item.tanggal_dokumen.split('T')[0] : ''
      });
      setFiles({ file_dokumen: null, file_pendukung: null });
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen?',
      text: "Data yang dihapus tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/dokumen-mutu/${id}`);
        Swal.fire('Terhapus!', 'Dokumen berhasil dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal', error.response?.data?.message || 'Gagal menghapus data', 'error');
      }
    }
  };

  // --- SUBMIT HANDLE (CREATE & UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!formData.nama_dokumen || !formData.jenis_dokumen) {
      Swal.fire('Warning', 'Nama Dokumen dan Jenis Dokumen wajib diisi!', 'warning');
      return;
    }

    const dataPayload = new FormData();
    
    // 1. Append Text Data
    Object.keys(formData).forEach(key => {
      if (formData[key]) {
        dataPayload.append(key, formData[key]);
      }
    });

    // 2. Append Files (Sesuai nama field di Backend)
    if (files.file_dokumen) {
      dataPayload.append('file_dokumen', files.file_dokumen);
    }
    if (files.file_pendukung) {
      dataPayload.append('file_pendukung', files.file_pendukung);
    }

    try {
      Swal.fire({ title: 'Menyimpan...', allowOutsideClick: false, didOpen: () => Swal.showLoading() });

      if (modalType === 'create') {
        await api.post('/admin/dokumen-mutu', dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Berhasil', 'Dokumen mutu berhasil ditambahkan', 'success');
      } else {
        await api.put(`/admin/dokumen-mutu/${selectedItem.id_dokumen}`, dataPayload, {
          headers: { 'Content-Type': 'multipart/form-data' }
        });
        Swal.fire('Berhasil', 'Dokumen mutu berhasil diperbarui', 'success');
      }

      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan server', 'error');
    }
  };

  // --- FILTER & PAGINATION ---
  const filteredData = data.filter(item => {
    const matchSearch = item.nama_dokumen.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        (item.nomor_dokumen && item.nomor_dokumen.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchJenis = filterJenis ? item.jenis_dokumen === filterJenis : true;
    return matchSearch && matchJenis;
  });

  const totalPages = Math.ceil(filteredData.length / pagination.limit);
  const paginatedData = filteredData.slice(
    (pagination.page - 1) * pagination.limit,
    pagination.page * pagination.limit
  );

  return (
    <div className="dokumen-container">
      {/* Header */}
      <div className="header-section">
        <div className="title-box">
          <h2>Dokumen Mutu</h2>
          <p>Manajemen dokumen ISO 9001:2015 & regulasi LSP</p>
        </div>
        <button className="btn-create" onClick={() => openModal('create')}>
          <Plus size={18}/> Tambah Dokumen
        </button>
      </div>

      {/* Filter Toolbar */}
      <div className="filter-section">
        <div className="search-box">
          <Search className="search-icon" size={18}/>
          <input 
            type="text" 
            placeholder="Cari Nama / No. Dokumen..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="filter-dropdown">
            <Filter size={18} className="filter-icon"/>
            <select value={filterJenis} onChange={(e) => setFilterJenis(e.target.value)}>
                <option value="">Semua Jenis</option>
                <option value="kebijakan_mutu">Kebijakan Mutu</option>
                <option value="manual_mutu">Manual Mutu</option>
                <option value="standar_mutu">Standar Mutu</option>
                <option value="formulir_mutu">Formulir Mutu</option>
                <option value="referensi">Referensi</option>
            </select>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        <table className="custom-table">
          <thead>
            <tr>
              <th>No</th>
              <th>Nama Dokumen</th>
              <th>Jenis</th>
              <th>No. Dokumen</th>
              <th>Revisi</th>
              <th>Tanggal</th>
              <th>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/> Loading...</td></tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id_dokumen}>
                  <td className="text-center">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="font-medium">{item.nama_dokumen}</td>
                  <td>
                    <span className={`badge-jenis ${item.jenis_dokumen}`}>
                      {item.jenis_dokumen.replace('_', ' ')}
                    </span>
                  </td>
                  <td>{item.nomor_dokumen || '-'}</td>
                  <td className="text-center">{item.nomor_revisi || '-'}</td>
                  <td>{item.tanggal_dokumen ? new Date(item.tanggal_dokumen).toLocaleDateString('id-ID') : '-'}</td>
                  <td>
                    <div className="action-buttons">
                      <button className="btn-icon view" title="Detail" onClick={() => openModal('detail', item)}>
                        <Eye size={16}/>
                      </button>
                      <button className="btn-icon edit" title="Edit" onClick={() => openModal('edit', item)}>
                        <Edit2 size={16}/>
                      </button>
                      <button className="btn-icon delete" title="Hapus" onClick={() => handleDelete(item.id_dokumen)}>
                        <Trash2 size={16}/>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr><td colSpan="7" className="text-center py-6 text-gray-500">Data tidak ditemukan.</td></tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination */}
      {filteredData.length > pagination.limit && (
        <div className="pagination-footer">
            <span className="page-info">
                Halaman {pagination.page} dari {totalPages}
            </span>
            <div className="page-nav">
                <button 
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    <ChevronLeft size={16}/>
                </button>
                <button 
                    disabled={pagination.page >= totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    <ChevronRight size={16}/>
                </button>
            </div>
        </div>
      )}

      {/* --- MODAL FORM / DETAIL --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content large">
            <div className="modal-header">
              <h3>
                {modalType === 'create' && <><Plus size={20}/> Tambah Dokumen Baru</>}
                {modalType === 'edit' && <><Edit2 size={18}/> Edit Dokumen Mutu</>}
                {modalType === 'detail' && <><Eye size={18}/> Detail Dokumen</>}
              </h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="modal-form">
              <div className="scrollable-body">
                
                {/* Informasi Utama */}
                <h4 className="section-title">Informasi Dokumen</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label>Jenis Dokumen <span className="text-red-500">*</span></label>
                        <select 
                            name="jenis_dokumen" 
                            value={formData.jenis_dokumen} 
                            onChange={handleInputChange}
                            disabled={modalType === 'detail'}
                        >
                            <option value="kebijakan_mutu">Kebijakan Mutu</option>
                            <option value="manual_mutu">Manual Mutu</option>
                            <option value="standar_mutu">Standar Mutu</option>
                            <option value="formulir_mutu">Formulir Mutu</option>
                            <option value="referensi">Referensi</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kategori</label>
                        <input 
                            type="text" 
                            name="kategori" 
                            value={formData.kategori} 
                            onChange={handleInputChange} 
                            placeholder="Contoh: Internal / Eksternal"
                            readOnly={modalType === 'detail'}
                        />
                    </div>
                </div>

                <div className="form-group">
                    <label>Nama Dokumen <span className="text-red-500">*</span></label>
                    <input 
                        type="text" 
                        name="nama_dokumen" 
                        value={formData.nama_dokumen} 
                        onChange={handleInputChange} 
                        placeholder="Nama dokumen lengkap"
                        readOnly={modalType === 'detail'}
                        required
                    />
                </div>

                <div className="form-group">
                    <label>Deskripsi</label>
                    <textarea 
                        name="deskripsi" 
                        value={formData.deskripsi} 
                        onChange={handleInputChange} 
                        rows="3"
                        readOnly={modalType === 'detail'}
                    ></textarea>
                </div>

                <h4 className="section-title">Detail Teknis</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label>Nomor Dokumen</label>
                        <input type="text" name="nomor_dokumen" value={formData.nomor_dokumen} onChange={handleInputChange} readOnly={modalType === 'detail'} />
                    </div>
                    <div className="form-group">
                        <label>Nomor Revisi</label>
                        <input type="text" name="nomor_revisi" value={formData.nomor_revisi} onChange={handleInputChange} readOnly={modalType === 'detail'} />
                    </div>
                    <div className="form-group">
                        <label>Tanggal Dokumen</label>
                        <input type="date" name="tanggal_dokumen" value={formData.tanggal_dokumen} onChange={handleInputChange} readOnly={modalType === 'detail'} />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Penyusun</label>
                        <input type="text" name="penyusun" value={formData.penyusun} onChange={handleInputChange} readOnly={modalType === 'detail'} />
                    </div>
                    <div className="form-group">
                        <label>Disahkan Oleh</label>
                        <input type="text" name="disahkan_oleh" value={formData.disahkan_oleh} onChange={handleInputChange} readOnly={modalType === 'detail'} />
                    </div>
                </div>

                {/* Upload File Section - Disesuaikan dengan Backend */}
                <h4 className="section-title">Upload File</h4>
                
                <div className="form-group">
                    <label>File Dokumen Utama (PDF/Doc)</label>
                    {modalType !== 'detail' && (
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'file_dokumen')} 
                            className="file-input-base" 
                            accept=".pdf,.doc,.docx"
                        />
                    )}
                    {selectedItem?.file_dokumen && (
                        <div className="file-preview">
                            <FileText size={16} className="text-blue-600"/>
                            <span>File: <strong>{selectedItem.file_dokumen}</strong></span>
                        </div>
                    )}
                </div>

                <div className="form-group">
                    <label>File Pendukung (Lampiran)</label>
                    {modalType !== 'detail' && (
                        <input 
                            type="file" 
                            onChange={(e) => handleFileChange(e, 'file_pendukung')} 
                            className="file-input-base"
                            accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                        />
                    )}
                    {selectedItem?.file_pendukung && (
                        <div className="file-preview">
                            <FileText size={16} className="text-green-600"/>
                            <span>File: <strong>{selectedItem.file_pendukung}</strong></span>
                        </div>
                    )}
                </div>

              </div>
              
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>
                  {modalType === 'detail' ? 'Tutup' : 'Batal'}
                </button>
                {modalType !== 'detail' && (
                  <button type="submit" className="btn-save">
                    <Save size={16}/> Simpan
                  </button>
                )}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default DokumenMutu;