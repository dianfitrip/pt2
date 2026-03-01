import React from "react";
import { motion } from "framer-motion";
import { Star, Quote, Camera, ArrowRight, Sparkles } from "lucide-react";

export default function LatestUpdates() {
  const testimonials = [
    {
      id: 1,
      name: "Regina Rana",
      role: "Asesi Web Developer",
      comment:
        "Proses asesmen di SIMLSP sangat transparan dan asesornya sangat profesional. Sertifikatnya sangat membantu karir saya.",
      rating: 5,
    },
    {
      id: 2,
      name: "Budi Pratama",
      role: "Asesi Digital Marketing",
      comment:
        "Sistem pendaftarannya mudah, informasinya jelas. Sangat merekomendasikan bagi yang ingin sertifikasi BNSP.",
      rating: 5,
    },
  ];

  const activities = [
    {
      id: 1,
      title: "Pelaksanaan Uji Kompetensi Batch Feb 2026",
      date: "15 Feb 2026",
      tag: "Event",
    },
    {
      id: 2,
      title: "MOU LSP dengan Universitas Gadjah Mada",
      date: "10 Feb 2026",
      tag: "News",
    },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="absolute -top-40 -left-40 w-[600px] h-[600px] bg-[#071E3D]/[0.03] rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.02] rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#071E3D08_1px,transparent_1px)] [background-size:30px_30px] opacity-40 pointer-events-none" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20 items-center">
          
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="relative bg-orange-500 rounded-[3.5rem] p-10 md:p-16 shadow-[0_30px_100px_-20px_rgba(249,115,22,0.3)]"
          >
            <Quote
              className="absolute top-10 right-10 text-white opacity-10"
              size={120}
              strokeWidth={3}
            />

            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/20 border border-white/30 text-white text-[10px] font-black uppercase tracking-[0.3em] mb-10">
                <Sparkles size={12} />
                Testimonials
              </div>

              <h3 className="text-white text-3xl md:text-4xl font-black mb-12 tracking-tight">
                Kepercayaan <br /> Para Profesional
              </h3>

              <div className="space-y-6">
                {testimonials.map((testi) => (
                  <motion.div
                    key={testi.id}
                    whileHover={{ x: 10 }}
                    className="bg-white/10 backdrop-blur-xl border border-white/20 p-8 rounded-[2.5rem] transition-all duration-300"
                  >
                    <div className="flex gap-1 mb-5">
                      {[...Array(testi.rating)].map((_, i) => (
                        <Star key={i} size={14} className="text-yellow-300" fill="currentColor" />
                      ))}
                    </div>

                    <p className="text-white font-medium mb-8 text-base leading-relaxed opacity-90">
                      “{testi.comment}”
                    </p>

                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/20 border border-white/30 text-white font-black flex items-center justify-center text-xl shadow-inner">
                        {testi.name.charAt(0)}
                      </div>
                      <div>
                        <h5 className="text-white font-bold text-sm leading-none mb-1.5">
                          {testi.name}
                        </h5>
                        <p className="text-orange-100/60 text-[10px] uppercase font-black tracking-widest leading-none">
                          {testi.role}
                        </p>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 40 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <div className="inline-flex items-center gap-3 px-5 py-2 rounded-2xl bg-[#071E3D]/[0.03] border border-[#071E3D]/5 text-[#071E3D] text-[10px] font-black uppercase tracking-[0.4em] mb-8">
              <Camera size={14} className="text-orange-500" />
              LSP Bulletin
            </div>

            <h2 className="text-4xl md:text-5xl font-black text-[#071E3D] mb-10 leading-tight tracking-tight">
              Informasi & <br />
              <span className="text-orange-500 relative inline-block">
                Aktivitas Terkini
                <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                  <path d="M0 5C20 2 40 2 60 5C80 8 100 8 100 5" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
                </svg>
              </span>
            </h2>

            <div className="space-y-5 mb-12">
              {activities.map((act) => (
                <motion.div
                  key={act.id}
                  whileHover={{ x: 15 }}
                  className="group relative p-8 rounded-[2.5rem] bg-white border border-slate-100 shadow-[0_15px_40px_-15px_rgba(7,30,61,0.05)] hover:shadow-[0_25px_50px_-15px_rgba(7,30,61,0.1)] transition-all duration-500 cursor-pointer overflow-hidden"
                >
                  <div className="absolute top-0 left-0 w-1.5 h-full bg-orange-500 opacity-0 group-hover:opacity-100 transition-opacity" />
                  
                  <div className="flex justify-between items-start mb-3">
                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">
                      {act.date}
                    </span>
                    <span className="px-3 py-1 rounded-lg bg-orange-50 text-orange-500 text-[9px] font-black uppercase tracking-wider">
                      {act.tag}
                    </span>
                  </div>
                  
                  <h4 className="text-lg font-bold text-[#071E3D] group-hover:text-orange-500 transition-colors leading-snug">
                    {act.title}
                  </h4>
                </motion.div>
              ))}
            </div>

            <button
              className="group flex items-center gap-4 text-xs font-black uppercase tracking-[0.25em] text-[#071E3D] hover:text-orange-500 transition-all duration-300"
            >
              <span className="border-b-2 border-[#071E3D] group-hover:border-orange-500 pb-1">
                Eksplor Seluruh Dokumentasi
              </span>
              <div className="p-3 rounded-full bg-[#071E3D] text-white group-hover:bg-orange-500 group-hover:translate-x-2 transition-all shadow-lg shadow-[#071E3D]/20">
                <ArrowRight size={16} />
              </div>
            </button>
          </motion.div>

        </div>
      </div>
    </section>
  );
}