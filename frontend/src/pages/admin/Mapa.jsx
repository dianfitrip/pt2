import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Edit2, Trash2, X, Save, FileText, 
  Loader2, Settings 
} from 'lucide-react';

const Mapa = () => {
  const navigate = useNavigate();

  // --- STATE UTAMA ---
  const [data, setData] = useState([]);
  const [skemaList, setSkemaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State Modal Master MAPA
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // --- FORM STATE MASTER MAPA ---
  const initialFormState = {
    id_skema: '',
    versi: '',
    jenis: 'MAPA-01',
    status: 'draft'
  };
  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA MASTER ---
  const fetchData = async () => {
    setLoading(true);
    try {
      // Fetch Skema untuk Dropdown
      const skemaRes = await api.get('/admin/skema');
      const skemaData = skemaRes.data?.data || skemaRes.data || [];
      setSkemaList(skemaData);

      // Fetch MAPA
      const response = await api.get('/admin/mapa');
      const resBody = response.data !== undefined ? response.data : response;
      let listData = [];
      if (Array.isArray(resBody.data)) listData = resBody.data;
      else if (resBody.data?.data && Array.isArray(resBody.data.data)) listData = resBody.data.data;
      else if (Array.isArray(resBody)) listData = resBody;

      setData(listData);
    } catch (error) {
      console.error("Fetch Error:", error);
      Swal.fire('Gagal', 'Gagal memuat data MAPA. Pastikan Anda login dengan Role yang sesuai (Admin/Asesor).', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- HANDLERS MASTER MAPA ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_mapa);
    setFormData({
      id_skema: item.id_skema || '',
      versi: item.versi || '',
      jenis: item.jenis || 'MAPA-01',
      status: item.status || 'draft'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Dokumen MAPA?',
      text: "Semua data turunan (MAPA-01/02) terkait akan ikut terhapus!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/mapa/${id}`);
        Swal.fire('Terhapus!', 'Data MAPA telah dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal!', 'Gagal menghapus data', 'error');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/admin/mapa/${currentId}`, formData);
        Swal.fire('Berhasil', 'Dokumen MAPA diperbarui', 'success');
      } else {
        await api.post('/admin/mapa', formData);
        Swal.fire('Berhasil', 'Dokumen MAPA baru dibuat', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan server', 'error');
    }
  };

  // --- FILTER ---
  const filteredData = data.filter(item => 
    (item.versi && item.versi.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.skema?.judul_skema && item.skema.judul_skema.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="p-6 max-w-7xl mx-auto">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Perencanaan Asesmen (MAPA)</h1>
          <p className="text-slate-500 text-sm mt-1">Kelola dokumen MAPA-01 dan MAPA-02</p>
        </div>
        <button 
          onClick={() => {
            setFormData(initialFormState);
            setIsEditMode(false);
            setShowModal(true);
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm"
        >
          <Plus size={18} /> Buat Dokumen MAPA
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari berdasarkan versi atau judul skema..." 
          className="bg-transparent border-none focus:outline-none w-full text-slate-700"
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
                <th className="px-6 py-4">Skema Terkait</th>
                <th className="px-6 py-4 text-center">Versi</th>
                <th className="px-6 py-4 text-center">Jenis MAPA</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center w-48">Aksi / Pengisian</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="6" className="text-center py-8"><Loader2 className="animate-spin mx-auto text-blue-500"/></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="6" className="text-center py-8 text-slate-500">Belum ada dokumen MAPA</td></tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id_mapa} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.skema?.judul_skema || `ID Skema: ${item.id_skema}`}</div>
                      <div className="text-xs text-slate-500 mt-1">Kode: {item.skema?.kode_skema || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold text-slate-700">{item.versi}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${item.jenis === 'MAPA-01' ? 'bg-indigo-100 text-indigo-700' : 'bg-purple-100 text-purple-700'}`}>
                        {item.jenis}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border capitalize ${item.status === 'final' ? 'bg-green-50 text-green-600 border-green-200' : 'bg-amber-50 text-amber-600 border-amber-200'}`}>
                        {item.status}
                      </span>
                    </td>
                    
                    <td className="px-6 py-4">
                      <div className="flex flex-col items-center gap-2">
                        {/* INILAH BAGIAN YANG DIPERBAIKI. SEKARANG MEMAKAI navigate() */}
                        {item.jenis === 'MAPA-01' ? (
                            <button onClick={() => navigate(`/admin/asesi/mapa/${item.id_mapa}/m01`)} className="w-full justify-center px-3 py-1.5 bg-blue-50 text-blue-700 rounded border border-blue-200 hover:bg-blue-100 text-xs font-bold transition flex items-center gap-1">
                              <FileText size={14}/> Isi Rencana (M01)
                            </button>
                        ) : (
                            <button onClick={() => navigate(`/admin/asesi/mapa/${item.id_mapa}/m02`)} className="w-full justify-center px-3 py-1.5 bg-purple-50 text-purple-700 rounded border border-purple-200 hover:bg-purple-100 text-xs font-bold transition flex items-center gap-1">
                              <Settings size={14}/> Isi Mapping (M02)
                            </button>
                        )}
                        
                        {/* Tombol Edit/Delete Basic */}
                        <div className="flex gap-3 mt-1">
                          <button onClick={() => handleEdit(item)} className="text-slate-400 hover:text-blue-600" title="Edit Master"><Edit2 size={16} /></button>
                          <button onClick={() => handleDelete(item.id_mapa)} className="text-slate-400 hover:text-red-600" title="Hapus"><Trash2 size={16} /></button>
                        </div>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODAL 1: MASTER MAPA (CREATE/EDIT)
      ========================================= */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold text-slate-800">{isEditMode ? 'Edit Master MAPA' : 'Buat Master MAPA Baru'}</h3>
              <button onClick={() => setShowModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Pilih Skema Sertifikasi <span className="text-red-500">*</span></label>
                <select name="id_skema" value={formData.id_skema} onChange={handleInputChange} required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none">
                  <option value="">-- Pilih Skema --</option>
                  {skemaList.map(skema => (
                    <option key={skema.id_skema} value={skema.id_skema}>{skema.kode_skema} - {skema.judul_skema}</option>
                  ))}
                </select>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-slate-600">Versi / Tahun <span className="text-red-500">*</span></label>
                  <input type="text" name="versi" value={formData.versi} onChange={handleInputChange} placeholder="Contoh: 2024.1" required className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none"/>
                </div>
                <div className="flex flex-col gap-1">
                  <label className="text-sm font-semibold text-slate-600">Jenis Dokumen</label>
                  <select name="jenis" value={formData.jenis} onChange={handleInputChange} disabled={isEditMode} className="border p-2.5 rounded-lg bg-slate-50 outline-none">
                    <option value="MAPA-01">MAPA-01 (Rencana)</option>
                    <option value="MAPA-02">MAPA-02 (Mapping)</option>
                  </select>
                </div>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Status Penyusunan</label>
                <select name="status" value={formData.status} onChange={handleInputChange} className="border p-2.5 rounded-lg focus:ring-2 focus:ring-blue-200 outline-none">
                  <option value="draft">Draft (Sedang Disusun)</option>
                  <option value="final">Final (Selesai)</option>
                </select>
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium flex items-center gap-2"><Save size={18}/> Simpan Master</button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};

export default Mapa;