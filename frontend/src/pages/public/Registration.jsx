import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import axios from "axios";
import { 
  User, 
  MapPin, 
  GraduationCap, 
  ChevronRight, 
  ChevronLeft, 
  HelpCircle,
  Info,
  CheckCircle2,
  Mail,
  ShieldCheck,
  CreditCard,
  FileText,
  Sparkles
} from "lucide-react";

import { submitPendaftaran } from "../../services/pendaftaran.service";

const API_URL = "http://localhost:3000/api/public";

export default function Registration() {
  const [step, setStep] = useState(1);
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    nik: "",
    nama_lengkap: "",
    email: "",
    no_hp: "",
    provinsi: "",
    kota: "",
    kecamatan: "",
    kelurahan: "",
    alamat: "",
    wilayah_rji: "",
    program_studi: "",
    kompetensi_keahlian: ""
  });

  const [provinsi, setProvinsi] = useState([]);
  const [kota, setKota] = useState([]);
  const [kecamatan, setKecamatan] = useState([]);
  const [kelurahan, setKelurahan] = useState([]);

  useEffect(() => {
    axios.get(`${API_URL}/provinsi`)
      .then(res => setProvinsi(res.data))
      .catch(err => console.error("Gagal load provinsi:", err));
  }, []);

  const handleProvinsiChange = async (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const id = selectedOption.dataset.id;
    const name = e.target.value;

    setFormData({ ...formData, provinsi: name, kota: "", kecamatan: "", kelurahan: "" });
    
    if (id) {
      try {
        const res = await axios.get(`${API_URL}/kota/${id}`);
        setKota(res.data);
      } catch (err) { console.error(err); }
    }
    setKecamatan([]);
    setKelurahan([]);
  };

  const handleKotaChange = async (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const id = selectedOption.dataset.id;
    const name = e.target.value;

    setFormData({ ...formData, kota: name, kecamatan: "", kelurahan: "" });
    
    if (id) {
      try {
        const res = await axios.get(`${API_URL}/kecamatan/${id}`);
        setKecamatan(res.data);
      } catch (err) { console.error(err); }
    }
    setKelurahan([]);
  };

  const handleKecamatanChange = async (e) => {
    const selectedOption = e.target.selectedOptions[0];
    const id = selectedOption.dataset.id;
    const name = e.target.value;

    setFormData({ ...formData, kecamatan: name, kelurahan: "" });
    
    if (id) {
      try {
        const res = await axios.get(`${API_URL}/kelurahan/${id}`);
        setKelurahan(res.data);
      } catch (err) { console.error(err); }
    }
  };

  const handleChange = (e) =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const nextStep = () => setStep(step + 1);
  const prevStep = () => setStep(step - 1);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      await submitPendaftaran({
        ...formData,
        captcha_valid: true,
        tanggal_daftar: new Date()
      });
      alert("Pendaftaran berhasil!");
    } catch {
      alert("Gagal mendaftar. Pastikan backend menyala.");
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
                Pendaftaran <span className="text-orange-500">Akun Asesi</span>
              </motion.h1>
              <p className="text-slate-500 font-medium leading-relaxed">
                Silakan lengkapi data diri Anda untuk mengikuti uji kompetensi sertifikasi profesi melalui SIMLSP.
              </p>
            </header>

            <div className="flex items-center gap-4 mb-12">
              {[1, 2, 3].map((num) => (
                <div key={num} className="flex items-center gap-2">
                  <div className={`w-11 h-11 rounded-2xl flex items-center justify-center font-bold transition-all duration-500 ${
                    step === num ? "bg-[#071E3D] text-white shadow-xl shadow-[#071E3D]/20 scale-110" : 
                    step > num ? "bg-emerald-500 text-white" : "bg-slate-100 text-slate-400"
                  }`}>
                    {step > num ? <CheckCircle2 size={22} /> : num}
                  </div>
                  {num < 3 && <div className="w-10 h-[2px] bg-slate-100" />}
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
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500"><User size={24} /></div>
                      <h2 className="text-xl font-black text-[#071E3D]">Informasi Akun & Pribadi</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <InputGroup label="Nama Lengkap*" name="nama_lengkap" value={formData.nama_lengkap} onChange={handleChange} placeholder="Nama sesuai KTP" />
                      <InputGroup label="Nomor KTP/NIK*" name="nik" value={formData.nik} onChange={handleChange} placeholder="16 digit NIK" />
                      <InputGroup label="Alamat Email*" name="email" value={formData.email} onChange={handleChange} placeholder="nama@domain.com" type="email" />
                      <InputGroup label="Nomor HP / WhatsApp*" name="no_hp" value={formData.no_hp} onChange={handleChange} placeholder="0812xxxx" />
                    </div>
                  </motion.div>
                )}

                {step === 2 && (
                  <motion.div 
                    key="step2"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500"><MapPin size={24} /></div>
                      <h2 className="text-xl font-black text-[#071E3D]">Domisili & Lokasi Uji</h2>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <SelectGroup label="Provinsi*" onChange={handleProvinsiChange} value={formData.provinsi}>
                        <option value="">Pilih Provinsi</option>
                        {provinsi.map(p => <option key={p.id} data-id={p.id} value={p.name}>{p.name}</option>)}
                      </SelectGroup>
                      <SelectGroup label="Kota / Kabupaten*" onChange={handleKotaChange} value={formData.kota} disabled={!formData.provinsi}>
                        <option value="">Pilih Kota</option>
                        {kota.map(k => <option key={k.id} data-id={k.id} value={k.name}>{k.name}</option>)}
                      </SelectGroup>
                      <SelectGroup label="Kecamatan*" onChange={handleKecamatanChange} value={formData.kecamatan} disabled={!formData.kota}>
                        <option value="">Pilih Kecamatan</option>
                        {kecamatan.map(k => <option key={k.id} data-id={k.id} value={k.name}>{k.name}</option>)}
                      </SelectGroup>
                      <SelectGroup label="Kelurahan*" name="kelurahan" onChange={handleChange} value={formData.kelurahan} disabled={!formData.kecamatan}>
                        <option value="">Pilih Kelurahan</option>
                        {kelurahan.map(k => <option key={k.id} value={k.name}>{k.name}</option>)}
                      </SelectGroup>
                      <div className="md:col-span-2">
                        <InputGroup label="Alamat Lengkap*" name="alamat" value={formData.alamat} onChange={handleChange} placeholder="Jalan, No. Rumah, RT/RW, Kelurahan, Kecamatan" />
                      </div>
                    </div>
                  </motion.div>
                )}

                {step === 3 && (
                  <motion.div 
                    key="step3"
                    initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}
                    className="space-y-6"
                  >
                    <div className="flex items-center gap-3 mb-8">
                      <div className="p-3 bg-orange-50 rounded-xl text-orange-500"><GraduationCap size={24} /></div>
                      <h2 className="text-xl font-black text-[#071E3D]">Kompetensi Keahlian</h2>
                    </div>
                    <div className="grid grid-cols-1 gap-6">
                       <InputGroup label="Wilayah RJI*" name="wilayah_rji" value={formData.wilayah_rji} onChange={handleChange} placeholder="Contoh: Jawa Tengah" />
                       <InputGroup label="Program Studi*" name="program_studi" value={formData.program_studi} onChange={handleChange} placeholder="Contoh: Teknik Informatika" />
                       <InputGroup label="Kompetensi Keahlian*" name="kompetensi_keahlian" value={formData.kompetensi_keahlian} onChange={handleChange} placeholder="Contoh: Web Developer" />
                    </div>
                    <div className="bg-emerald-50 border border-emerald-100 p-6 rounded-2xl flex gap-4 mt-6">
                      <ShieldCheck className="text-emerald-500 shrink-0" size={24} />
                      <p className="text-sm text-emerald-800 leading-relaxed font-bold">
                        Akun Anda hanya satu untuk satu NIK dan dapat digunakan untuk lebih dari satu skema uji.
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
                  onClick={step === 3 ? handleSubmit : nextStep} 
                  disabled={loading}
                  className={`px-10 py-5 rounded-2xl font-black uppercase text-xs tracking-[0.2em] transition-all duration-300 shadow-xl ${
                    step === 3 ? "bg-orange-500 text-white hover:bg-[#071E3D] shadow-orange-500/20" : "bg-[#071E3D] text-white hover:bg-orange-600 shadow-[#071E3D]/20"
                  }`}
                >
                  {loading ? "Mengirim..." : step === 3 ? "Daftar Akun Sekarang" : "Langkah Berikutnya"}
                </button>
              </div>
            </div>
          </div>

          <div className="lg:col-span-4 space-y-8 lg:sticky lg:top-32">
            <div className="bg-orange-50 border border-orange-100 rounded-[2.5rem] p-8 shadow-sm">
              <div className="flex items-center gap-3 mb-8 text-orange-600">
                <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center text-orange-500 shadow-sm"><Info size={20} /></div>
                <h3 className="font-black uppercase tracking-widest text-xs">Informasi Penting</h3>
              </div>
              <div className="space-y-6">
                <SidebarInfo icon={Mail} text="Cek Inbox/Spam email setelah mendaftar." />
                <SidebarInfo icon={FileText} text="Siapkan KTP & Ijazah di profil asesi." />
                <SidebarInfo icon={CreditCard} text="Verifikasi pembayaran dilakukan Admin." />
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
                  <h4 className="text-white font-black uppercase tracking-[0.2em] text-sm mb-3">Pusat Bantuan</h4>
                  <p className="text-slate-400 text-[11px] leading-relaxed mb-8 px-4 font-medium">Bingung alur pendaftaran? Klik untuk panduan lengkap & FAQ.</p>
                  <div className="w-full py-4 bg-white/5 rounded-2xl border border-white/10 flex items-center justify-center gap-3 group-hover:bg-orange-500 transition-all duration-500">
                    <span className="text-[10px] font-black uppercase tracking-[0.3em] text-white">Buka FAQ</span>
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

function SidebarInfo({ icon: Icon, text }) {
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

function SelectGroup({ label, children, onChange, value, disabled, name }) {
  return (
    <div className="flex flex-col gap-2.5">
      <label className="text-[10px] font-black uppercase tracking-[0.25em] text-[#071E3D] ml-1 opacity-50">{label}</label>
      <div className="relative">
        <select
          name={name}
          value={value}
          onChange={onChange}
          disabled={disabled}
          className="w-full px-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl focus:outline-none focus:border-orange-500 focus:bg-white transition-all text-sm font-bold text-[#071E3D] appearance-none cursor-pointer disabled:opacity-50"
        >
          {children}
        </select>
        <div className="absolute right-6 top-1/2 -translate-y-1/2 pointer-events-none text-slate-400">
           <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="m6 9 6 6 6-6"/></svg>
        </div>
      </div>
    </div>
  );
}