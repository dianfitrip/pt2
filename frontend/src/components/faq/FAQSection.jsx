import React from "react";
import { motion } from "framer-motion";
import { HelpCircle } from "lucide-react";
import FAQItem from "./FAQItem";

export default function FAQSection() {
  const faqList = [
    {
      id: 1,
      question: "Apa itu Lembaga Sertifikasi Profesi (LSP)?",
      answer:
        "Lembaga Sertifikasi Profesi (LSP) adalah lembaga yang berwenang melakukan sertifikasi kompetensi kerja sesuai dengan standar nasional yang ditetapkan oleh BNSP.",
    },
    {
      id: 2,
      question: "Siapa saja yang dapat mengikuti uji kompetensi?",
      answer:
        "Mahasiswa, lulusan baru, maupun tenaga kerja profesional yang memenuhi persyaratan sesuai skema sertifikasi.",
    },
    {
      id: 3,
      question: "Bagaimana cara mendaftar uji kompetensi?",
      answer:
        "Pendaftaran dilakukan melalui sistem SIMLSP dengan mengisi formulir dan mengunggah dokumen pendukung.",
    },
    {
      id: 4,
      question: "Apakah sertifikat yang diterbitkan resmi?",
      answer:
        "Ya. Sertifikat diterbitkan secara resmi dan diakui secara nasional melalui BNSP.",
    },
    {
      id: 5,
      question: "Di mana lokasi Tempat Uji Kompetensi (TUK)?",
      answer:
        "TUK dapat dilaksanakan secara luring di lokasi mitra atau secara daring sesuai ketentuan.",
    },
  ];

  return (
    <section className="relative py-32 bg-white overflow-hidden">
      <div className="absolute top-0 right-0 w-[600px] h-[600px] bg-orange-500/[0.03] rounded-full blur-[120px] -translate-y-1/2 translate-x-1/3 pointer-events-none" />
      <div className="absolute bottom-0 left-0 w-[500px] h-[500px] bg-[#071E3D]/[0.03] rounded-full blur-[100px] translate-y-1/3 -translate-x-1/4 pointer-events-none" />
      <div className="absolute inset-0 bg-[radial-gradient(#071E3D08_1px,transparent_1px)] [background-size:40px_40px] opacity-40 pointer-events-none" />

      <div className="relative max-w-4xl mx-auto px-6 z-10">
        <div className="text-center mb-24">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-8 border border-orange-100"
          >
            <HelpCircle size={14} />
            Support Center
          </motion.div>

          <motion.h2
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-black text-[#071E3D] tracking-tight mb-8"
          >
            Frequently Asked <span className="text-orange-500 relative inline-block">
              Questions
              <svg className="absolute -bottom-2 left-0 w-full" height="8" viewBox="0 0 100 8" preserveAspectRatio="none">
                <path d="M0 5C20 2 40 2 60 5C80 8 100 8 100 5" stroke="#F97316" strokeWidth="4" fill="none" strokeLinecap="round" />
              </svg>
            </span>
          </motion.h2>

          <motion.p
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-slate-500 text-lg font-medium max-w-2xl mx-auto leading-relaxed"
          >
            Temukan jawaban atas pertanyaan yang paling sering diajukan terkait
            sertifikasi kompetensi melalui SIMLSP.
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
              transition: { staggerChildren: 0.1 },
            },
          }}
          className="space-y-5"
        >
          {faqList.map((faq) => (
            <motion.div
              key={faq.id}
              variants={{
                hidden: { opacity: 0, y: 10 },
                visible: { opacity: 1, y: 0 },
              }}
            >
              <FAQItem question={faq.question} answer={faq.answer} />
            </motion.div>
          ))}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-20 text-center"
        >
          <div className="inline-flex items-center gap-2 p-1 pr-6 rounded-full bg-slate-50 border border-slate-100">
            <div className="w-8 h-8 rounded-full bg-orange-500 flex items-center justify-center text-white text-xs font-bold">?</div>
            <p className="text-slate-500 text-sm font-black uppercase tracking-widest">
              Masih bingung? <button className="text-orange-500 hover:text-[#071E3D] transition-colors ml-1">Hubungi Helpdesk</button>
            </p>
          </div>
        </motion.div>
      </div>
    </section>
  );
}