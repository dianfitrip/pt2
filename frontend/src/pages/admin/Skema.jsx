import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { useNavigate } from 'react-router-dom';
import { 
  Search, Plus, Edit2, Trash2, X, Save, Loader2, FileText, Upload 
} from 'lucide-react';
import './adminstyles/Skema.css'; 

const Skema = () => {
  const navigate = useNavigate();
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // --- STATE KHUSUS FILE ---
  const [selectedFile, setSelectedFile] = useState(null);

  // State Form (Default)
  const initialFormState = {
    kode_skema: '',
    judul_skema: '',
    judul_skema_en: '',
    jenis_skema: 'kkni',
    level_kkni: '', 
    bidang_okupasi: '',
    kode_sektor: '',
    kode_kbli: '',
    kode_kbji: '',
    keterangan_bukti: '',
    skor_min_ai05: '',
    kedalaman_bukti: 'elemen_kompetensi',
    dokumen: '', // Hanya untuk menyimpan nama file lama saat edit
    status: 'draft'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/skema');
      const resultData = response.data.data || [];
      setData(resultData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire('Error', 'Gagal memuat data skema', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS ---
  
  // 1. Handler untuk Input Teks Biasa
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  // 2. Handler KHUSUS untuk Input File
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file); // Simpan file objek ke state
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_skema);
    setSelectedFile(null); // Reset file saat edit dibuka
    
    setFormData({
      kode_skema: item.kode_skema || '',
      judul_skema: item.judul_skema || '',
      judul_skema_en: item.judul_skema_en || '',
      jenis_skema: item.jenis_skema || 'kkni',
      level_kkni: item.level_kkni || '',
      bidang_okupasi: item.bidang_okupasi || '',
      kode_sektor: item.kode_sektor || '',
      kode_kbli: item.kode_kbli || '',
      kode_kbji: item.kode_kbji || '',
      keterangan_bukti: item.keterangan_bukti || '',
      skor_min_ai05: item.skor_min_ai05 || '',
      kedalaman_bukti: item.kedalaman_bukti || 'elemen_kompetensi',
      dokumen: item.dokumen || '', // Nama file lama
      status: item.status || 'draft'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Skema?',
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/skema/${id}`);
        Swal.fire('Terhapus!', 'Skema telah dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal menghapus data', 'error');
      }
    }
  };

  // --- 3. HANDLE SUBMIT (PENTING: Pakai FormData) ---
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Gunakan FormData agar bisa kirim File + Teks ke Backend
    const dataToSend = new FormData();

    // Masukkan data teks
    Object.keys(formData).forEach(key => {
      // Jangan kirim null atau 'dokumen' string (karena dokumen dikirim sbg file)
      if (key !== 'dokumen' && formData[key] !== null && formData[key] !== undefined) {
        dataToSend.append(key, formData[key]);
      }
    });

    // Masukkan File jika ada file baru dipilih
    if (selectedFile) {
      dataToSend.append('dokumen', selectedFile);
    }

    // Config Header agar backend tahu ini file upload
    const config = {
      headers: { 'Content-Type': 'multipart/form-data' }
    };

    try {
      if (isEditMode) {
        await api.put(`/admin/skema/${currentId}`, dataToSend, config);
        Swal.fire('Berhasil', 'Data skema diperbarui', 'success');
      } else {
        await api.post('/admin/skema', dataToSend, config);
        Swal.fire('Berhasil', 'Skema baru ditambahkan', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan saat menyimpan', 'error');
    }
  };

  // --- FILTER ---
  const filteredData = data.filter(item => 
    (item.judul_skema && item.judul_skema.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.kode_skema && item.kode_skema.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="skema-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 className="page-title">Data Skema Sertifikasi</h1>
          <p className="page-subtitle">Kelola daftar skema kompetensi LSP</p>
        </div>
        <div className="action-buttons-group">
          <button 
            className="btn-create bg-blue-600 text-white hover:bg-blue-700"
            onClick={() => {
              setFormData(initialFormState);
              setSelectedFile(null);
              setIsEditMode(false);
              setShowModal(true);
            }}
          >
            <Plus size={18} /> Tambah Skema
          </button>
        </div>
      </div>

      {/* Search Bar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari kode atau judul skema..." 
          className="bg-transparent border-none focus:outline-none w-full text-slate-700 placeholder-slate-400"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4 w-32">Kode</th>
                <th className="px-6 py-4">Judul Skema</th>
                <th className="px-6 py-4 w-32 text-center">Status</th>
                <th className="px-6 py-4 text-center w-64">Kelola Persyaratan</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Belum ada data skema</td></tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id_skema} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4 font-mono text-xs font-semibold text-slate-600">{item.kode_skema}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.judul_skema}</div>
                      <div className="text-xs text-slate-500 mt-1">
                        {item.jenis_skema.toUpperCase()} {item.level_kkni ? `| Level ${item.level_kkni}` : ''}
                      </div>
                      
                      {/* Link Dokumen Jika Ada */}
                      {item.dokumen && (
                        <div className="mt-1">
                           <a 
                             href={`${import.meta.env.VITE_API_URL}${item.dokumen}`} 
                             target="_blank" 
                             rel="noreferrer" 
                             className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                           >
                             <FileText size={10} /> Lihat Dokumen
                           </a>
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border capitalize
                        ${item.status === 'aktif' ? 'bg-green-50 text-green-600 border-green-200' : 
                          item.status === 'nonaktif' ? 'bg-red-50 text-red-600 border-red-200' : 
                          'bg-yellow-50 text-yellow-600 border-yellow-200'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    
                    {/* TOMBOL KELOLA (Tanpa Icon) */}
                    <td className="px-6 py-4 text-center">
                      <div className="flex flex-col gap-2 justify-center">
                        <button 
                          onClick={() => navigate(`/admin/skema/${item.id_skema}/persyaratan`)}
                          className="px-3 py-1 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition-colors"
                        >
                          Persyaratan Dasar
                        </button>
                        <button 
                          onClick={() => navigate(`/admin/skema/${item.id_skema}/persyaratan-tuk`)}
                          className="px-3 py-1 bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100 text-xs font-bold transition-colors"
                        >
                          Persyaratan TUK
                        </button>
                      </div>
                    </td>

                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-600 p-1" title="Edit">
                          <Edit2 size={18} />
                        </button>
                        <button onClick={() => handleDelete(item.id_skema)} className="text-red-500 hover:text-red-600 p-1" title="Hapus">
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden animate-slide-up max-h-[90vh] flex flex-col">
            <div className="modal-header">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Edit Skema' : 'Tambah Skema Baru'}
              </h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <div className="modal-body-scroll flex-1 overflow-y-auto p-6">
              <form id="skemaForm" onSubmit={handleSubmit}>
                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Kode Skema</label>
                    <input type="text" name="kode_skema" value={formData.kode_skema} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label>Status Skema</label>
                    <select name="status" value={formData.status} onChange={handleInputChange}>
                      <option value="draft">Draft</option>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Judul Skema (Indonesia)</label>
                  <input type="text" name="judul_skema" value={formData.judul_skema} onChange={handleInputChange} required />
                </div>
                <div className="form-group">
                  <label>Judul Skema (Inggris)</label>
                  <input type="text" name="judul_skema_en" value={formData.judul_skema_en} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Jenis Skema</label>
                    <select name="jenis_skema" value={formData.jenis_skema} onChange={handleInputChange}>
                      <option value="kkni">KKNI</option>
                      <option value="okupasi">Okupasi</option>
                      <option value="klaster">Klaster</option>
                    </select>
                  </div>
                  
                  {/* Dropdown Level 1-9 */}
                  <div className="form-group">
                    <label>Level KKNI</label>
                    <select name="level_kkni" value={formData.level_kkni} onChange={handleInputChange}>
                      <option value="">-- Pilih Level --</option>
                      {[1,2,3,4,5,6,7,8,9].map(num => <option key={num} value={num}>{num}</option>)}
                    </select>
                  </div>
                </div>

                <div className="form-group">
                  <label>Bidang Okupasi</label>
                  <input type="text" name="bidang_okupasi" value={formData.bidang_okupasi} onChange={handleInputChange} />
                </div>

                <div className="grid grid-cols-3 gap-4">
                  <div className="form-group">
                    <label>Kode Sektor</label>
                    <input type="text" name="kode_sektor" value={formData.kode_sektor} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Kode KBLI</label>
                    <input type="text" name="kode_kbli" value={formData.kode_kbli} onChange={handleInputChange} />
                  </div>
                  <div className="form-group">
                    <label>Kode KBJI</label>
                    <input type="text" name="kode_kbji" value={formData.kode_kbji} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Kedalaman Bukti</label>
                    <select name="kedalaman_bukti" value={formData.kedalaman_bukti} onChange={handleInputChange}>
                      <option value="elemen_kompetensi">Elemen Kompetensi</option>
                      <option value="kriteria_unjuk_kerja">Kriteria Unjuk Kerja</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Skor Min. AI 05</label>
                    <input type="number" name="skor_min_ai05" value={formData.skor_min_ai05} onChange={handleInputChange} />
                  </div>
                </div>

                <div className="form-group">
                  <label>Keterangan Bukti</label>
                  <textarea name="keterangan_bukti" rows="3" value={formData.keterangan_bukti} onChange={handleInputChange} className="w-full p-2 border rounded-lg"></textarea>
                </div>
                
                {/* --- PERUBAHAN UTAMA: INPUT FILE --- */}
                <div className="form-group bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <label className="text-blue-800 font-semibold mb-2 flex items-center gap-2">
                    <Upload size={16}/> Unggah Dokumen Skema (PDF/DOC)
                  </label>
                  
                  {/* Hanya Input ini yang handleFileChange */}
                  <input 
                    type="file" 
                    name="dokumen" 
                    onChange={handleFileChange} 
                    accept=".pdf,.doc,.docx"
                    className="block w-full text-sm text-slate-500
                      file:mr-4 file:py-2 file:px-4
                      file:rounded-full file:border-0
                      file:text-sm file:font-semibold
                      file:bg-blue-50 file:text-blue-700
                      hover:file:bg-blue-100
                    "
                  />
                  
                  {/* Pesan jika file sudah ada (saat edit) */}
                  {isEditMode && formData.dokumen && !selectedFile && (
                    <div className="flex items-center gap-2 mt-2 text-xs text-green-600 bg-white p-2 rounded border border-green-100 w-fit">
                      <FileText size={14} />
                      <span>File Tersimpan: {formData.dokumen.split('/').pop()}</span>
                    </div>
                  )}
                </div>
                {/* ------------------------------------- */}

              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
              <button type="submit" form="skemaForm" className="btn-save"><Save size={16}/> Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skema;