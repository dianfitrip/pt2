import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";
import { Users, Building2, ClipboardCheck, GraduationCap } from "lucide-react";

const Counter = ({ value, duration = 2 }) => {
  const [count, setCount] = useState(0);
  const countRef = useRef(null);
  const isInView = useInView(countRef, { once: true });

  const numericValue = parseInt(value.replace(/[^0-9]/g, ""));
  const suffix = value.replace(/[0-9]/g, "");

  useEffect(() => {
    if (isInView) {
      let start = 0;
      const end = numericValue;
      const totalMs = duration * 1000;
      const incrementTime = totalMs / end;

      const timer = setInterval(() => {
        start += Math.ceil(end / 100);
        if (start >= end) {
          setCount(end);
          clearInterval(timer);
        } else {
          setCount(start);
        }
      }, incrementTime > 10 ? incrementTime : 10);

      return () => clearInterval(timer);
    }
  }, [isInView, numericValue, duration]);

  return (
    <span ref={countRef}>
      {count.toLocaleString()}
      {suffix}
    </span>
  );
};

export default function Statistics() {
  const stats = [
    {
      id: 1,
      value: "25+",
      label: "Asesor Tersertifikasi",
      icon: <GraduationCap size={30} />,
    },
    {
      id: 2,
      value: "10",
      label: "Tempat Uji Kompetensi",
      icon: <Building2 size={30} />,
    },
    {
      id: 3,
      value: "40",
      label: "Skema Sertifikasi",
      icon: <ClipboardCheck size={30} />,
    },
    {
      id: 4,
      value: "1200+",
      label: "Peserta Tersertifikasi",
      icon: <Users size={30} />,
    },
  ];

  return (
    <section className="relative bg-[#071E3D] py-32 overflow-hidden border-t border-white/5">
      <div className="absolute -bottom-20 -right-20 w-[600px] h-[600px] bg-orange-500/10 rounded-full blur-[120px] pointer-events-none" />
      <div className="absolute top-1/4 -left-20 w-[500px] h-[500px] bg-blue-400/10 rounded-full blur-[130px] pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#ffffff08_1px,transparent_1px)] [background-size:40px_40px] opacity-40" />

      <div className="relative max-w-7xl mx-auto px-6 z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-black text-white uppercase tracking-tight">
            Statistik <span className="text-orange-500">SIMLSP</span>
          </h2>

          <div className="w-16 h-1.5 bg-orange-500 mx-auto mt-6 rounded-full" />

          <p className="mt-8 text-blue-100/60 text-lg max-w-2xl mx-auto font-medium">
            Data capaian real-time pelaksanaan sertifikasi kompetensi nasional yang terukur dan akurat.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {stats.map((item, index) => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -10 }}
              className="group relative bg-white/5 backdrop-blur-sm
                         border border-white/10 rounded-3xl p-10
                         text-center hover:bg-white/10
                         hover:border-orange-500/50 transition-all duration-500"
            >

              <div className="absolute inset-0 bg-orange-500/5 opacity-0 group-hover:opacity-100 rounded-3xl transition-opacity duration-500" />
              <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl
                              bg-white/5 text-orange-500 mb-8
                              group-hover:bg-orange-500 group-hover:text-white
                              group-hover:rotate-6 transition-all duration-500 shadow-xl">
                {item.icon}
              </div>

              <div className="relative text-5xl font-black text-white
                              tracking-tighter mb-4">
                <Counter value={item.value} />
              </div>

              <div className="relative text-blue-100/40
                              font-black uppercase tracking-[0.2em] text-[10px]
                              group-hover:text-blue-100/70 transition-colors duration-500">
                {item.label}
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}