import NavItem from "./NavItem";
import LoginDropdown from "./LoginDropdown";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-slate-100">
      <div className="max-w-7xl mx-auto px-6 h-20 flex justify-between items-center">

        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-[#071E3D]
                          flex items-center justify-center
                          text-white font-black text-lg shadow-lg
                          group-hover:bg-orange-500 transition-all duration-500">
            L
          </div>
          <div className="leading-tight">
            <span className="block text-lg font-black text-[#071E3D]">
              SIMLSP
            </span>
            <span className="block text-[10px] font-bold text-orange-500 uppercase tracking-widest">
              Sertifikasi Profesi
            </span>
          </div>
        </div>

        <nav className="hidden lg:flex items-center gap-8">
          <NavItem label="Beranda" href="/" />
          <NavItem label="Profil Kami" href="/profil-kami" />
          <NavItem label="Tentang Aplikasi" href="/tentang-aplikasi" />
          <NavItem label="Pendaftaran" href="/pendaftaran" />
          <NavItem label="Informasi" href="/informasi" />
          <NavItem label="FAQ" href="/faq" />
          <NavItem label="Pengaduan" href="/pengaduan" />
        </nav>

        <div className="flex items-center gap-4">
          <button
            className="hidden md:inline-flex items-center px-6 py-2.5
                       rounded-xl border-2 border-[#071E3D]
                       text-[#071E3D] font-black text-xs uppercase tracking-widest
                       hover:bg-[#071E3D] hover:text-white
                       transition-all duration-300"
          >
            Hubungi Kami
          </button>

          <LoginDropdown />
        </div>

      </div>
    </header>
  );
}