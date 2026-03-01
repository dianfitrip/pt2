import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Edit2, Trash2, X, Save, Loader2, FileCheck 
} from 'lucide-react';
import './adminstyles/Persyaratan.css';

const Persyaratan = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Form State
  const initialForm = {
    nama_persyaratan: '',
    jenis_persyaratan: 'dasar', // Default ENUM
    keterangan: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/persyaratan');
      setData(response.data.data || []);
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Gagal memuat data persyaratan', 'error');
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

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        // Pastikan route PUT ada di backend
        await api.put(`/admin/persyaratan/${currentId}`, formData);
        Swal.fire('Sukses', 'Persyaratan berhasil diperbarui', 'success');
      } else {
        await api.post('/admin/persyaratan', formData);
        Swal.fire('Sukses', 'Persyaratan berhasil ditambahkan', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_persyaratan);
    setFormData({
      nama_persyaratan: item.nama_persyaratan,
      jenis_persyaratan: item.jenis_persyaratan,
      keterangan: item.keterangan || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Data?',
      text: "Data tidak bisa dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      cancelButtonColor: '#3085d6',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/persyaratan/${id}`);
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus data', 'error');
      }
    }
  };

  // Filter Search
  const filteredData = data.filter(item => 
    item.nama_persyaratan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="persyaratan-container">
      {/* Header */}
      <div className="header-section">
        <div>
          <h1 className="page-title">Persyaratan Dasar & Administratif</h1>
          <p className="page-subtitle">Kelola persyaratan dasar & administratif skema</p>
        </div>
        <button 
          className="btn-create bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setFormData(initialForm);
            setIsEditMode(false);
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Tambah Data
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama persyaratan..." 
          className="bg-transparent w-full outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-16 text-center">No</th>
              <th className="px-6 py-4">Nama Persyaratan</th>
              <th className="px-6 py-4">Jenis</th>
              <th className="px-6 py-4">Keterangan</th>
              <th className="px-6 py-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="5" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="5" className="text-center py-8 text-slate-500">Data kosong</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id_persyaratan} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800">{item.nama_persyaratan}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2 py-1 rounded text-xs font-bold capitalize border
                      ${item.jenis_persyaratan === 'dasar' 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-purple-50 text-purple-700 border-purple-200'
                      }`}>
                      {item.jenis_persyaratan}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.keterangan || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-600 p-1">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id_persyaratan)} className="text-red-500 hover:text-red-600 p-1">
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

      {/* Modal Form */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Edit Persyaratan' : 'Tambah Persyaratan'}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Persyaratan</label>
                  <input 
                    type="text" 
                    name="nama_persyaratan" 
                    value={formData.nama_persyaratan} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Jenis Persyaratan</label>
                  <select 
                    name="jenis_persyaratan" 
                    value={formData.jenis_persyaratan} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                  >
                    <option value="dasar">Dasar</option>
                    <option value="administratif">Administratif</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Keterangan (Opsional)</label>
                  <textarea 
                    name="keterangan" 
                    rows="3" 
                    value={formData.keterangan} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-100 outline-none"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 flex items-center gap-2">
                  <Save size={18}/> Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Persyaratan;