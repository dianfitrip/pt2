import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom"; 
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { Search, FileCheck, ChevronDown, BookOpen, ClipboardList, Loader2, AlertTriangle, Inbox } from "lucide-react";

const API_URL = "http://localhost:3000/api/public";

export default function Persyaratan() {
  const [searchTerm, setSearchTerm] = useState(""); 
  const [openIndex, setOpenIndex] = useState(null);
  const [skemaList, setSkemaList] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      setError(null);
      
      const res = await axios.get(`${API_URL}/skema`); 
      const finalData = res.data.data || [];
      setSkemaList(finalData);
    } catch (err) {
      console.error("Gagal mengambil data:", err);
      setError("Endpoint API tidak ditemukan (404). Pastikan server backend sudah running.");
    } finally {
      setLoading(false);
    }
  };

  const filteredData = skemaList.filter((item) =>
    (item.nama_skema || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden min-h-screen">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[#071E3D]/[0.02] rounded-full blur-[100px] -mr-64 -mt-64" />

      <div className="max-w-4xl mx-auto px-6 relative z-10">
        <header className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase mb-6 tracking-widest border border-orange-100"
          >
            <ClipboardList size={14} /> Information
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-[#071E3D] tracking-tight mb-6 uppercase">
            Persyaratan <span className="text-orange-500">Calon Asesi</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg leading-relaxed max-w-2xl mx-auto">
             Daftar persyaratan dokumen untuk peserta uji kompetensi sesuai dengan skema sertifikasi yang dipilih.
          </p>
        </header>

        <div className="relative mb-12">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Ketik nama skema (contoh: Teknik Listrik, Gedung, Web)..."
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 focus:bg-white transition-all text-[#071E3D] font-bold shadow-sm"
          />
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400">
            <Loader2 className="animate-spin mb-4" size={40} />
            <p className="font-bold uppercase text-[10px] tracking-widest">Memuat Data...</p>
          </div>
        ) : error ? (
          <div className="text-center p-12 bg-red-50 rounded-[3rem] border border-red-100">
            <AlertTriangle className="mx-auto text-red-500 mb-4" size={32} />
            <p className="text-red-700 font-bold">{error}</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => {
                const listPersyaratan = item.persyaratans || [];

                return (
                  <div 
                    key={item.id_skema || index} 
                    className={`border transition-all duration-300 rounded-[2rem] overflow-hidden ${
                      openIndex === index ? "border-orange-500/30 shadow-xl shadow-orange-500/5 bg-white" : "border-slate-100 bg-white hover:border-orange-200"
                    }`}
                  >
                    <button
                      onClick={() => setOpenIndex(openIndex === index ? null : index)}
                      className="w-full px-8 py-6 flex justify-between items-center text-left"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                          openIndex === index ? "bg-[#071E3D] text-white" : "bg-slate-50 text-slate-400 border border-slate-100"
                        }`}>
                          <BookOpen size={18} />
                        </div>
                        <span className={`font-black text-xs md:text-sm tracking-tight leading-tight uppercase max-w-[80%] ${
                          openIndex === index ? "text-[#071E3D]" : "text-slate-600"
                        }`}>
                          {item.nama_skema}
                        </span>
                      </div>
                      <ChevronDown className={`transition-transform duration-300 shrink-0 ${openIndex === index ? "rotate-180 text-orange-500" : "text-slate-400"}`} size={20} />
                    </button>

                    <AnimatePresence>
                      {openIndex === index && (
                        <motion.div initial={{ height: 0, opacity: 0 }} animate={{ height: "auto", opacity: 1 }} exit={{ height: 0, opacity: 0 }} className="overflow-hidden">
                          <div className="px-8 pb-8 pt-2">
                            <div className="h-[1px] w-full bg-slate-100 mb-6" />
                          
                            {listPersyaratan.length > 0 ? (
                              <ul className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {listPersyaratan.map((syarat, i) => (
                                  <li key={i} className="flex items-start gap-3 p-4 bg-slate-50 rounded-2xl border border-slate-100">
                                    <FileCheck className="text-orange-500 mt-0.5 shrink-0" size={16} />
                                    <div className="flex flex-col">
                                      <span className="text-xs font-bold text-[#071E3D] uppercase leading-tight">
                                        {syarat.nama_persyaratan}
                                      </span>
                                      <span className="text-[9px] text-slate-400 font-bold uppercase mt-1">
                                        Kategori: {syarat.jenis_persyaratan}
                                      </span>
                                    </div>
                                  </li>
                                ))}
                              </ul>
                            ) : (
                              <div className="flex flex-col items-center justify-center py-8 px-4 bg-slate-50 rounded-2xl border border-dashed border-slate-200">
                                <Inbox className="text-slate-300 mb-2" size={32} />
                                <p className="text-slate-400 text-[10px] font-bold uppercase tracking-widest text-center">
                                  Belum ada data persyaratan untuk skema ini.
                                </p>
                              </div>
                            )}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })
            ) : (
              <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
                <Search size={48} className="mx-auto text-slate-300 mb-4 opacity-20" />
                <p className="text-slate-400 font-bold tracking-tight uppercase text-xs tracking-[0.2em]">
                  Skema sertifikasi tidak ditemukan.
                </p>
              </div>
            )}
          </div>
        )}

        <div className="mt-16 p-10 bg-[#071E3D] rounded-[3rem] text-white relative overflow-hidden group shadow-2xl shadow-[#071E3D]/20">
          <div className="absolute top-0 right-0 w-40 h-40 bg-orange-500/10 rounded-full blur-3xl -mr-20 -mt-20 group-hover:bg-orange-500/20 transition-all duration-500" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8 relative z-10">
            <div className="text-center md:text-left">
              <h4 className="font-black text-xl mb-2 uppercase tracking-widest">Sudah Siap Uji?</h4>
              <p className="text-slate-400 text-sm font-medium">Lengkapi dokumen di atas dan daftarkan diri Anda melalui SIMLSP.</p>
            </div>
            <Link to="/registration" className="px-10 py-5 bg-orange-500 hover:bg-white hover:text-[#071E3D] transition-all duration-500 rounded-2xl font-black text-xs uppercase tracking-widest shadow-xl shadow-orange-500/20">
              Mulai Pendaftaran
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}