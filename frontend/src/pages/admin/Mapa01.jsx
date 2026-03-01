import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { ArrowLeft, Save, CheckCircle, Loader2, List } from 'lucide-react';

const Mapa01 = () => {
  const { id } = useParams(); // Ambil ID MAPA dari URL
  const navigate = useNavigate();
  
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [masterData, setMasterData] = useState(null);

  // State Form sesuai dengan kolom di database
  const [formData, setFormData] = useState({
    profil_asesi: '',
    tujuan_asesmen: 'sertifikasi',
    lingkungan: 'tempat_kerja_nyata',
    peluang_bukti: 'tersedia',
    pelaksana: 'lsp'
  });

  useEffect(() => {
    const fetchDetail = async () => {
      try {
        // 1. Ambil data Master MAPA (untuk menampilkan nama Skema di header)
        const masterRes = await api.get(`/admin/mapa/${id}`);
        const master = masterRes.data?.data || masterRes.data;
        setMasterData(master);

        // 2. Coba ambil isi form MAPA-01 jika sebelumnya sudah pernah di-save
        const res = await api.get(`/admin/mapa01/${id}`);
        const m01Data = res.data?.data || res.data;
        
        if (m01Data && Object.keys(m01Data).length > 0) {
          setFormData({
            profil_asesi: m01Data.profil_asesi || '',
            tujuan_asesmen: m01Data.tujuan_asesmen || 'sertifikasi',
            lingkungan: m01Data.lingkungan || 'tempat_kerja_nyata',
            peluang_bukti: m01Data.peluang_bukti || 'tersedia',
            pelaksana: m01Data.pelaksana || 'lsp'
          });
        }
      } catch (error) {
        // Jika error (biasanya karena belum ada data / 404), biarkan form kosong
        console.log("Data MAPA-01 belum ada, menggunakan form kosong.");
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      // Mengirim data ke backend, pastikan id_mapa ikut terkirim
      await api.post('/admin/mapa01', { ...formData, id_mapa: id });
      Swal.fire('Berhasil', 'Dokumen rincian MAPA-01 berhasil disimpan', 'success');
      navigate('/admin/asesi/mapa'); // Setelah sukses, kembali ke tabel MAPA
    } catch (error) {
      Swal.fire('Gagal', error.response?.data?.message || 'Terjadi kesalahan', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return <div className="flex justify-center items-center h-screen"><Loader2 className="animate-spin text-indigo-500" size={50} /></div>;
  }

  return (
    <div className="p-6 max-w-5xl mx-auto">
      
      {/* Header Halaman */}
      <div className="flex items-center gap-4 mb-6">
        <button onClick={() => navigate('/admin/asesi/mapa')} className="p-2 bg-white border rounded-lg hover:bg-slate-50 transition">
          <ArrowLeft size={20} className="text-slate-600" />
        </button>
        <div>
          <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
            <List className="text-indigo-600"/> Pengisian MAPA-01
          </h1>
          <p className="text-slate-500 text-sm mt-1">
            Skema: <span className="font-semibold text-slate-700">{masterData?.skema?.judul_skema || '-'}</span> (Versi: {masterData?.versi || '-'})
          </p>
        </div>
      </div>

      {/* Area Form */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <form onSubmit={handleSubmit}>
          <div className="p-8 space-y-6">
            
            <div className="flex flex-col gap-2">
              <label className="text-sm font-bold text-slate-700">Konteks / Profil Asesi <span className="text-red-500">*</span></label>
              <p className="text-xs text-slate-500 mb-1">Jelaskan latar belakang peserta, contoh: Mahasiswa semester akhir, karyawan perusahaan X, dll.</p>
              <textarea 
                name="profil_asesi" value={formData.profil_asesi} onChange={handleChange} 
                rows="4" placeholder="Masukkan rincian profil asesi..." required
                className="border border-slate-300 p-3 rounded-lg focus:ring-2 focus:ring-indigo-200 focus:border-indigo-400 outline-none w-full"
              ></textarea>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-slate-100">
              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Tujuan Asesmen</label>
                <select name="tujuan_asesmen" value={formData.tujuan_asesmen} onChange={handleChange} className="border border-slate-300 p-3 rounded-lg focus:border-indigo-400 outline-none">
                  <option value="sertifikasi">Sertifikasi Baru</option>
                  <option value="sertifikasi_ulang">Sertifikasi Ulang (RCC)</option>
                  <option value="pkt">Pengakuan Kompetensi Terkini (PKT)</option>
                  <option value="rpl">Rekognisi Pembelajaran Lampau (RPL)</option>
                  <option value="lainnya">Lainnya</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Lingkungan Asesmen</label>
                <select name="lingkungan" value={formData.lingkungan} onChange={handleChange} className="border border-slate-300 p-3 rounded-lg focus:border-indigo-400 outline-none">
                  <option value="tempat_kerja_nyata">Tempat Kerja Nyata (TUK Tempat Kerja)</option>
                  <option value="tempat_kerja_simulasi">Tempat Kerja Simulasi (TUK Sewaktu/Mandiri)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Peluang Bukti</label>
                <select name="peluang_bukti" value={formData.peluang_bukti} onChange={handleChange} className="border border-slate-300 p-3 rounded-lg focus:border-indigo-400 outline-none">
                  <option value="tersedia">Tersedia (Mudah dikumpulkan)</option>
                  <option value="terbatas">Terbatas (Butuh simulasi khusus)</option>
                </select>
              </div>

              <div className="flex flex-col gap-2">
                <label className="text-sm font-bold text-slate-700">Pihak Pelaksana / Penanggung Jawab</label>
                <select name="pelaksana" value={formData.pelaksana} onChange={handleChange} className="border border-slate-300 p-3 rounded-lg focus:border-indigo-400 outline-none">
                  <option value="lsp">Lembaga Sertifikasi Profesi (LSP)</option>
                  <option value="organisasi_pelatihan">Organisasi Pelatihan</option>
                  <option value="asesor_perusahaan">Asesor Perusahaan Internal</option>
                </select>
              </div>
            </div>

          </div>

          <div className="bg-slate-50 p-6 border-t border-slate-200 flex justify-end gap-4">
            <button type="button" onClick={() => navigate('/admin/asesi/mapa')} className="px-6 py-2.5 bg-white border border-slate-300 text-slate-700 rounded-lg hover:bg-slate-100 font-semibold transition shadow-sm">
              Batal
            </button>
            <button type="submit" disabled={saving} className="px-6 py-2.5 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 font-bold flex items-center gap-2 transition shadow-sm disabled:opacity-50">
              {saving ? <Loader2 size={18} className="animate-spin" /> : <CheckCircle size={18} />}
              Simpan MAPA-01
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Mapa01;