import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { ArrowLeft, Save, CheckSquare, Square, Building2 } from 'lucide-react';

const SkemaPersyaratanTuk = () => {
  const { id } = useParams(); // ID Skema
  const navigate = useNavigate();
  
  const [skema, setSkema] = useState(null);
  const [allPersyaratanTuk, setAllPersyaratanTuk] = useState([]);
  const [selectedIds, setSelectedIds] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchAll = async () => {
      setLoading(true);
      try {
        const skemaRes = await api.get(`/admin/skema/${id}`);
        setSkema(skemaRes.data.data);
        
        // Ambil ID yang sudah ada (pastikan backend mengirim field ini, misal: persyaratan_tuks)
        const currentIds = skemaRes.data.data.persyaratan_tuks 
          ? skemaRes.data.data.persyaratan_tuks.map(p => p.id_persyaratan_tuk)
          : [];
        setSelectedIds(currentIds);

        const masterRes = await api.get('/admin/persyaratan-tuk');
        setAllPersyaratanTuk(masterRes.data.data);

      } catch (error) {
        console.error("Error:", error);
        Swal.fire('Error', 'Gagal memuat data', 'error');
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, [id]);

  const toggleSelection = (itemId) => {
    setSelectedIds(prev => 
      prev.includes(itemId) ? prev.filter(i => i !== itemId) : [...prev, itemId]
    );
  };

  const handleSave = async () => {
    try {
      // Endpoint Asumsi: POST /admin/skema/:id/persyaratan-tuk
      await api.post(`/admin/skema/${id}/persyaratan-tuk`, {
        persyaratan_tuk_ids: selectedIds
      });

      Swal.fire('Berhasil', 'Persyaratan TUK diperbarui', 'success');
      navigate('/admin/skema');
    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Gagal menyimpan data', 'error');
    }
  };

  if (loading) return <div className="p-8 text-center">Memuat data...</div>;

  return (
    <div className="p-6 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        
        <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-white">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate('/admin/skema')} className="p-2 hover:bg-slate-100 rounded-full text-slate-500">
              <ArrowLeft size={20} />
            </button>
            <div>
              <h1 className="text-xl font-bold text-slate-800 flex items-center gap-2">
                <Building2 size={20} className="text-purple-600"/>
                Kelola Persyaratan TUK
              </h1>
              <p className="text-sm text-slate-500">Skema: {skema?.judul_skema}</p>
            </div>
          </div>
          <button 
            onClick={handleSave}
            className="flex items-center gap-2 px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium"
          >
            <Save size={18} /> Simpan
          </button>
        </div>

        <div className="p-6">
          <div className="mb-4 p-4 bg-purple-50 text-purple-700 rounded-lg text-sm border border-purple-100">
            Pilih persyaratan sarana & prasarana yang harus dimiliki TUK untuk menyelenggarakan skema ini.
          </div>

          <div className="grid gap-3">
            {allPersyaratanTuk.map((item) => {
              const isSelected = selectedIds.includes(item.id_persyaratan_tuk);
              return (
                <div 
                  key={item.id_persyaratan_tuk}
                  onClick={() => toggleSelection(item.id_persyaratan_tuk)}
                  className={`
                    flex items-center justify-between p-4 rounded-lg border cursor-pointer transition-all
                    ${isSelected 
                      ? 'bg-purple-50 border-purple-200 shadow-sm' 
                      : 'bg-white border-slate-200 hover:border-purple-300 hover:bg-slate-50'}
                  `}
                >
                  <div className="flex items-center gap-3">
                    <div className={`text-purple-600 ${isSelected ? 'opacity-100' : 'opacity-40'}`}>
                      {isSelected ? <CheckSquare size={24} /> : <Square size={24} />}
                    </div>
                    <span className={`font-medium ${isSelected ? 'text-purple-900' : 'text-slate-600'}`}>
                      {item.nama_persyaratan}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
};

export default SkemaPersyaratanTuk;