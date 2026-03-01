import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { ArrowLeft, Save, Trash2, Plus, CheckSquare, Square } from 'lucide-react';

const SkemaPersyaratan = () => {
  const { id } = useParams(); // ID Skema
  const navigate = useNavigate();
  
  const [skema, setSkema] = useState(null);
  const [allPersyaratan, setAllPersyaratan] = useState([]);
  const [selectedPersyaratan, setSelectedPersyaratan] = useState([]); // List ID yang dipilih
  const [loading, setLoading] = useState(true);

  // Fetch Data
  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        // 1. Ambil Detail Skema (termasuk persyaratan yang sudah ada)
        const skemaRes = await api.get(`/admin/skema/${id}`);
        setSkema(skemaRes.data.data);
        
        // Ambil ID persyaratan yang sudah tertaut
        const currentIds = skemaRes.data.data.persyaratans.map(p => p.id_persyaratan);
        setSelectedPersyaratan(currentIds);

        // 2. Ambil Semua Master Persyaratan
        const masterRes = await api.get('/admin/persyaratan');
        setAllPersyaratan(masterRes.data.data);

      } catch (error) {
        console.error("Error:", error);
        Swal.fire('Error', 'Gagal memuat data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  // Handle Toggle Checkbox
  const toggleSelection = (id_persyaratan) => {
    setSelectedPersyaratan(prev => {
      if (prev.includes(id_persyaratan)) {
        return prev.filter(item => item !== id_persyaratan); // Hapus
      } else {
        return [...prev, id_persyaratan]; // Tambah
      }
    });
  };

  // Simpan Perubahan
  const handleSave = async () => {
    try {
      // Backend mungkin butuh endpoint khusus untuk bulk update atau satu-satu
      // Karena keterbatasan info endpoint "bulk update", kita asumsikan 
      // logika: update relasi di backend.
      // Jika backend belum support bulk, Anda mungkin perlu loop create/delete.
      
      // Untuk saat ini, kita gunakan endpoint asumsi: POST /admin/skema/:id/persyaratan
      // Body: { id_persyaratan: [...] }
      
      await api.post(`/admin/skema/${id}/persyaratan`, {
        persyaratan_ids: selectedPersyaratan
      });

      Swal.fire('Berhasil', 'Persyaratan skema diperbarui', 'success');
      navigate('/admin/skema');
    } catch (error) {
      // Fallback jika endpoint di atas tidak ada, gunakan logika manual per item (optional)
      console.error(error);
      Swal.fire('Gagal', 'Pastikan backend mendukung update persyaratan skema', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/skema')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800">Kelola Persyaratan Dasar</h1>
              <p className="text-sm text-slate-500">Skema: {skema?.judul_skema}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
          >
            <Save size={18} /> Simpan Perubahan
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          <div className="mb-4 p-4 bg-blue-50 text-blue-700 rounded-lg text-sm border border-blue-100">
            Centang persyaratan yang <strong>WAJIB</strong> dipenuhi oleh asesi untuk mendaftar pada skema ini.
          </div>

          <div className="grid gap-3">
            {allPersyaratan.map((item) => {
              const isSelected = selectedPersyaratan.includes(item.id_persyaratan);
              return (
                <div 
                  key={item.id_persyaratan}
                  onClick={() => toggleSelection(item.id_persyaratan)}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-blue-50 border-blue-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-blue-300 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-blue-600 ${isSelected ? 'opacity-100' : 'opacity-40'}`}>
                      {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-blue-900' : 'text-slate-600'}`}>
                      {item.nama_persyaratan}
                    </span>
                  </div>
                  {isSelected && <span className="text-xs font-bold text-blue-600 bg-white px-2 py-1 rounded border border-blue-100">Dipilih</span>}
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkemaPersyaratan;