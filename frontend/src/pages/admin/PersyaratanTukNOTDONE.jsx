import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Edit2, Trash2, X, Save, Loader2, Building2
} from 'lucide-react';
import './adminstyles/Persyaratan.css'; // Pakai CSS yang sama

const PersyaratanTuk = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  const initialForm = {
    nama_perlengkapan: '',
    spesifikasi: ''
  };
  const [formData, setFormData] = useState(initialForm);

  // Fetch
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/persyaratan-tuk');
      setData(response.data.data || []);
    } catch (error) {
      Swal.fire('Error', 'Gagal memuat data persyaratan TUK', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // Handlers
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditMode) {
        await api.put(`/admin/persyaratan-tuk/${currentId}`, formData);
        Swal.fire('Sukses', 'Data diperbarui', 'success');
      } else {
        await api.post('/admin/persyaratan-tuk', formData);
        Swal.fire('Sukses', 'Data ditambahkan', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Error', 'error');
    }
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_persyaratan_tuk);
    setFormData({
      nama_perlengkapan: item.nama_perlengkapan,
      spesifikasi: item.spesifikasi || ''
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Data?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/persyaratan-tuk/${id}`);
        Swal.fire('Terhapus!', 'Data dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus data', 'error');
      }
    }
  };

  const filteredData = data.filter(item => 
    item.nama_perlengkapan.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="persyaratan-container">
      <div className="header-section">
        <div>
          <h1 className="page-title">Persyaratan Teknis TUK</h1>
          <p className="page-subtitle">Daftar sarana & prasarana Tempat Uji Kompetensi</p>
        </div>
        <button 
          className="btn-create bg-purple-600 text-white hover:bg-purple-700"
          onClick={() => {
            setFormData(initialForm);
            setIsEditMode(false);
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Tambah Perlengkapan
        </button>
      </div>

      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari nama perlengkapan..." 
          className="bg-transparent w-full outline-none text-slate-700"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <table className="w-full text-sm text-left">
          <thead className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
            <tr>
              <th className="px-6 py-4 w-16 text-center">No</th>
              <th className="px-6 py-4">Nama Perlengkapan / Sarana</th>
              <th className="px-6 py-4">Spesifikasi</th>
              <th className="px-6 py-4 text-center w-32">Aksi</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {loading ? (
              <tr><td colSpan="4" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></td></tr>
            ) : filteredData.length === 0 ? (
              <tr><td colSpan="4" className="text-center py-8 text-slate-500">Data kosong</td></tr>
            ) : (
              filteredData.map((item, index) => (
                <tr key={item.id_persyaratan_tuk} className="hover:bg-slate-50">
                  <td className="px-6 py-4 text-center">{index + 1}</td>
                  <td className="px-6 py-4 font-medium text-slate-800 flex items-center gap-2">
                    <Building2 size={16} className="text-purple-500"/>
                    {item.nama_perlengkapan}
                  </td>
                  <td className="px-6 py-4 text-slate-500">{item.spesifikasi || '-'}</td>
                  <td className="px-6 py-4 text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-600 p-1">
                        <Edit2 size={18} />
                      </button>
                      <button onClick={() => handleDelete(item.id_persyaratan_tuk)} className="text-red-500 hover:text-red-600 p-1">
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

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl animate-slide-up overflow-hidden">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center">
              <h3 className="text-lg font-bold text-slate-800">
                {isEditMode ? 'Edit Perlengkapan' : 'Tambah Perlengkapan TUK'}
              </h3>
              <button onClick={() => setShowModal(false)}><X size={20} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6">
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Nama Perlengkapan</label>
                  <input 
                    type="text" 
                    name="nama_perlengkapan" 
                    value={formData.nama_perlengkapan} 
                    onChange={handleInputChange} 
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-100 outline-none"
                    required 
                  />
                </div>

                <div>
                  <label className="block text-sm font-semibold text-slate-700 mb-1">Spesifikasi</label>
                  <textarea 
                    name="spesifikasi" 
                    rows="3" 
                    value={formData.spesifikasi} 
                    onChange={handleInputChange}
                    className="w-full p-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-purple-100 outline-none"
                    placeholder="Contoh: Prosesor i5, RAM 8GB, SSD 256GB"
                  ></textarea>
                </div>
              </div>

              <div className="mt-6 flex justify-end gap-3">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 text-slate-600 hover:bg-slate-100 rounded-lg">Batal</button>
                <button type="submit" className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 flex items-center gap-2">
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

export default PersyaratanTuk;