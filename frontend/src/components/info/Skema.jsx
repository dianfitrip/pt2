import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Award, CheckCircle2, LayoutGrid, Search } from "lucide-react";
import { getSkema } from "../../services/skema.service";


export default function Skema() {
  const [schemes, setSchemes] = useState([]);
  const [search, setSearch] = useState("");

  useEffect(() => {
    getSkema()
      .then((data) => setSchemes(data))
      .catch((err) => console.error("Gagal ambil skema:", err));
  }, []);

  const filteredSchemes = schemes.filter((item) =>
    item.judul_skema.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between mb-10 gap-6">
        <div>
          <h3 className="text-2xl font-black text-gray-900 flex items-center gap-3">
            <LayoutGrid className="text-orange-500" size={24} />
            Skema Sertifikasi <span className="text-orange-500 italic">WHOP</span>
          </h3>
          <p className="text-gray-500 text-sm mt-2 font-medium">
            Kami menyediakan{" "}
            <span className="text-gray-900 font-bold">
              {schemes.length} Skema Kompetensi
            </span>{" "}
            yang diakui secara nasional.
          </p>
        </div>

        <div className="relative group">
          <Search
            className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400
                       group-focus-within:text-orange-500 transition-colors"
            size={16}
          />
          <input
            type="text"
            placeholder="Cari skema kompetensi..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-12 pr-6 py-3 bg-gray-50 border border-gray-100 rounded-2xl
                       text-xs font-bold focus:outline-none focus:ring-4
                       focus:ring-orange-500/10 focus:border-orange-500
                       transition-all w-full md:w-[280px]"
          />
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
        {filteredSchemes.map((scheme, index) => (
          <motion.div
            key={scheme.id_skema}
            initial={{ opacity: 0, x: -10 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.02 }}
            whileHover={{ x: 10, backgroundColor: "#fff7ed" }}
            className="flex items-center gap-4 p-5 bg-white border border-gray-100
                       rounded-[1.5rem] hover:border-orange-200
                       transition-all duration-300 cursor-default
                       group shadow-sm hover:shadow-md"
          >
            <div className="flex-shrink-0 w-10 h-10 rounded-xl bg-gray-50
                            flex items-center justify-center text-gray-400
                            group-hover:bg-orange-500 group-hover:text-white
                            transition-all duration-500">
              <Award size={18} />
            </div>

            <div className="flex-grow">
              <span className="text-sm font-bold text-gray-700 group-hover:text-gray-900">
                {scheme.judul_skema}
              </span>
              <div className="flex items-center gap-2 mt-1">
                <CheckCircle2 size={12} className="text-emerald-500" />
                <span className="text-[9px] font-black uppercase tracking-widest
                                 text-gray-300 group-hover:text-orange-400">
                  {scheme.status === "aktif" ? "Tersedia" : "Tidak Aktif"}
                </span>
              </div>
            </div>

            <div className="opacity-0 group-hover:opacity-100 transition-opacity">
              <div className="px-3 py-1 bg-orange-100 text-orange-600 rounded-full
                              text-[9px] font-black uppercase">
                Pilih
              </div>
            </div>
          </motion.div>
        ))}
      </div>

      <style jsx>{`
        .custom-scrollbar::-webkit-scrollbar {
          width: 5px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: #fdba74;
          border-radius: 10px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: #f97316;
        }
      `}</style>
    </div>
  );
}
