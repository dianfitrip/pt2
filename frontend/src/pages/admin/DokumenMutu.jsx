import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, FileText, 
  Filter, Loader2, ChevronLeft, ChevronRight 
} from 'lucide-react';
import './adminstyles/DokumenMutu.css'; 

const DokumenMutu = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterJenis, setFilterJenis] = useState(''); 
  
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); // 'create', 'edit', 'detail'
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Pagination (Client Side)
  const [pagination, setPagination] = useState({ page: 1, limit: 10 });

  // Form State
  const initialFormState = {
    jenis_dokumen: 'kebijakan_mutu',
    kategori: '',
    nama_dokumen: '',
    deskripsi: '',
    nomor_dokumen: '',
    nomor_revisi: '',
    penyusun: '',
    disahkan_oleh: '',
    tanggal_dokumen: ''
  };
  const [formData, setFormData] = useState(initialFormState);

  // State Khusus File
  const [files, setFiles] = useState({
    file_dokumen: null,
    file_pendukung: null
  });

  // --- FETCH DATA (LOGIKA SUPER AMAN) ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/dokumen-mutu');
      
      // Tangkap response (Bisa dari axios langsung atau via interceptor)
      const resBody = response.data !== undefined ? response.data : response;

      // Cari letak array datanya
      let listData = [];
      if (Array.isArray(resBody.data)) {
          listData = resBody.data;
      } else if (resBody.data?.data && Array.isArray(resBody.data.data)) {
          listData = resBody.data.data;
      } else if (Array.isArray(resBody)) {
          listData = resBody;
      }

      setData(listData);

    } catch (error) {
      console.error("Error Fetching:", error);
      Swal.fire({
        title: 'Gagal', 
        text: error.response?.data?.message || 'Gagal mengambil data dari server.', 
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
    if (file) {
      setFiles(prev => ({
        ...prev,
        [fieldName]: file
      }));
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    setShowModal(true);

    if (type === 'create') {
      setFormData(initialFormState);
      setFiles({ file_dokumen: null, file_pendukung: null });
    } else if (item) {
      setFormData({
        jenis_dokumen: item.jenis_dokumen || 'kebijakan_mutu',
        kategori: item.kategori || '',
        nama_dokumen: item.nama_dokumen || '',
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
      Swal.fire('Peringatan', 'Nama Dokumen dan Jenis Dokumen wajib diisi!', 'warning');
      return;
    }

    const dataPayload = new FormData();
    
    // 1. Masukkan semua data teks ke FormData
    Object.keys(formData).forEach(key => {
      // Jangan masukkan nilai kosong
      if (formData[key] !== null && formData[key] !== '') {
        dataPayload.append(key, formData[key]);
      }
    });

    // 2. Masukkan file jika ada
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
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menyimpan', 'error');
    }
  };

  // --- FILTER & PAGINATION ---
  const filteredData = data.filter(item => {
    const matchSearch = item.nama_dokumen?.toLowerCase().includes(searchTerm.toLowerCase()) || 
                        item.nomor_dokumen?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchJenis = filterJenis ? item.jenis_dokumen === filterJenis : true;
    return matchSearch && matchJenis;
  });

  const totalPages = Math.ceil(filteredData.length / pagination.limit) || 1;
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
      <div className="filter-section flex flex-wrap gap-4 items-center">
        <div className="search-box flex-grow">
          <Search className="search-icon" size={18}/>
          <input 
            type="text" 
            placeholder="Cari Nama / No. Dokumen..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination(prev => ({ ...prev, page: 1 })); // Reset hal ke 1 saat ngetik
            }}
          />
        </div>
        <div className="filter-dropdown min-w-[200px]">
            <Filter size={18} className="filter-icon"/>
            <select 
              value={filterJenis} 
              onChange={(e) => {
                setFilterJenis(e.target.value);
                setPagination(prev => ({ ...prev, page: 1 }));
              }}
            >
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
      <div className="table-wrapper mt-4">
        <table className="custom-table w-full text-left border-collapse">
          <thead>
            <tr>
              <th className="p-3 border-b">No</th>
              <th className="p-3 border-b">Nama Dokumen</th>
              <th className="p-3 border-b">Jenis</th>
              <th className="p-3 border-b">No. Dokumen</th>
              <th className="p-3 border-b text-center">Revisi</th>
              <th className="p-3 border-b">Tanggal</th>
              <th className="p-3 border-b text-center">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr><td colSpan="7" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-blue-500"/> Loading...</td></tr>
            ) : paginatedData.length > 0 ? (
              paginatedData.map((item, index) => (
                <tr key={item.id_dokumen} className="hover:bg-gray-50 border-b">
                  <td className="p-3 text-center">{(pagination.page - 1) * pagination.limit + index + 1}</td>
                  <td className="p-3 font-medium">{item.nama_dokumen}</td>
                  <td className="p-3">
                    <span className={`px-2 py-1 text-xs rounded-full font-semibold badge-jenis ${item.jenis_dokumen}`}>
                      {item.jenis_dokumen?.replace('_', ' ')}
                    </span>
                  </td>
                  <td className="p-3">{item.nomor_dokumen || '-'}</td>
                  <td className="p-3 text-center">{item.nomor_revisi || '-'}</td>
                  <td className="p-3">{item.tanggal_dokumen ? new Date(item.tanggal_dokumen).toLocaleDateString('id-ID') : '-'}</td>
                  <td className="p-3">
                    <div className="action-buttons flex justify-center gap-2">
                      <button className="text-blue-500 hover:text-blue-700 p-1" title="Detail" onClick={() => openModal('detail', item)}>
                        <Eye size={18}/>
                      </button>
                      <button className="text-orange-500 hover:text-orange-700 p-1" title="Edit" onClick={() => openModal('edit', item)}>
                        <Edit2 size={18}/>
                      </button>
                      <button className="text-red-500 hover:text-red-700 p-1" title="Hapus" onClick={() => handleDelete(item.id_dokumen)}>
                        <Trash2 size={18}/>
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

      {/* Pagination Footer */}
      {filteredData.length > 0 && (
        <div className="flex justify-between items-center mt-4 text-sm text-gray-600">
            <span>
                Menampilkan {(pagination.page - 1) * pagination.limit + 1} - {Math.min(pagination.page * pagination.limit, filteredData.length)} dari {filteredData.length} data
            </span>
            <div className="flex gap-2">
                <button 
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled={pagination.page === 1}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page - 1 }))}
                >
                    <ChevronLeft size={18}/>
                </button>
                <span className="px-3 py-1 font-medium bg-gray-100 rounded">
                    {pagination.page} / {totalPages}
                </span>
                <button 
                    className="p-1 border rounded hover:bg-gray-100 disabled:opacity-50"
                    disabled={pagination.page >= totalPages}
                    onClick={() => setPagination(prev => ({ ...prev, page: prev.page + 1 }))}
                >
                    <ChevronRight size={18}/>
                </button>
            </div>
        </div>
      )}

      {/* --- MODAL FORM --- */}
      {showModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-3xl flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold flex items-center gap-2 text-gray-800">
                {modalType === 'create' && <><Plus size={20} className="text-blue-600"/> Tambah Dokumen Baru</>}
                {modalType === 'edit' && <><Edit2 size={20} className="text-orange-600"/> Edit Dokumen Mutu</>}
                {modalType === 'detail' && <><Eye size={20} className="text-gray-600"/> Detail Dokumen</>}
              </h3>
              <button className="text-gray-400 hover:text-gray-600 transition-colors" onClick={() => setShowModal(false)}>
                <X size={24}/>
              </button>
            </div>
            
            {/* Modal Body */}
            <form onSubmit={handleSubmit} className="flex flex-col overflow-hidden h-full">
              <div className="overflow-y-auto p-6 space-y-6">
                
                {/* Section 1: Info Utama */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Informasi Dokumen</h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Jenis Dokumen <span className="text-red-500">*</span></label>
                          <select 
                              className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none"
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
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Kategori</label>
                          <input 
                              className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                              type="text" 
                              name="kategori" 
                              value={formData.kategori} 
                              onChange={handleInputChange} 
                              placeholder="Contoh: Internal / Eksternal"
                              disabled={modalType === 'detail'}
                          />
                      </div>
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                      <label className="text-sm font-medium text-gray-600">Nama Dokumen <span className="text-red-500">*</span></label>
                      <input 
                          className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                          type="text" 
                          name="nama_dokumen" 
                          value={formData.nama_dokumen} 
                          onChange={handleInputChange} 
                          placeholder="Nama dokumen lengkap"
                          disabled={modalType === 'detail'}
                          required
                      />
                  </div>

                  <div className="flex flex-col gap-1 mt-4">
                      <label className="text-sm font-medium text-gray-600">Deskripsi</label>
                      <textarea 
                          className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                          name="deskripsi" 
                          value={formData.deskripsi} 
                          onChange={handleInputChange} 
                          rows="3"
                          disabled={modalType === 'detail'}
                      ></textarea>
                  </div>
                </div>

                {/* Section 2: Detail Teknis */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Detail Teknis</h4>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Nomor Dokumen</label>
                          <input 
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                            type="text" name="nomor_dokumen" value={formData.nomor_dokumen} onChange={handleInputChange} disabled={modalType === 'detail'} 
                          />
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Nomor Revisi</label>
                          <input 
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                            type="text" name="nomor_revisi" value={formData.nomor_revisi} onChange={handleInputChange} disabled={modalType === 'detail'} 
                          />
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Tanggal Dokumen</label>
                          <input 
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                            type="date" name="tanggal_dokumen" value={formData.tanggal_dokumen} onChange={handleInputChange} disabled={modalType === 'detail'} 
                          />
                      </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Penyusun</label>
                          <input 
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                            type="text" name="penyusun" value={formData.penyusun} onChange={handleInputChange} disabled={modalType === 'detail'} 
                          />
                      </div>
                      <div className="flex flex-col gap-1">
                          <label className="text-sm font-medium text-gray-600">Disahkan Oleh</label>
                          <input 
                            className="border p-2 rounded focus:ring-2 focus:ring-blue-200 outline-none disabled:bg-gray-50"
                            type="text" name="disahkan_oleh" value={formData.disahkan_oleh} onChange={handleInputChange} disabled={modalType === 'detail'} 
                          />
                      </div>
                  </div>
                </div>

                {/* Section 3: File Upload */}
                <div>
                  <h4 className="font-semibold text-gray-700 mb-4 border-b pb-2">Upload File</h4>
                  <div className="space-y-4 bg-gray-50 p-4 rounded-lg border border-dashed border-gray-300">
                    
                    <div className="flex flex-col gap-2">
                        <label className="text-sm font-medium text-gray-700">File Dokumen Utama (PDF/Docx)</label>
                        {modalType !== 'detail' && (
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, 'file_dokumen')} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100" 
                                accept=".pdf,.doc,.docx"
                            />
                        )}
                        {selectedItem?.file_dokumen && (
                            <div className="flex items-center gap-2 mt-1 text-sm bg-white p-2 border rounded shadow-sm w-max">
                                <FileText size={16} className="text-blue-600"/>
                                <a href={`http://localhost:3000/uploads/${selectedItem.file_dokumen}`} target="_blank" rel="noreferrer" className="text-blue-600 hover:underline">
                                  {selectedItem.file_dokumen}
                                </a>
                            </div>
                        )}
                    </div>

                    <div className="flex flex-col gap-2 pt-2 border-t border-gray-200 border-dashed">
                        <label className="text-sm font-medium text-gray-700">File Pendukung / Lampiran</label>
                        {modalType !== 'detail' && (
                            <input 
                                type="file" 
                                onChange={(e) => handleFileChange(e, 'file_pendukung')} 
                                className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded file:border-0 file:text-sm file:font-semibold file:bg-green-50 file:text-green-700 hover:file:bg-green-100"
                                accept=".pdf,.doc,.docx,.xls,.xlsx,.jpg,.png"
                            />
                        )}
                        {selectedItem?.file_pendukung && (
                            <div className="flex items-center gap-2 mt-1 text-sm bg-white p-2 border rounded shadow-sm w-max">
                                <FileText size={16} className="text-green-600"/>
                                <a href={`http://localhost:3000/uploads/${selectedItem.file_pendukung}`} target="_blank" rel="noreferrer" className="text-green-600 hover:underline">
                                  {selectedItem.file_pendukung}
                                </a>
                            </div>
                        )}
                    </div>

                  </div>
                </div>

              </div>
              
              {/* Modal Footer */}
              <div className="p-5 border-t bg-gray-50 flex justify-end gap-3 rounded-b-lg">
                <button type="button" className="px-4 py-2 bg-gray-200 text-gray-700 rounded hover:bg-gray-300 transition-colors font-medium" onClick={() => setShowModal(false)}>
                  {modalType === 'detail' ? 'Tutup' : 'Batal'}
                </button>
                {modalType !== 'detail' && (
                  <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors font-medium flex items-center gap-2">
                    <Save size={18}/> Simpan
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