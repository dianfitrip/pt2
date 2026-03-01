import React from "react";
import { motion } from "framer-motion";
import { Users, ArrowRight } from "lucide-react";
import AssessorCard from "./AssessorCard";

export default function AssessorList() {
  const assessorData = [
    {
      id: 1,
      name: "Ahmad Fauzi, S.Kom",
      competency: "Junior Web Developer",
      institution: "LSP Teknologi Informasi",
      status: "Aktif",
    },
    {
      id: 2,
      name: "Siti Rahmawati, M.Kom",
      competency: "Digital Marketing",
      institution: "LSP Teknologi Informasi",
      status: "Aktif",
    },
    {
      id: 3,
      name: "Budi Santoso, S.T",
      competency: "Data Analyst",
      institution: "LSP Teknologi Informasi",
      status: "Tidak Aktif",
    },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-[-10%] w-[800px] h-[800px] bg-orange-500/[0.03] rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute bottom-[-20%] left-[-10%] w-[600px] h-[600px] bg-[#071E3D]/[0.04] rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute top-20 left-10 w-64 h-64 border-[1px] border-[#071E3D]/5 rounded-[40%_60%_70%_30%/40%_50%_60%_40%] animate-[blob_20s_infinite_linear] pointer-events-none" />
      <div className="absolute bottom-40 right-10 w-80 h-80 border-[1px] border-orange-500/10 rounded-[60%_40%_30%_70%/50%_30%_70%_50%] animate-[blob_25s_infinite_linear_reverse] pointer-events-none" />
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] opacity-[0.02] pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl
                       bg-[#071E3D]/[0.03] backdrop-blur-sm border border-[#071E3D]/5
                       text-orange-600 text-[10px] font-black uppercase tracking-[0.4em]
                       mb-8"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-orange-500 animate-pulse" />
            LSP Expert Panel
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black text-[#071E3D] leading-tight tracking-tight"
          >
            Tim Asesor <span className="text-orange-500 relative inline-block">
              Profesional
              <svg className="absolute -bottom-3 left-0 w-full" height="12" viewBox="0 0 100 12" preserveAspectRatio="none">
                <path d="M0 10C30 2 70 2 100 10" stroke="#F97316" strokeWidth="6" fill="none" strokeLinecap="round" opacity="0.8" />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="mt-12 text-slate-400 text-lg md:text-xl max-w-3xl mx-auto font-medium leading-relaxed"
          >
            Kurasi tenaga ahli terbaik yang menjamin integritas dan akuntabilitas 
            sertifikasi kompetensi nasional.
          </motion.p>
        </div>

        <motion.div
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={{
            hidden: { opacity: 0 },
            visible: {
              opacity: 1,
              transition: { staggerChildren: 0.15 },
            },
          }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8 lg:gap-10"
        >
          {assessorData.map((assessor) => (
            <AssessorCard key={assessor.id} {...assessor} />
          ))}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-24 text-center"
        >
          <button
            className="group relative inline-flex items-center gap-4 px-12 py-5
                       bg-[#071E3D] text-white overflow-hidden
                       rounded-2xl font-black text-xs tracking-[0.2em] uppercase
                       transition-all duration-500 shadow-2xl shadow-[#071E3D]/20
                       hover:scale-105 active:scale-95"
          >
            <div className="absolute inset-0 bg-gradient-to-r from-orange-500 to-orange-600 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            
            <span className="relative z-10 flex items-center gap-4">
              Eksplor Seluruh Asesor
              <ArrowRight size={18} className="group-hover:translate-x-2 transition-transform duration-300" />
            </span>
          </button>
        </motion.div>
      </div>

  
      <style jsx>{`
        @keyframes blob {
          0% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 40%; transform: rotate(0deg); }
          50% { border-radius: 60% 40% 30% 70% / 50% 30% 70% 50%; transform: rotate(180deg); }
          100% { border-radius: 40% 60% 70% 30% / 40% 50% 60% 40%; transform: rotate(360deg); }
        }
      `}</style>
    </section>
  );
}