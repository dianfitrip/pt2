import React from "react";
import { motion } from "framer-motion";
import {
  Mail,
  Phone,
  MapPin,
  Instagram,
  Facebook,
  Twitter,
  Linkedin,
  ArrowRight,
} from "lucide-react";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  const footerLinks = {
    menu: ["Beranda", "Profil Kami", "Tentang Aplikasi", "Pendaftaran", "FAQ"],
    informasi: [
      "Jadwal Uji Kompetensi",
      "Skema Sertifikasi",
      "Tempat Uji Kompetensi",
      "Pengaduan",
    ],
  };

  return (
    <footer className="relative bg-dark text-gray-400 pt-20 overflow-hidden">
      <div className="absolute bottom-0 right-0 w-[400px] h-[400px] bg-primary/10 rounded-full blur-[120px] translate-x-1/2 translate-y-1/2 pointer-events-none" />

      <div className="max-w-7xl mx-auto px-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          <div className="space-y-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-primary rounded-xl flex items-center justify-center">
                <span className="text-white font-black text-xl italic">S</span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                SIM<span className="text-primary">LSP</span>
              </h3>
            </div>

            <p className="text-sm leading-relaxed font-medium">
              Platform digital terpadu untuk mendukung pelaksanaan sertifikasi
              kompetensi nasional secara profesional, transparan, dan akuntabel.
            </p>
            <div className="flex gap-4 pt-2">
              {[Instagram, Linkedin, Twitter, Facebook].map((Icon, idx) => (
                <motion.a
                  key={idx}
                  href="#"
                  whileHover={{ y: -4 }}
                  className="w-10 h-10 rounded-xl bg-white/5 border border-white/10
                             flex items-center justify-center
                             text-gray-400 hover:text-primary hover:border-primary
                             transition-all"
                >
                  <Icon size={18} />
                </motion.a>
              ))}
            </div>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
              Navigation
            </h4>
            <ul className="space-y-4">
              {footerLinks.menu.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                >
                  <ArrowRight
                    size={14}
                    className="text-primary opacity-0 -ml-4
                               group-hover:opacity-100 group-hover:ml-0 transition-all"
                  />
                  <span className="text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
              Resources
            </h4>
            <ul className="space-y-4">
              {footerLinks.informasi.map((item, idx) => (
                <li
                  key={idx}
                  className="group flex items-center gap-2 cursor-pointer hover:text-white transition-colors"
                >
                  <ArrowRight
                    size={14}
                    className="text-primary opacity-0 -ml-4
                               group-hover:opacity-100 group-hover:ml-0 transition-all"
                  />
                  <span className="text-sm font-semibold">{item}</span>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="text-white font-bold mb-8 uppercase tracking-widest text-xs">
              Get In Touch
            </h4>
            <ul className="space-y-5">
              <li className="flex items-start gap-4 group">
                <div className="mt-1 p-2 rounded-lg bg-white/5 text-primary
                                group-hover:bg-primary group-hover:text-white transition-all">
                  <MapPin size={16} />
                </div>
                <div className="text-sm font-medium leading-relaxed
                                group-hover:text-white transition-colors">
                  Yogyakarta, Special Region <br /> of Yogyakarta, Indonesia
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 text-primary
                                group-hover:bg-primary group-hover:text-white transition-all">
                  <Mail size={16} />
                </div>
                <div className="text-sm font-medium group-hover:text-white transition-colors">
                  support@simlsp.id
                </div>
              </li>

              <li className="flex items-center gap-4 group">
                <div className="p-2 rounded-lg bg-white/5 text-primary
                                group-hover:bg-primary group-hover:text-white transition-all">
                  <Phone size={16} />
                </div>
                <div className="text-sm font-bold group-hover:text-white transition-colors">
                  +62 812-3456-7890
                </div>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/10 py-10
                        flex flex-col md:flex-row
                        justify-between items-center gap-6">
          <div className="text-xs font-bold tracking-widest uppercase opacity-50">
            © {currentYear} SIM<span className="text-primary">LSP</span> —
            Certified Profession Platform
          </div>

          <div className="flex gap-8 text-xs font-bold uppercase tracking-widest">
            <a href="#" className="hover:text-primary transition-colors">
              Privacy Policy
            </a>
            <a href="#" className="hover:text-primary transition-colors">
              Terms of Service
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}
