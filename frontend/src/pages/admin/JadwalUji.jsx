import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Edit2, Trash2, X, Save, 
  Calendar, Loader2, Clock, MapPin, Layers, Link as LinkIcon
} from 'lucide-react';
import './adminstyles/JadwalUji.css'; 

const JadwalUji = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // Data Pendukung Dropdown
  const [listSkema, setListSkema] = useState([]);
  const [listTuk, setListTuk] = useState([]);

  // State Form
  const initialFormState = {
    kode_jadwal: '',
    id_skema: '',
    id_tuk: '',
    nama_kegiatan: '',
    tahun: new Date().getFullYear(),
    periode_bulan: '',
    gelombang: '',
    tgl_pra_asesmen: '',
    tgl_awal: '',
    tgl_akhir: '',
    jam: '',
    kuota: 0,
    pelaksanaan_uji: 'luring', 
    url_agenda: '',
    status: 'draft'
  };
  const [formData, setFormData] = useState(initialFormState);

  // Daftar Bulan Statis
  const listBulan = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni",
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/jadwal');
      setData(response.data.data || []);

      const skemaRes = await api.get('/admin/skema');
      setListSkema(skemaRes.data.data || []);

      const tukRes = await api.get('/admin/tuk');
      setListTuk(tukRes.data.data || []);

    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire('Error', 'Gagal memuat data', 'error');
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

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_jadwal);
    setFormData({
      kode_jadwal: item.kode_jadwal || '',
      id_skema: item.id_skema || '',
      id_tuk: item.id_tuk || '',
      nama_kegiatan: item.nama_kegiatan || '',
      tahun: item.tahun || new Date().getFullYear(),
      periode_bulan: item.periode_bulan || '',
      gelombang: item.gelombang || '',
      tgl_pra_asesmen: item.tgl_pra_asesmen || '',
      tgl_awal: item.tgl_awal || '',
      tgl_akhir: item.tgl_akhir || '',
      jam: item.jam || '',
      kuota: item.kuota || 0,
      pelaksanaan_uji: item.pelaksanaan_uji || 'luring',
      url_agenda: item.url_agenda || '',
      status: item.status || 'draft'
    });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Jadwal?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/jadwal/${id}`);
        Swal.fire('Terhapus!', 'Data dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal hapus data', 'error');
      }
    }
  };

  // --- FUNGSI BERSIH-BERSIH DATA (Fix Error 400) ---
  const sanitizeData = (data) => {
    const clean = { ...data };
    
    // Pastikan field Relasi berupa Integer
    clean.id_skema = clean.id_skema ? parseInt(clean.id_skema) : null;
    clean.id_tuk = clean.id_tuk ? parseInt(clean.id_tuk) : null;
    clean.tahun = clean.tahun ? parseInt(clean.tahun) : null;
    clean.kuota = clean.kuota ? parseInt(clean.kuota) : 0;

    // Ubah string kosong "" menjadi null agar DB tidak error
    ['tgl_pra_asesmen', 'tgl_awal', 'tgl_akhir', 'jam', 'kode_jadwal', 'url_agenda', 'periode_bulan', 'gelombang'].forEach(field => {
      if (!clean[field] || clean[field] === "") {
        clean[field] = null;
      }
    });

    return clean;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi di Frontend
    if (!formData.id_skema || !formData.id_tuk || !formData.nama_kegiatan) {
      Swal.fire('Gagal', 'Nama Kegiatan, Skema, dan TUK wajib diisi!', 'warning');
      return;
    }

    const dataToSend = sanitizeData(formData);

    // DEBUG: Cek di Console Browser (F12) jika masih error
    console.log("DATA DIKIRIM:", dataToSend); 

    try {
      if (isEditMode) {
        await api.put(`/admin/jadwal/${currentId}`, dataToSend);
        Swal.fire('Sukses', 'Jadwal diperbarui', 'success');
      } else {
        await api.post('/admin/jadwal', dataToSend);
        Swal.fire('Sukses', 'Jadwal dibuat', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      console.error("Submit Error:", error);
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan (Cek Console)', 'error');
    }
  };

  // Filter
  const filteredData = data.filter(item => 
    (item.nama_kegiatan && item.nama_kegiatan.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.kode_jadwal && item.kode_jadwal.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  return (
    <div className="jadwal-container">
      <div className="header-section">
        <div>
          <h1 className="page-title">Jadwal Uji Kompetensi</h1>
          <p className="page-subtitle">Kelola jadwal asesmen dan tempat uji kompetensi</p>
        </div>
        <button 
          className="btn-create bg-blue-600 text-white hover:bg-blue-700"
          onClick={() => {
            setFormData(initialFormState);
            setIsEditMode(false);
            setShowModal(true);
          }}
        >
          <Plus size={18} /> Buat Jadwal
        </button>
      </div>

      {/* Search */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-3">
        <Search className="text-slate-400" size={20} />
        <input 
          type="text" 
          placeholder="Cari kode atau nama kegiatan..." 
          className="bg-transparent w-full outline-none text-slate-700"
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
                <th className="px-6 py-4">Kegiatan</th>
                <th className="px-6 py-4">Skema & TUK</th>
                <th className="px-6 py-4">Waktu</th>
                <th className="px-6 py-4 text-center">Kuota</th>
                <th className="px-6 py-4 text-center">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="7" className="text-center py-8"><Loader2 className="animate-spin mx-auto"/></td></tr>
              ) : filteredData.length === 0 ? (
                <tr><td colSpan="7" className="text-center py-8 text-slate-500">Data kosong</td></tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id_jadwal} className="hover:bg-slate-50">
                    <td className="px-6 py-4 text-center">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="text-xs font-mono font-bold text-blue-600 mb-1">{item.kode_jadwal || '-'}</div>
                      <div className="font-medium text-slate-800">{item.nama_kegiatan}</div>
                      <div className="text-xs text-slate-500 mt-1">Gel: {item.gelombang || '-'} ({item.tahun})</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <div className="text-xs flex items-center gap-1 text-slate-700">
                          <Layers size={12} className="text-blue-500"/> 
                          <span className="truncate max-w-[200px]" title={item.skema?.judul_skema}>
                            {item.skema?.judul_skema || 'Skema dihapus'}
                          </span>
                        </div>
                        <div className="text-xs flex items-center gap-1 text-slate-500">
                          <MapPin size={12} className="text-red-500"/>
                          <span className="truncate max-w-[200px]" title={item.tuk?.nama_tuk}>
                            {item.tuk?.nama_tuk || 'TUK dihapus'}
                          </span>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-xs text-slate-600 flex items-center gap-1 mb-1">
                        <Calendar size={12}/> {item.tgl_awal || '?'} s.d {item.tgl_akhir || '?'}
                      </div>
                      <div className="flex gap-2 items-center">
                        <span className="text-xs font-medium bg-gray-100 px-2 py-0.5 rounded border uppercase">{item.pelaksanaan_uji}</span>
                        <span className="text-xs text-slate-500"><Clock size={10} className="inline"/> {item.jam || '-'}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-center font-semibold">{item.kuota}</td>
                    <td className="px-6 py-4 text-center">
                      <span className={`px-2 py-1 rounded text-xs font-bold border capitalize
                        ${item.status === 'open' ? 'bg-green-50 text-green-600 border-green-200' : 
                          item.status === 'ongoing' ? 'bg-blue-50 text-blue-600 border-blue-200' :
                          item.status === 'selesai' ? 'bg-gray-100 text-gray-600 border-gray-200' :
                          'bg-yellow-50 text-yellow-600 border-yellow-200'
                        }`}>
                        {item.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-center">
                      <div className="flex justify-center gap-2">
                        <button onClick={() => handleEdit(item)} className="text-amber-500 hover:text-amber-600 p-1"><Edit2 size={18} /></button>
                        <button onClick={() => handleDelete(item.id_jadwal)} className="text-red-500 hover:text-red-600 p-1"><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-xl w-full max-w-3xl shadow-2xl overflow-hidden animate-slide-up flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-white">
              <h3 className="text-lg font-bold text-slate-800">{isEditMode ? 'Edit Jadwal' : 'Buat Jadwal Baru'}</h3>
              <button onClick={() => setShowModal(false)}><X size={24} className="text-slate-400 hover:text-slate-600"/></button>
            </div>
            
            <div className="p-6 overflow-y-auto flex-1">
              <form id="jadwalForm" onSubmit={handleSubmit} className="space-y-4">
                
                {/* INFO UMUM */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="form-group">
                    <label>Kode Jadwal</label>
                    <input type="text" name="kode_jadwal" value={formData.kode_jadwal} onChange={handleInputChange} placeholder="Auto/Manual" className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label>Nama Kegiatan <span className="text-red-500">*</span></label>
                    <input type="text" name="nama_kegiatan" value={formData.nama_kegiatan} onChange={handleInputChange} required className="form-input"/>
                  </div>
                </div>

                {/* SKEMA & TUK */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-slate-50 p-3 rounded-lg border border-slate-100">
                  <div className="form-group">
                    <label className="flex items-center gap-1"><Layers size={14}/> Pilih Skema <span className="text-red-500">*</span></label>
                    <select name="id_skema" value={formData.id_skema} onChange={handleInputChange} className="form-select cursor-pointer" required>
                      <option value="">-- Pilih Skema --</option>
                      {listSkema.map(s => (
                        <option key={s.id_skema} value={s.id_skema}>{s.judul_skema} ({s.kode_skema})</option>
                      ))}
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-1"><MapPin size={14}/> Pilih TUK <span className="text-red-500">*</span></label>
                    <select name="id_tuk" value={formData.id_tuk} onChange={handleInputChange} className="form-select cursor-pointer" required>
                      <option value="">-- Pilih TUK --</option>
                      {listTuk.map(t => (
                        <option key={t.id_tuk} value={t.id_tuk}>{t.nama_tuk} ({t.jenis_tuk})</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* WAKTU */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                   <div className="form-group">
                    <label>Tgl Awal</label>
                    <input type="date" name="tgl_awal" value={formData.tgl_awal || ''} onChange={handleInputChange} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label>Tgl Akhir</label>
                    <input type="date" name="tgl_akhir" value={formData.tgl_akhir || ''} onChange={handleInputChange} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label>Jam</label>
                    <input type="time" name="jam" value={formData.jam || ''} onChange={handleInputChange} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label>Pra-Asesmen</label>
                    <input type="date" name="tgl_pra_asesmen" value={formData.tgl_pra_asesmen || ''} onChange={handleInputChange} className="form-input"/>
                  </div>
                </div>

                {/* DETAIL */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="form-group">
                    <label>Tahun</label>
                    <input type="number" name="tahun" value={formData.tahun} onChange={handleInputChange} className="form-input"/>
                  </div>
                  <div className="form-group">
                    <label>Bulan</label>
                    <select name="periode_bulan" value={formData.periode_bulan} onChange={handleInputChange} className="form-select cursor-pointer">
                        <option value="">-- Pilih --</option>
                        {listBulan.map((b) => <option key={b} value={b}>{b}</option>)}
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Gelombang</label>
                    <input type="text" name="gelombang" value={formData.gelombang} onChange={handleInputChange} className="form-input" placeholder="Contoh: 1"/>
                  </div>
                  <div className="form-group">
                    <label>Kuota</label>
                    <input type="number" name="kuota" value={formData.kuota} onChange={handleInputChange} className="form-input"/>
                  </div>
                </div>

                {/* STATUS & MODE */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div className="form-group">
                    <label>Mode Uji</label>
                    <select name="pelaksanaan_uji" value={formData.pelaksanaan_uji} onChange={handleInputChange} className="form-select cursor-pointer">
                      <option value="luring">Luring (Offline)</option>
                      <option value="daring">Daring (Online)</option>
                      <option value="hybrid">Hybrid</option>
                      <option value="onsite">Onsite</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Status</label>
                    <select name="status" value={formData.status} onChange={handleInputChange} className="form-select cursor-pointer">
                      <option value="draft">Draft</option>
                      <option value="open">Open</option>
                      <option value="ongoing">Ongoing</option>
                      <option value="selesai">Selesai</option>
                      <option value="arsip">Arsip</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="flex items-center gap-1"><LinkIcon size={14}/> URL Agenda</label>
                    <input type="text" name="url_agenda" value={formData.url_agenda} onChange={handleInputChange} placeholder="https://..." className="form-input"/>
                  </div>
                </div>

              </form>
            </div>

            <div className="modal-footer">
              <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
              <button type="submit" form="jadwalForm" className="btn-save"><Save size={16}/> Simpan</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalUji;