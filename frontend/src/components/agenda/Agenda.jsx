import React from "react";
import { motion } from "framer-motion";
import { CalendarRange, Sparkles } from "lucide-react";
import AgendaCarousel from "./AgendaCarousel";

export default function Agenda() {
  return (
    <section className="relative py-32 lg:py-48 bg-[#071E3D] overflow-hidden">
      <div className="absolute -top-20 -left-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/2 left-1/3 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />
      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8 items-center">
          <motion.div
            initial={{ opacity: 0, x: -40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="lg:col-span-5"
          >
            <div className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/5 border border-white/10 text-orange-400 mb-8">
              <Sparkles size={14} className="animate-pulse" />
              <span className="text-[10px] font-black tracking-[0.3em] uppercase">
                Event & Schedule
              </span>
            </div>

            <h2 className="text-5xl md:text-6xl font-black text-white leading-tight mb-8">
              Agenda <span className="text-orange-500">&</span> Jadwal 
              <br />
              <span className="relative">
                Uji Kompetensi
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 5C20 2 40 2 60 5C80 8 100 8 100 5" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <p className="text-blue-100/60 text-lg leading-relaxed max-w-xl mb-12">
              Akses informasi resmi pelaksanaan sertifikasi kompetensi nasional yang 
              terintegrasi dan dikelola secara profesional sesuai standar BNSP.
            </p>

            <div className="flex items-center gap-6">
              <div className="flex -space-x-3">
                {[1,2,3,4].map(i => (
                  <div key={i} className="w-10 h-10 rounded-full border-2 border-[#071E3D] bg-blue-900 flex items-center justify-center">
                    <span className="text-[8px] text-white/30 font-bold tracking-tighter">LSP</span>
                  </div>
                ))}
              </div>
              <p className="text-white/50 text-xs font-bold uppercase tracking-widest leading-none">
                <span className="text-white">1,200+</span> Peserta Terdaftar <br /> 
                <span className="text-[9px] opacity-60">Bulan Februari</span>
              </p>
            </div>

            <div className="mt-12 flex items-center gap-3 text-white/30 text-[10px] font-black uppercase tracking-[0.25em]">
              <CalendarRange size={16} />
              Geser untuk melihat jadwal lainnya
            </div>
          </motion.div>
          <div className="lg:col-span-7 w-full overflow-visible">
            <AgendaCarousel />
          </div>
        </div>
      </div>
    </section>
  );
}