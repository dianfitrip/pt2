import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Eye, Trash2, X, Save, 
  Gavel, User, FileText, Calendar, CheckCircle, XCircle, Clock, Loader2, ChevronLeft, ChevronRight
} from 'lucide-react';
import './adminstyles/Banding.css'; 

const Banding = () => {
  // --- STATE ---
  const [data, setData] = useState([]); // Data mentah dari API
  const [filteredData, setFilteredData] = useState([]); // Data setelah disearch
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // Form State untuk Update
  const [formUpdate, setFormUpdate] = useState({
    status_progress: '',
    keputusan: '',
    catatan_komite: ''
  });

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  // Filter data setiap kali search term atau data berubah
  useEffect(() => {
    if (!data) return;
    
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      const noPendaftaran = item.no_pendaftaran?.toLowerCase() || '';
      const emailUser = item.user?.email?.toLowerCase() || '';
      const ket = item.keterangan_banding?.toLowerCase() || '';
      
      return noPendaftaran.includes(lowerTerm) || 
             emailUser.includes(lowerTerm) || 
             ket.includes(lowerTerm);
    });
    
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Backend: bandingController.getAllBanding
      // Mengambil semua data array langsung (tanpa pagination server-side sementara)
      const response = await api.get('/admin/banding');
      const result = response.data.data || [];
      
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching banding:", error);
      Swal.fire("Error", "Gagal memuat data banding", "error");
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  
  const handleDetailClick = (item) => {
    setSelectedItem(item);
    setFormUpdate({
      status_progress: item.status_progress || 'diterima_admin',
      keputusan: item.keputusan || 'belum_diputus',
      catatan_komite: item.catatan_komite || ''
    });
    setShowModal(true);
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    if (!selectedItem) return;

    try {
      await api.put(`/admin/banding/${selectedItem.id_banding}`, formUpdate);
      
      Swal.fire({
        icon: 'success',
        title: 'Berhasil',
        text: 'Status banding telah diperbarui',
        timer: 1500
      });
      
      setShowModal(false);
      fetchData(); // Refresh data
    } catch (error) {
      console.error("Update error:", error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat update', 'error');
    }
  };

  // Helper untuk warna badge status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'selesai': return 'bg-green-100 text-green-800';
      case 'on_review': return 'bg-blue-100 text-blue-800';
      case 'ditolak': return 'bg-red-100 text-red-800';
      default: return 'bg-yellow-100 text-yellow-800';
    }
  };

  const getKeputusanBadge = (keputusan) => {
    if (keputusan === 'diterima') return <span className="flex items-center text-green-600 gap-1 font-medium"><CheckCircle size={14}/> Diterima</span>;
    if (keputusan === 'ditolak') return <span className="flex items-center text-red-600 gap-1 font-medium"><XCircle size={14}/> Ditolak</span>;
    return <span className="flex items-center text-gray-500 gap-1 font-medium"><Clock size={14}/> Belum Diputus</span>;
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric'
    });
  };

  return (
    <div className="banding-container">
      {/* HEADER PAGE */}
      <div className="header-section">
        <div className="title-box">
          <h2>Data Banding Asesmen</h2>
          <p>Kelola pengajuan banding dan keputusan pleno.</p>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="content-card">
        
        {/* --- TOOLBAR (SEARCH & TITLE) --- */}
        <div className="table-toolbar">
          <div className="toolbar-title">
            <h4>Daftar Pengajuan</h4>
          </div>
          <div className="toolbar-actions">
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Cari No Pendaftaran / Email..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="p-12 text-center flex flex-col items-center justify-center text-gray-500">
            <Loader2 className="animate-spin mb-2 text-orange-500" size={32} />
            <p>Sedang memuat data...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Asesi</th>
                  <th>Keterangan Banding</th>
                  <th>Status</th>
                  <th>Keputusan</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id_banding}>
                      <td>{index + 1}</td>
                      <td>{formatDate(item.tanggal_ajukan)}</td>
                      <td>
                        <div className="flex flex-col">
                          <span className="font-medium text-gray-800">{item.user?.username || 'User'}</span>
                          <span className="text-xs text-gray-500">{item.user?.email}</span>
                        </div>
                      </td>
                      <td>
                        <div className="max-w-xs truncate" title={item.keterangan_banding}>
                          <span className="font-mono text-xs block text-gray-500 mb-1">{item.no_pendaftaran}</span>
                          {item.keterangan_banding}
                        </div>
                      </td>
                      <td>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold ${getStatusBadge(item.status_progress)}`}>
                          {item.status_progress?.replace('_', ' ').toUpperCase()}
                        </span>
                      </td>
                      <td>{getKeputusanBadge(item.keputusan)}</td>
                      <td className="text-center">
                        <button 
                          className="btn-icon view" 
                          onClick={() => handleDetailClick(item)}
                          title="Proses & Detail"
                        >
                          <Gavel size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="7" className="text-center py-8 text-gray-500">
                      <div className="flex flex-col items-center justify-center">
                        <FileText size={48} className="text-gray-300 mb-2"/>
                        <p>Tidak ada data banding ditemukan.</p>
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL PROSES BANDING */}
      {showModal && selectedItem && (
        <div className="modal-backdrop">
          <div className="modal-card wide-modal">
            <div className="modal-header-modern">
              <h3><Gavel size={20} className="inline mr-2"/> Proses Banding Asesmen</h3>
              <button className="btn-close-modern" onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            
            <form onSubmit={handleUpdate} className="modal-body-scroll">
              
              {/* INFO DETAIL */}
              <div className="bg-slate-50 p-5 rounded-lg mb-6 border border-slate-200">
                <h4 className="text-sm font-bold text-slate-700 mb-4 flex items-center border-b pb-2 border-slate-200">
                  <FileText size={16} className="mr-2"/> Detail Pengajuan
                </h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <label className="text-slate-500 text-xs uppercase font-semibold">No Pendaftaran</label>
                    <p className="font-medium text-slate-800">{selectedItem.no_pendaftaran}</p>
                  </div>
                  <div>
                    <label className="text-slate-500 text-xs uppercase font-semibold">Tanggal Pengajuan</label>
                    <p className="font-medium text-slate-800">{formatDate(selectedItem.tanggal_ajukan)}</p>
                  </div>
                  <div className="md:col-span-2">
                    <label className="text-slate-500 text-xs uppercase font-semibold">Alasan Banding</label>
                    <div className="bg-white p-3 border border-slate-200 rounded mt-1 text-slate-700 leading-relaxed">
                      {selectedItem.keterangan_banding}
                    </div>
                  </div>
                  
                  {/* Link Bukti */}
                  {selectedItem.file_bukti && (
                    <div className="md:col-span-2 mt-2">
                      <label className="text-slate-500 text-xs uppercase font-semibold">File Bukti Pendukung</label>
                      <a 
                        href={`http://localhost:3000/uploads/${selectedItem.file_bukti}`} 
                        target="_blank" 
                        rel="noreferrer"
                        className="text-blue-600 hover:text-blue-800 hover:underline flex items-center gap-2 mt-1 font-medium"
                      >
                        <Eye size={16}/> Buka Lampiran Bukti
                      </a>
                    </div>
                  )}
                </div>
              </div>

              {/* FORM UPDATE */}
              <div className="status-update-section">
                <h4 className="section-title text-orange-600 mb-4 font-semibold">Update Keputusan Pleno</h4>
                
                <div className="form-row flex flex-col md:flex-row gap-4">
                  <div className="form-group flex-1">
                    <label className="block text-sm font-medium mb-1">Status Progress</label>
                    <select 
                      className="w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-200 outline-none"
                      value={formUpdate.status_progress}
                      onChange={(e) => setFormUpdate(p => ({...p, status_progress: e.target.value}))}
                    >
                      <option value="diterima_admin">Diterima Admin</option>
                      <option value="on_review">Sedang Direview Pleno</option>
                      <option value="selesai">Selesai</option>
                    </select>
                  </div>

                  <div className="form-group flex-1">
                    <label className="block text-sm font-medium mb-1">Keputusan Akhir</label>
                    <select 
                      className={`w-full p-2 border border-gray-300 rounded focus:ring-2 focus:ring-orange-200 outline-none ${
                        formUpdate.keputusan === 'diterima' ? 'bg-green-50 text-green-700 font-semibold border-green-300' : 
                        formUpdate.keputusan === 'ditolak' ? 'bg-red-50 text-red-700 font-semibold border-red-300' : ''
                      }`}
                      value={formUpdate.keputusan}
                      onChange={(e) => setFormUpdate(p => ({...p, keputusan: e.target.value}))}
                    >
                      <option value="belum_diputus">-- Belum Diputus --</option>
                      <option value="diterima">✅ Banding Diterima (Kompeten)</option>
                      <option value="ditolak">❌ Banding Ditolak (Tetap BK)</option>
                    </select>
                  </div>
                </div>

                <div className="form-group mt-4">
                  <label className="block text-sm font-medium mb-1">Catatan Komite / Hasil Pleno</label>
                  <textarea 
                    rows="4" 
                    className="w-full border border-gray-300 p-3 rounded-lg focus:ring-2 focus:ring-orange-200 outline-none resize-none"
                    placeholder="Masukkan catatan detail hasil rapat pleno komite di sini..."
                    value={formUpdate.catatan_komite}
                    onChange={(e) => setFormUpdate(p => ({...p, catatan_komite: e.target.value}))}
                  ></textarea>
                </div>
              </div>

              {/* FOOTER */}
              <div className="modal-footer-modern mt-6 pt-4 border-t border-gray-100 flex justify-end gap-3">
                <button type="button" className="btn-secondary px-4 py-2 rounded border hover:bg-gray-50" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-primary bg-orange-500 hover:bg-orange-600 text-white px-4 py-2 rounded flex items-center gap-2">
                  <Save size={18} /> Simpan Keputusan
                </button>
              </div>

            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Banding;