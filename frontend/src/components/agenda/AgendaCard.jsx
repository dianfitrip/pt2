import React from "react";
import { 
  Calendar, 
  MapPin, 
  BookOpen, 
  ArrowRight, 
  Clock, 
  CheckCircle2, 
  XCircle 
} from "lucide-react";
import { motion } from "framer-motion";

export default function AgendaCard({ title, date, location, scheme, status }) {
  const isOpen = status === "Dibuka";

  return (
    <motion.div 
      whileHover={{ y: -10 }}
      className="bg-white rounded-[2.5rem] p-8 shadow-[0_15px_40px_-15px_rgba(7,30,61,0.1)] hover:shadow-[0_30px_60px_-20px_rgba(249,115,22,0.15)] h-full flex flex-col border-none transition-all duration-500 group"
    >
      {/* HEADER */}
      <div className="flex justify-between items-center mb-8">
        <span
          className={`flex items-center gap-2 px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest
          ${isOpen 
            ? "bg-emerald-50 text-emerald-600" 
            : "bg-slate-50 text-slate-400"}`}
        >
          {isOpen ? <CheckCircle2 size={12} className="animate-pulse" /> : <XCircle size={12} />} 
          {status}
        </span>

        <div className="p-2.5 rounded-xl bg-orange-50 text-orange-500 group-hover:bg-orange-500 group-hover:text-white transition-all duration-500">
          <Clock size={18} />
        </div>
      </div>

      <h3 className="text-xl font-black text-[#071E3D] mb-8 leading-tight group-hover:text-orange-600 transition-colors duration-300">
        {title}
      </h3>

      <div className="space-y-6 flex-grow">
        <Info icon={Calendar} label="Jadwal Pelaksanaan" value={date} />
        <Info icon={MapPin} label="Lokasi TUK" value={location} />
        <Info icon={BookOpen} label="Skema Kompetensi" value={scheme} />
      </div>

      <button
        disabled={!isOpen}
        className={`mt-10 py-5 rounded-2xl font-black uppercase text-[11px] tracking-[0.2em] flex items-center justify-center gap-3 transition-all duration-500
          ${isOpen 
            ? "bg-[#071E3D] text-white hover:bg-orange-600 hover:shadow-xl hover:shadow-orange-500/20" 
            : "bg-slate-100 text-slate-400 cursor-not-allowed"}
        `}
      >
        {isOpen ? (
          <>
            Daftar Sekarang
            <ArrowRight size={16} className="group-hover:translate-x-2 transition-transform" />
          </>
        ) : "Pendaftaran Ditutup"}
      </button>
    </motion.div>
  );
}

function Info({ icon: Icon, label, value }) {
  return (
    <div className="flex gap-4 items-start group/info">
      <div className="w-11 h-11 rounded-2xl bg-slate-50 text-slate-400 flex items-center justify-center flex-shrink-0 group-hover/info:bg-orange-50 group-hover/info:text-orange-500 transition-colors duration-300">
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[9px] font-black uppercase tracking-[0.2em] text-slate-300 mb-1">
          {label}
        </p>
        <p className="text-[13px] font-bold text-slate-600 leading-snug group-hover/info:text-[#071E3D] transition-colors">
          {value}
        </p>
      </div>
    </div>
  );
}