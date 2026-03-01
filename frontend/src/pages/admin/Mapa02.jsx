import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { ArrowLeft, Settings, Plus, Trash2, X, Save, Loader2, CheckSquare, Square } from 'lucide-react';

const METODE_OPTIONS = [
  { id: "IA01", name: "IA01 - Observasi Langsung" },
  { id: "IA02", name: "IA02 - Tugas Praktik Demonstrasi" },
  { id: "IA03", name: "IA03 - Pertanyaan Lisan" },
  { id: "IA04A", name: "IA04A - Pertanyaan Tertulis (PG)" },
  { id: "IA04B", name: "IA04B - Pertanyaan Tertulis (Esai)" },
  { id: "IA05", name: "IA05 - Pertanyaan Wawancara" },
  { id: "IA06", name: "IA06 - Wawancara Berbasis Portofolio" },
  { id: "IA07", name: "IA07 - Wawancara Berbasis Jurnal" },
  { id: "IA09", name: "IA09 - Cek Portofolio" }
];

const Mapa02 = () => {
  const { id } = useParams(); // id_mapa
  const navigate = useNavigate();

  // --- STATE UTAMA ---
  const [loading, setLoading] = useState(true);
  const [masterData, setMasterData] = useState(null);
  const [mappings, setMappings] = useState([]);
  
  // State Data Master untuk Dropdown
  const [unitList, setUnitList] = useState([]);
  const [kelompokList, setKelompokList] = useState([]);

  // State Modal Mapping
  const [showMappingModal, setShowMappingModal] = useState(false);
  const [mappingForm, setMappingForm] = useState({ id_unit: '', id_kelompok: '' });
  const [savingMapping, setSavingMapping] = useState(false);

  // State Modal Metode
  const [showMetodeModal, setShowMetodeModal] = useState(false);
  const [selectedMapping, setSelectedMapping] = useState(null);
  const [activeMetodes, setActiveMetodes] = useState([]); // List metode yang sudah dipilih
  const [loadingMetode, setLoadingMetode] = useState(false);

  // --- FETCH DATA AWAL ---
  const fetchAllData = async () => {
    setLoading(true);
    try {
      // 1. Ambil Data Master MAPA
      const resMapa = await api.get(`/admin/mapa/${id}`);
      const mapaData = resMapa.data?.data || resMapa.data;
      setMasterData(mapaData);

      // 2. Ambil List Mapping MAPA-02
      fetchMappings();

      // 3. Ambil Semua Unit Kompetensi
      const resUnit = await api.get('/admin/unit-kompetensi');
      setUnitList(resUnit.data?.data || resUnit.data || []);

      // 4. Ambil Kelompok Pekerjaan berdasarkan id_skema dari MAPA
      if (mapaData && mapaData.id_skema) {
        const resKelompok = await api.get(`/admin/kelompok-pekerjaan/skema/${mapaData.id_skema}`);
        setKelompokList(resKelompok.data?.data || resKelompok.data || []);
      }

    } catch (error) {
      console.error(error);
      Swal.fire('Gagal', 'Terjadi kesalahan saat memuat data', 'error');
    } finally {
      setLoading(false);
    }
  };

  const fetchMappings = async () => {
    try {
      const resMap = await api.get(`/admin/mapa02/mapping/${id}`);
      setMappings(resMap.data?.data || resMap.data || []);
    } catch (error) {
      console.error("Gagal mengambil mapping:", error);
    }
  };

  useEffect(() => {
    fetchAllData();
  }, [id]);

  // --- HANDLERS MAPPING ---
  const handleMappingChange = (e) => {
    setMappingForm({ ...mappingForm, [e.target.name]: e.target.value });
  };

  const submitMapping = async (e) => {
    e.preventDefault();
    if (!mappingForm.id_unit || !mappingForm.id_kelompok) {
      return Swal.fire('Peringatan', 'Harap lengkapi semua field', 'warning');
    }

    setSavingMapping(true);
    try {
      await api.post('/admin/mapa02/mapping', {
        id_mapa: id,
        id_unit: mappingForm.id_unit,
        id_kelompok: mappingForm.id_kelompok
      });
      Swal.fire('Berhasil', 'Mapping Unit ditambahkan', 'success');
      setShowMappingModal(false);
      setMappingForm({ id_unit: '', id_kelompok: '' });
      fetchMappings();
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    } finally {
      setSavingMapping(false);
    }
  };

  const deleteMapping = async (id_mapping) => {
    const result = await Swal.fire({
      title: 'Hapus Mapping?',
      text: "Semua metode yang ada di mapping ini akan terhapus",
      icon: 'warning', showCancelButton: true, confirmButtonColor: '#EF4444'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/mapa02/mapping/${id_mapping}`);
        Swal.fire('Terhapus', 'Mapping berhasil dihapus', 'success');
        fetchMappings();
      } catch (error) {
        Swal.fire('Gagal', 'Tidak bisa menghapus mapping', 'error');
      }
    }
  };

  // --- HANDLERS METODE ---
  const openMetodeModal = async (mappingItem) => {
    setSelectedMapping(mappingItem);
    setShowMetodeModal(true);
    setLoadingMetode(true);
    try {
      const res = await api.get(`/admin/mapa02/metode/${mappingItem.id_mapping}`);
      setActiveMetodes(res.data?.data || res.data || []);
    } catch (error) {
      setActiveMetodes([]);
    } finally {
      setLoadingMetode(false);
    }
  };

  const toggleMetode = async (metodeCode) => {
    // Cek apakah metode sudah ada di list aktif
    const existing = activeMetodes.find(m => m.metode === metodeCode);

    try {
      if (existing) {
        // Jika sudah ada, hapus dari database
        await api.delete(`/admin/mapa02/metode/${existing.id_metode}`);
      } else {
        // Jika belum ada, tambahkan ke database
        await api.post('/admin/mapa02/metode', {
          id_mapping: selectedMapping.id_mapping,
          metode: metodeCode,
          digunakan: true
        });
      }
      
      // Refresh list metode
      const res = await api.get(`/admin/mapa02/metode/${selectedMapping.id_mapping}`);
      setActiveMetodes(res.data?.data || res.data || []);
    } catch (error) {
      Swal.fire('Gagal', 'Terjadi kesalahan sistem', 'error');
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-purple-600" size={50} /></div>;

  return (
    <div className="p-6 max-w-7xl mx-auto flex flex-col h-full">
      {/* Header Halaman */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate('/admin/asesi/mapa')} className="p-2 bg-white border rounded-lg hover:bg-slate-50 transition">
            <ArrowLeft size={20} className="text-slate-600" />
          </button>
          <div>
            <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
              <Settings className="text-purple-600"/> Mapping Matriks MAPA-02
            </h1>
            <p className="text-slate-500 text-sm mt-1">
              Skema: <span className="font-semibold text-slate-700">{masterData?.skema?.judul_skema || '-'}</span> (Versi: {masterData?.versi || '-'})
            </p>
          </div>
        </div>
        <button onClick={() => setShowMappingModal(true)} className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition flex items-center gap-2 text-sm font-semibold shadow-sm">
          <Plus size={18} /> Tambah Mapping Unit
        </button>
      </div>

      {/* Tabel Mappings */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-bold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 w-12 text-center">No</th>
                <th className="px-6 py-4">Unit Kompetensi</th>
                <th className="px-6 py-4">Kelompok Pekerjaan</th>
                <th className="px-6 py-4 text-center">Metode Uji</th>
                <th className="px-6 py-4 text-center w-32">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {mappings.length === 0 ? (
                <tr><td colSpan="5" className="text-center py-8 text-slate-500">Belum ada mapping unit untuk MAPA ini. Silakan tambah mapping.</td></tr>
              ) : (
                mappings.map((item, index) => (
                  <tr key={item.id_mapping} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.unit_kompetensi?.judul_unit || '-'}</div>
                      <div className="text-xs text-slate-500 mt-1">Kode: {item.unit_kompetensi?.kode_unit || '-'}</div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-slate-100 text-slate-700 rounded text-xs font-semibold">
                        {item.kelompok_pekerjaan?.nama_kelompok || `ID: ${item.id_kelompok}`}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => openMetodeModal(item)} className="px-3 py-1.5 bg-indigo-50 text-indigo-700 rounded border border-indigo-200 hover:bg-indigo-100 text-xs font-bold transition flex items-center gap-1 mx-auto">
                        <CheckSquare size={14}/> Kelola Metode
                      </button>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button onClick={() => deleteMapping(item.id_mapping)} className="text-red-500 hover:text-red-700 p-2" title="Hapus Mapping">
                        <Trash2 size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* =========================================
          MODAL 1: TAMBAH MAPPING UNIT
      ========================================= */}
      {showMappingModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-lg shadow-2xl overflow-hidden flex flex-col">
            <div className="flex justify-between items-center p-5 border-b">
              <h3 className="text-lg font-bold text-slate-800 flex items-center gap-2"><Plus className="text-purple-600"/> Tambah Mapping</h3>
              <button onClick={() => setShowMappingModal(false)} className="text-slate-400 hover:text-slate-600"><X size={24} /></button>
            </div>
            
            <form onSubmit={submitMapping} className="p-6 space-y-4">
              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Unit Kompetensi <span className="text-red-500">*</span></label>
                <select name="id_unit" value={mappingForm.id_unit} onChange={handleMappingChange} required className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none">
                  <option value="">-- Pilih Unit Kompetensi --</option>
                  {unitList.map(unit => (
                    <option key={unit.id_unit} value={unit.id_unit}>{unit.kode_unit} - {unit.judul_unit}</option>
                  ))}
                </select>
              </div>

              <div className="flex flex-col gap-1">
                <label className="text-sm font-semibold text-slate-600">Kelompok Pekerjaan <span className="text-red-500">*</span></label>
                <select name="id_kelompok" value={mappingForm.id_kelompok} onChange={handleMappingChange} required className="border border-slate-300 p-2.5 rounded-lg focus:ring-2 focus:ring-purple-200 outline-none">
                  <option value="">-- Pilih Kelompok Pekerjaan --</option>
                  {kelompokList.map(kel => (
                    <option key={kel.id_kelompok} value={kel.id_kelompok}>{kel.nama_kelompok}</option>
                  ))}
                </select>
                {kelompokList.length === 0 && <span className="text-xs text-amber-600 mt-1">Kelompok pekerjaan belum dibuat untuk skema ini.</span>}
              </div>

              <div className="pt-4 flex justify-end gap-3 border-t mt-6">
                <button type="button" onClick={() => setShowMappingModal(false)} className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 font-medium">Batal</button>
                <button type="submit" disabled={savingMapping} className="px-4 py-2 bg-purple-600 text-white rounded-lg hover:bg-purple-700 font-medium flex items-center gap-2 disabled:opacity-50">
                  {savingMapping ? <Loader2 size={18} className="animate-spin"/> : <Save size={18}/>} Simpan
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* =========================================
          MODAL 2: KELOLA METODE UJI
      ========================================= */}
      {showMetodeModal && selectedMapping && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm">
          <div className="bg-white rounded-xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="flex justify-between items-center p-5 border-b bg-indigo-50">
              <div>
                <h3 className="text-lg font-bold text-indigo-900 flex items-center gap-2">Pilih Metode Uji</h3>
                <p className="text-xs text-indigo-600 font-medium mt-1">Unit: {selectedMapping.unit_kompetensi?.judul_unit}</p>
              </div>
              <button onClick={() => setShowMetodeModal(false)} className="text-indigo-400 hover:text-indigo-800"><X size={24} /></button>
            </div>
            
            <div className="flex-1 overflow-y-auto p-6 bg-slate-50">
              {loadingMetode ? (
                <div className="flex justify-center items-center h-40"><Loader2 className="animate-spin text-indigo-500" size={40}/></div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  {METODE_OPTIONS.map(opt => {
                    // Cek apakah metode ini aktif (sudah ada di database)
                    const isActive = activeMetodes.find(m => m.metode === opt.id);
                    
                    return (
                      <div 
                        key={opt.id} 
                        onClick={() => toggleMetode(opt.id)}
                        className={`p-4 rounded-xl border-2 cursor-pointer flex items-center gap-3 transition-all select-none
                          ${isActive ? 'border-indigo-500 bg-indigo-50/50 shadow-sm' : 'border-slate-200 bg-white hover:border-indigo-300'}`}
                      >
                        <div className={`${isActive ? 'text-indigo-600' : 'text-slate-300'}`}>
                          {isActive ? <CheckSquare size={24} /> : <Square size={24} />}
                        </div>
                        <span className={`font-semibold text-sm ${isActive ? 'text-indigo-900' : 'text-slate-600'}`}>
                          {opt.name}
                        </span>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            <div className="p-5 border-t bg-white flex justify-end">
              <button type="button" onClick={() => setShowMetodeModal(false)} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold transition">
                Selesai
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Mapa02;