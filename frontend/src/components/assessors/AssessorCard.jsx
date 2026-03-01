import React from "react";
import { motion } from "framer-motion";
import {
  Award,
  Building2,
  ShieldCheck,
  ArrowUpRight,
} from "lucide-react";

export default function AssessorCard({
  name,
  competency,
  institution,
  status,
}) {
  const isActive = status === "Aktif";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -12 }}
      className="group relative bg-white rounded-[2.5rem] p-8
                 border border-slate-100
                 shadow-[0_10px_40px_-15px_rgba(7,30,61,0.12)]
                 hover:shadow-[0_25px_60px_-15px_rgba(7,30,61,0.25)]
                 transition-all duration-500 flex flex-col h-full"
    >
      <div className="absolute top-0 right-0 w-32 h-32 bg-[#071E3D]/5 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />

      <div className="flex flex-col items-center">
        <div className="relative mb-6">
          <div className="w-28 h-28 rounded-3xl bg-[#071E3D]/10
                          border border-[#071E3D]/20
                          flex items-center justify-center p-1.5
                          transition-all duration-500
                          group-hover:border-orange-500">
            <div className="w-full h-full rounded-2xl bg-white flex items-center justify-center shadow-sm">
              <span className="text-[#071E3D] font-black text-4xl select-none group-hover:text-orange-500 transition-colors">
                {name.charAt(0)}
              </span>
            </div>
          </div>

          {isActive && (
            <motion.div
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 3 }}
              className="absolute -bottom-2 -right-2
                         bg-orange-500 text-white p-2
                         rounded-xl shadow-lg border-2 border-white"
            >
              <ShieldCheck size={16} strokeWidth={3} />
            </motion.div>
          )}
        </div>

        <h3 className="text-xl font-bold text-[#071E3D] text-center mb-2">
          {name}
        </h3>

        <p className={`text-[10px] font-black uppercase tracking-[0.25em]
          ${isActive ? "text-[#071E3D]" : "text-slate-300"}`}>
          {isActive ? "Asesor Tersertifikasi" : "Non-Aktif"}
        </p>
      </div>
      <div className="my-8 h-[1px] w-full bg-slate-50" />
      <div className="space-y-6 flex-grow">
        <div className="flex gap-4">
          <div className="p-2.5 rounded-xl bg-[#071E3D]/10 text-[#071E3D]
                          group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
            <Award size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Bidang Keahlian
            </p>
            <p className="text-sm font-bold text-slate-700">
              {competency}
            </p>
          </div>
        </div>

        <div className="flex gap-4">
          <div className="p-2.5 rounded-xl bg-[#071E3D]/10 text-[#071E3D]
                          group-hover:bg-orange-50 group-hover:text-orange-500 transition-all">
            <Building2 size={18} />
          </div>
          <div>
            <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">
              Unit Kerja / TUK
            </p>
            <p className="text-sm font-bold text-slate-700">
              {institution}
            </p>
          </div>
        </div>
      </div>
      <div className="mt-10">
        <button
          className="w-full py-4 rounded-2xl
                     bg-[#071E3D] text-white
                     font-black text-xs tracking-widest uppercase
                     flex items-center justify-center gap-2
                     hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20 transition-all duration-300"
        >
          Detail Profile
          <ArrowUpRight size={16} />
        </button>
      </div>
    </motion.div>
  );
}