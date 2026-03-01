import React, { useState } from "react";
import { motion } from "framer-motion";
import { Calendar, MapPin, Clock, Search, LayoutGrid, ArrowRight } from "lucide-react";

export default function Jadwal() {
  const [searchTerm, setSearchTerm] = useState("");
  const schedules = [
    {
      id: 1,
      skema: "SKEMA KLASTER PEMELIHARAAN / SERVIS CHASSIS",
      jenis: "Uji Sertifikasi Luring (Offline)",
      tanggal: "08 April 2026",
      waktu: "08:00 - Selesai",
      tuk: "TKRO CHASIS",
      alamat: "Jalan Uji Kompetensi No. 1 beru",
      status: "Mendatang"
    },
    {
      id: 2,
      skema: "Uji Kompetensi Junior Web Developer",
      jenis: "Uji Sertifikasi Daring (Online)",
      tanggal: "20 Maret 2026",
      waktu: "09:00 - 15:00",
      tuk: "TUK Online (Zoom)",
      alamat: "Akses via Dashboard Asesi",
      status: "Segera"
    },
    {
      id: 3,
      skema: "Uji Kompetensi Digital Marketing",
      jenis: "Uji Sertifikasi Luring (Offline)",
      tanggal: "25 Maret 2026",
      waktu: "08:30 - 16:00",
      tuk: "TUK AMIKOM",
      alamat: "Jl. Ring Road Utara, Yogyakarta",
      status: "Segera"
    },
    {
      id: 4,
      skema: "Uji Kompetensi Data Analyst",
      jenis: "Uji Sertifikasi Daring (Online)",
      tanggal: "30 Maret 2026",
      waktu: "10:00 - Selesai",
      tuk: "TUK Online (Daring)",
      alamat: "Akses via Dashboard Asesi",
      status: "Segera"
    }
  ];

  const filteredSchedules = schedules.filter(item =>
    item.skema.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.tuk.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 left-0 w-[500px] h-[500px] bg-[#071E3D]/[0.02] rounded-full blur-[100px] -ml-64 -mt-64" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-orange-100"
          >
            <LayoutGrid size={14} /> Schedule Events
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-[#071E3D] tracking-tight mb-6">
            Jadwal Pelaksanaan <span className="text-orange-500">Asesmen</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Pantau jadwal uji kompetensi terbaru dan lokasi Tempat Uji Kompetensi (TUK) yang tersedia.
          </p>
        </div>

        <div className="max-w-2xl mx-auto mb-12 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari skema atau lokasi TUK..."
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-[#071E3D]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {filteredSchedules.map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.1 }}
              viewport={{ once: true }}
              className="bg-white rounded-[2.5rem] p-8 border border-slate-100 shadow-[0_15px_45px_-15px_rgba(7,30,61,0.08)] hover:shadow-[0_30px_60px_-20px_rgba(249,115,22,0.15)] transition-all duration-500 group relative overflow-hidden"
            >
              <div className="flex justify-between items-start mb-8">
                <span className="px-4 py-1.5 rounded-full bg-[#071E3D]/5 text-[#071E3D] text-[10px] font-black uppercase tracking-widest border border-[#071E3D]/10">
                  {item.jenis}
                </span>
                <div className="text-orange-500 font-black text-[10px] uppercase tracking-widest animate-pulse">
                  ● {item.status}
                </div>
              </div>

              <h3 className="text-xl font-black text-[#071E3D] mb-6 leading-tight group-hover:text-orange-600 transition-colors">
                {item.skema}
              </h3>

              <div className="space-y-4 mb-8">
                <div className="flex items-center gap-4 text-slate-500">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <Calendar size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Tanggal</p>
                    <p className="text-sm font-bold text-slate-700">{item.tanggal}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <Clock size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Waktu</p>
                    <p className="text-sm font-bold text-slate-700">{item.waktu || "08:00 - Selesai"}</p>
                  </div>
                </div>

                <div className="flex items-center gap-4 text-slate-500">
                  <div className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center group-hover:bg-orange-50 group-hover:text-orange-500 transition-colors">
                    <MapPin size={18} />
                  </div>
                  <div>
                    <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Lokasi TUK</p>
                    <p className="text-sm font-bold text-slate-700">{item.tuk}</p>
                    <p className="text-[11px] text-slate-400 font-medium">{item.alamat}</p>
                  </div>
                </div>
              </div>

              <button className="w-full py-4 rounded-2xl bg-[#071E3D] text-white text-[11px] font-black uppercase tracking-[0.2em] flex items-center justify-center gap-2 hover:bg-orange-600 transition-all shadow-lg shadow-[#071E3D]/20">
                Detail Jadwal <ArrowRight size={14} />
              </button>
            </motion.div>
          ))}
        </div>

        <div className="mt-16 text-center">
          <p className="text-slate-400 text-sm font-medium">
            Jadwal sewaktu-waktu dapat berubah sesuai kebijakan LSP. <br />
            Silakan <button className="text-orange-500 font-black hover:underline">Hubungi Helpdesk</button> jika ada pertanyaan.
          </p>
        </div>
      </div>
    </section>
  );
}