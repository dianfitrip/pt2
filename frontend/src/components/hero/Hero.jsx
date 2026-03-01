import React from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import {
  ChevronRight,
  ShieldCheck,
  Globe,
  Zap,
  CheckCircle2,
  Activity,
} from "lucide-react";

export default function Hero() {
  const navigate = useNavigate();

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.2, delayChildren: 0.3 },
    },
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1, transition: { duration: 0.5 } },
  };

  const benefits = [
    {
      icon: <Globe size={18} />,
      title: "Pendaftaran Online 24/7",
      desc: "Akses kapan saja",
    },
    {
      icon: <Zap size={18} />,
      title: "Proses Cepat & Terintegrasi",
      desc: "Sistem satu pintu",
    },
    {
      icon: <ShieldCheck size={18} />,
      title: "Standar Nasional BNSP",
      desc: "Sertifikasi resmi",
    },
  ];

  return (
    <section className="relative overflow-hidden bg-white py-20 lg:py-32">
      
      <div className="absolute top-0 right-0 -translate-y-1/4 translate-x-1/4 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute bottom-0 left-0 translate-y-1/4 -translate-x-1/4 w-[400px] h-[400px] bg-[#071E3D]/10 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="z-10"
        >
          <motion.div
            variants={itemVariants}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-orange-50 border border-orange-100 mb-8"
          >
            <ShieldCheck size={18} className="text-orange-500" />
            <span className="text-orange-500 text-[10px] font-black uppercase tracking-widest">
              Lembaga Resmi Sertifikasi Profesi
            </span>
          </motion.div>

          <motion.h1
            variants={itemVariants}
            className="text-5xl md:text-6xl xl:text-7xl font-black text-[#071E3D] leading-[1.1]"
          >
            Sistem Informasi <br />
            <span className="text-orange-500 relative">
              Manajemen LSP
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 5C20 2 40 2 60 5C80 8 100 8 100 5" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h1>

          <motion.p
            variants={itemVariants}
            className="mt-8 text-gray-500 text-lg md:text-xl max-w-xl leading-relaxed font-medium"
          >
            Platform digital terpadu untuk percepatan sertifikasi kompetensi nasional.
            Kelola pendaftaran, asesmen, hingga penerbitan sertifikat dalam satu pintu.
          </motion.p>

          <motion.div variants={itemVariants} className="mt-10 flex flex-wrap gap-4">
            <button className="group px-8 py-4 rounded-2xl bg-orange-500 text-white font-black shadow-xl shadow-orange-500/20 hover:bg-orange-600 transition-all flex items-center gap-2 uppercase text-xs tracking-widest">
              Daftar Uji Kompetensi
              <ChevronRight
                className="group-hover:translate-x-1 transition-transform"
                size={18}
              />
            </button>

            <button
              onClick={() =>
                navigate("/informasi", { state: { activeTab: "skema" } })
              }
              className="px-8 py-4 rounded-2xl border-2 border-[#071E3D]/10 text-[#071E3D] font-black hover:bg-[#071E3D] hover:text-white transition-all uppercase text-xs tracking-widest"
            >
              Lihat 40 Skema Kami
            </button>
          </motion.div>

          <motion.div
            variants={itemVariants}
            className="mt-12 flex flex-wrap items-start gap-x-10 gap-y-6 pt-6 border-t border-gray-100"
          >
            {benefits.map((benefit, index) => (
              <div key={index} className="flex items-start gap-3 group">
                <div className="w-10 h-10 rounded-xl bg-orange-50 text-orange-500 flex items-center justify-center group-hover:bg-orange-500 group-hover:text-white transition-all">
                  {benefit.icon}
                </div>
                <div>
                  <h4 className="text-[13px] font-black text-[#071E3D] uppercase tracking-wide">
                    {benefit.title}
                  </h4>
                  <p className="text-[10px] text-gray-400 uppercase tracking-widest mt-1 font-bold">
                    {benefit.desc}
                  </p>
                </div>
              </div>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.8, x: 50 }}
          animate={{ opacity: 1, scale: 1, x: 0 }}
          transition={{ duration: 0.8 }}
          className="relative"
        >
          <div className="relative z-20 bg-white p-8 md:p-12 rounded-[40px] shadow-[0_32px_64px_-16px_rgba(7,30,61,0.12)] border border-gray-100">
            <div className="flex items-center justify-between mb-8">
              <div className="h-3 w-12 bg-orange-500 rounded-full" />
              <div className="flex gap-2">
                <div className="h-2 w-2 bg-gray-100 rounded-full" />
                <div className="h-2 w-2 bg-gray-100 rounded-full" />
              </div>
            </div>

            <h3 className="text-2xl font-black text-[#071E3D] mb-6 tracking-tight">
              Keunggulan <span className="text-orange-500">Utama</span>
            </h3>

            <div className="space-y-4">
              {[
                "Pendaftaran Real-time Online",
                "Manajemen Asesor Terintegrasi",
                "Penjadwalan Otomatis TUK",
                "E-Sertifikat & Validasi QR",
              ].map((item, i) => (
                <motion.div
                  key={i}
                  whileHover={{ x: 10 }}
                  className="flex items-center gap-4 p-4 rounded-2xl bg-gray-50 border border-transparent hover:border-orange-200 hover:bg-orange-50/50 transition-all group"
                >
                  <div className="bg-white p-2 rounded-lg shadow-sm group-hover:text-orange-500">
                    <CheckCircle2 size={20} className="text-orange-500" />
                  </div>
                  <span className="text-[#071E3D] font-bold text-sm">{item}</span>
                </motion.div>
              ))}
            </div>
          </div>

          <motion.div
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity }}
            className="absolute -top-10 -left-10 z-30 bg-white p-5 rounded-3xl shadow-xl border border-gray-100 hidden md:flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-emerald-50 rounded-2xl flex items-center justify-center">
              <Activity className="text-emerald-500" size={24} />
            </div>
            <div>
              <div className="text-xs font-black text-[#071E3D] uppercase tracking-widest">Network Status</div>
              <div className="text-[10px] text-emerald-600 font-black uppercase">
                Operational
              </div>
            </div>
          </motion.div>

          <motion.div
            animate={{ y: [0, 20, 0] }}
            transition={{ duration: 5, repeat: Infinity, delay: 1 }}
            className="absolute -bottom-10 -right-5 z-30 bg-white p-5 rounded-3xl shadow-xl border border-gray-100 hidden md:flex items-center gap-4"
          >
            <div className="w-12 h-12 bg-orange-50 rounded-2xl flex items-center justify-center">
              <ShieldCheck className="text-orange-500" />
            </div>
            <div>
              <div className="text-xs font-black text-[#071E3D] uppercase tracking-widest">Terverifikasi</div>
              <div className="text-[10px] text-gray-400 font-bold uppercase">
                Badan Nasional (BNSP)
              </div>
            </div>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}