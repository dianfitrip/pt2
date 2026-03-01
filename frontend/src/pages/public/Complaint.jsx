import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  User, 
  MessageSquare, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle,
  Info,
  CheckCircle2,
  Mail,
  Send,
  AlertCircle,
  Sparkles
} from "lucide-react";

const API_URL = "http://localhost:3000/api/public";

export default function Complaint() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nama_pengadu: "",
    email_pengadu: "",
    no_hp_pengadu: "",
    sebagai_siapa: "",
    isi_pengaduan: "",
    tanggal_pengaduan: new Date()
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await axios.post(`${API_URL}/pengaduan`, formData);
      
      alert("Pengaduan Anda telah terkirim dan akan segera diproses.");
      
      setStep(1);
      setFormData({
        nama_pengadu: "",
        email_pengadu: "",
        no_hp_pengadu: "",
        sebagai_siapa: "",
        isi_pengaduan: "",
        tanggal_pengaduan: new Date()
      });
    } catch (err) {
      console.error(err);
      alert("Gagal mengirim pengaduan. Pastikan server backend dan database menyala.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <section className="relative py-20 bg-white overflow-hidden min-h-screen">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.04] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#071E3D]/[0.04] rounded-full blur-[120px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
          <div className="lg:col-span-8">
            <header className="mb-10">
              <motion.h1 
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="text-4xl font-black text-[#071E3D] mb-4 tracking-tight"
              >
                Layanan <span className="text-orange-500">Pengaduan Masyarakat</span>
              </motion.h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Sampaikan keluhan atau ketidaksesuaian pelayanan Lembaga Sertifikasi Kompetensi melalui kanal resmi SIMLSP.
              </p>
            </header>

            <div className="flex items-center gap-4 mb-12">
              {[1, 2].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                    step === num ? "bg-[#071E3D] text-white shadow-xl shadow-[#071E3D]/20 scale-110" : 
                    step > num ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {step > num ? <CheckCircle2 size={22} /> : num}
                  </div>
                  {num < 2 && <div className="w-10 h-[2px] bg-slate-100" />}
                </div>
              ))}
            </div>

            <div className="bg-white border border-slate-100 rounded-[3rem] p-8 md:p-14 shadow-[0_30px_70px_-20px_rgba(7,30,61,0.08)]">
              <AnimatePresence mode="wait">
                {step === 1 && (
                  <motion.div 
                    key="step1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                        <User size={24} />
                      </div>
                      <h2 className="text-xl font-black text-[#071E3D]">Data Pelapor</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup 
                        label="Nama Lengkap*" 
                        name="nama_pengadu"
                        value={formData.nama_pengadu}
                        onChange={handleChange}
                        placeholder="Masukkan nama Anda" 
                      />
                      <InputGroup 
                        label="Alamat Email*" 
                        name="email_pengadu"
                        value={formData.email_pengadu}
                        onChange={handleChange}
                        placeholder="nama@domain.com" 
                        type="email" 
                      />
                      <InputGroup 
                        label="Nomor HP / WhatsApp*" 
                        name="no_hp_pengadu"
                        value={formData.no_hp_pengadu}
                        onChange={handleChange}
                        placeholder="0812xxxx" 
                      />
                      <SelectGroup 
                        label="Sebagai Siapa Anda?*" 
                        name="sebagai_siapa"
                        value={formData.sebagai_siapa}
                        onChange={handleChange}
                        options={[
                          { label: "Peserta (Asesi)", value: "asesi" },
                          { label: "Asesor", value: "asesor" },
                          { label: "Masyarakat Umum", value: "masyarakat" }
                        ]} 
                      />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500">
                        <MessageSquare size={24} />
                      </div>
                      <h2 className="text-xl font-black text-[#071E3D]">Detail Aduan</h2>
                    </div>
                    <div className="flex flex-col gap-2.5">
                      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071E3D] ml-1 opacity-50">Pesan Aduan*</label>
                      <textarea 
                        name="isi_pengaduan"
                        value={formData.isi_pengaduan}
                        onChange={handleChange}
                        rows="6"
                        placeholder="Tuliskan keluhan atau laporan Anda secara detail..."
                        className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-bold text-[#071E3D] resize-none"
                      />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4 mt-6">
                      <AlertCircle className="text-emerald-500 shrink-0" size={24} />
                      <p className="text-sm text-emerald-800 leading-relaxed font-bold">
                        Aduan Anda akan kami rahasiakan dan diproses secara profesional oleh tim penanganan keluhan LSP.
                      </p>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              <div className="mt-14 flex justify-between items-center">
                {step > 1 ? (
                  <button onClick={prevStep} className="font-black uppercase tracking-widest text-xs text-slate-400 hover:text-[#071E3D] flex items-center gap-2 transition-all">
                    <ChevronLeft size={18} /> Kembali
                  </button>
                ) : <div />}
                
                <button 
                  onClick={step === 2 ? handleSubmit : nextStep}
                  disabled={loading}
                  className={`px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-xl ${
                    step === 2 ? "bg-orange-500 text-white hover:bg-[#071E3D] shadow-orange-500/20" : "bg-[#071E3D] text-white hover:bg-orange-600 shadow-[#071E3D]/20"
                  }`}
                >
                  {loading ? "Mengirim..." : step === 2 ? (
                    <span className="flex items-center gap-2">Kirim Pengaduan <Send size={16} /></span>
                  ) : "Lanjut Langkah Terakhir"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 text-orange-600">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm">
                  <Info size={20} />
                </div>
                <h3 className="font-black uppercase tracking-widest text-xs">Anda Perlu Tahu</h3>
              </div>
              <div className="space-y-6">
                <InfoItem icon={Mail} text="Periksa Inbox/Spam email Anda untuk menerima bukti pengaduan." />
                <InfoItem icon={AlertCircle} text="Layanan ini ditujukan untuk ketidaksesuaian pelayanan LSP." />
                <InfoItem icon={CheckCircle2} text="Tim kami akan memproses setiap laporan secara berkala." />
              </div>
            </div>

            <Link to="/faq" className="group block relative">
              <motion.div 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="overflow-hidden bg-[#071E3D] rounded-[2.5rem] p-1 shadow-2xl shadow-[#071E3D]/20"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative bg-[#071E3D] rounded-[2.3rem] p-8 border border-white/5 flex flex-col items-center text-center">
                  <div className="relative mb-6">
                    <div className="absolute inset-0 bg-orange-500 blur-2xl opacity-20 group-hover:opacity-40 transition-opacity" />
                    <div className="relative w-16 h-16 rounded-2xl bg-gradient-to-br from-orange-400 to-orange-600 flex items-center justify-center text-white shadow-lg group-hover:rotate-12 transition-transform duration-500">
                      <HelpCircle size={32} strokeWidth={2.5} />
                    </div>
                    <motion.div 
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ repeat: Infinity, duration: 2 }}
                      className="absolute -top-2 -right-2 bg-white text-[#071E3D] p-1.5 rounded-lg shadow-xl"
                    >
                      <Sparkles size={14} />
                    </motion.div>
                  </div>
                  <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-3">Butuh Bantuan?</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-8 px-4 font-medium">
                    Lihat FAQ untuk pertanyaan umum seputar pendaftaran & sertifikasi.
                  </p>
                  <div className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 group-hover:bg-orange-500 group-hover:border-orange-500 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Lihat FAQ</span>
                    <ChevronRight size={16} className="text-orange-400 group-hover:text-white group-hover:translate-x-1 transition-all" />
                  </div>
                </div>
              </motion.div>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
}

function InfoItem({ icon: Icon, text }) {
  return (
    <div className="flex gap-4 group/item">
      <div className="w-8 h-8 rounded-lg bg-white flex items-center justify-center shrink-0 group-hover/item:bg-orange-500 group-hover/item:text-white transition-all duration-300 text-orange-500 shadow-sm">
        <Icon size={16} />
      </div>
      <p className="text-[11px] text-slate-600 leading-relaxed font-bold">{text}</p>
    </div>
  );
}

function InputGroup({ label, name, value, onChange, placeholder, type = "text" }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071E3D] ml-1 opacity-50">{label}</label>
      <input 
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        className="px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white focus:ring-4 focus:ring-orange-500/5 transition-all text-sm font-bold text-[#071E3D]"
      />
    </div>
  );
}

function SelectGroup({ label, name, value, onChange, options }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071E3D] ml-1 opacity-50">{label}</label>
      <div className="relative">
        <select 
          name={name}
          value={value}
          onChange={onChange}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-[#071E3D] appearance-none cursor-pointer"
        >
          <option value="">-- pilih --</option>
          {options.map((opt, i) => (
            <option key={i} value={opt.value}>{opt.label}</option>
          ))}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
          <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
            <path d="m6 9 6 6 6-6"/>
          </svg>
        </div>
      </div>
    </div>
  );
}