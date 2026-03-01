import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, User, Search, Home, Briefcase, Info, Navigation } from "lucide-react";

export default function TUK() {
  const [searchTerm, setSearchTerm] = useState("");

  const tukData = [
    {
      nama: "TUK 01 TKJ-SMKN 3 Sorong",
      alamat: "Sorong Timur, KOTA SORONG, PAPUA BARAT",
      jalan: "Jalan Uji Kompetensi No. 1 Beru",
      jenis: "Sewaktu",
      asesmen: 2,
      penanggungjawab: "Nama Penanggungjawab TUK"
    },
    {
      nama: "TPM BUBUT 01",
      alamat: "Wlingi, KAB. BLITAR, JAWA TIMUR",
      jalan: "Jalan Uji Kompetensi No. 1 BERU",
      jenis: "Sewaktu",
      asesmen: 10,
      penanggungjawab: "tes"
    },
    {
      nama: "TUK Listrik PLN I Jawa Bali",
      alamat: "Kebayoran Baru, JAKARTA SELATAN, DKI JAKARTA",
      jalan: "Jln. Bandeng 35 Pulo Mas",
      jenis: "Mandiri",
      asesmen: 1,
      penanggungjawab: "Achmad Hauf"
    },
    {
      nama: "TKJ INSTALASI JARINGAN KOMPUTER SMK",
      alamat: "Karang Ploso, KAB. MALANG, JAWA TIMUR",
      jalan: "Jalan Uji Kompetensi No. 1 Ngenep",
      jenis: "Sewaktu",
      asesmen: 7,
      penanggungjawab: "Dr. Dhega Febiharsa, S.ST., M.Pd."
    },
    {
      nama: "SMK NEGERI 1 SEMARANG",
      alamat: "Semarang Timur, KOTA SEMARANG, JAWA TENGAH",
      jalan: "Jl. Dr. Cipto No. 93 Semarang SARIREJO",
      jenis: "Mandiri",
      asesmen: 1,
      penanggungjawab: "KAWIT, M.T"
    },
    {
      nama: "TUK TKJ SMKN 1 PALOPO",
      alamat: "Wara Utara, KOTA PALOPO, SULAWESI SELATAN",
      jalan: "Jalan K.H.Muh. Kasim No. 10 Pattene",
      jenis: "Sewaktu",
      asesmen: 1,
      penanggungjawab: "KOMANG SUHARTA, S.Pd"
    }
  ];

  const filteredTUK = tukData.filter(item =>
    item.nama.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.alamat.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-orange-500/[0.03] rounded-full blur-[120px] -mr-48 -mt-48" />

      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-16">
          <motion.div 
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 text-orange-600 text-[10px] font-black uppercase tracking-[0.3em] mb-6 border border-orange-100"
          >
            <Navigation size={14} /> TUK Directory
          </motion.div>
          <h2 className="text-4xl md:text-5xl font-black text-[#071E3D] tracking-tight mb-6">
            Tempat Uji <span className="text-orange-500">Kompetensi</span>
          </h2>
          <p className="text-slate-500 font-medium text-lg max-w-2xl mx-auto leading-relaxed">
            Daftar lokasi resmi pelaksanaan Asesmen Uji Kompetensi yang telah terverifikasi oleh LSP.
          </p>
        </div>

        <div className="max-w-xl mx-auto mb-16 relative">
          <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400" size={20} />
          <input 
            type="text" 
            placeholder="Cari TUK atau Kota (Sorong, Blitar, Jakarta)..."
            className="w-full pl-16 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-[2rem] focus:outline-none focus:ring-4 focus:ring-orange-500/5 focus:border-orange-500 transition-all font-bold text-[#071E3D]"
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence>
            {filteredTUK.map((tuk, index) => (
              <motion.div
                key={index}
                layout
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className="bg-white border border-slate-100 rounded-[2.5rem] p-8 shadow-[0_15px_45px_-15px_rgba(7,30,61,0.05)] hover:shadow-[0_30px_60px_-20px_rgba(249,115,22,0.12)] transition-all duration-500 group"
              >
                <div className="flex justify-between items-start mb-8">
                  <div className={`px-4 py-1.5 rounded-full text-[9px] font-black uppercase tracking-widest ${
                    tuk.jenis === "Mandiri" ? "bg-emerald-50 text-emerald-600 border border-emerald-100" : "bg-orange-50 text-orange-600 border border-orange-100"
                  }`}>
                    TUK {tuk.jenis}
                  </div>
                  <div className="flex items-center gap-1.5 text-slate-400 text-[10px] font-bold">
                    <Briefcase size={12} /> {tuk.asesmen} Asesmen
                  </div>
                </div>

                <h3 className="text-lg font-black text-[#071E3D] mb-6 leading-tight group-hover:text-orange-600 transition-colors h-12 overflow-hidden">
                  {tuk.nama}
                </h3>

                <div className="space-y-4 mb-8">
                  <div className="flex gap-3 text-slate-500">
                    <MapPin className="shrink-0 text-orange-500" size={18} />
                    <div className="text-[11px] font-bold leading-relaxed">
                      <p className="text-[#071E3D]">{tuk.jalan}</p>
                      <p className="opacity-70">{tuk.alamat}</p>
                    </div>
                  </div>
                  
                  <div className="flex gap-3 text-slate-500 border-t border-slate-50 pt-4">
                    <User className="shrink-0 text-[#071E3D]" size={16} />
                    <div>
                      <p className="text-[9px] font-black uppercase tracking-widest text-slate-300">Penanggungjawab</p>
                      <p className="text-[11px] font-bold text-slate-700">{tuk.penanggungjawab}</p>
                    </div>
                  </div>
                </div>

                <button className="w-full py-4 rounded-2xl bg-slate-50 text-[#071E3D] text-[10px] font-black uppercase tracking-[0.2em] group-hover:bg-[#071E3D] group-hover:text-white transition-all">
                  Lihat Detail Lokasi
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        {filteredTUK.length === 0 && (
          <div className="text-center py-20 bg-slate-50 rounded-[3rem] border border-dashed border-slate-200">
            <Info size={48} className="mx-auto text-slate-300 mb-4" />
            <p className="text-slate-500 font-bold">Data TUK tidak ditemukan.</p>
          </div>
        )}
      </div>
    </section>
  );
}