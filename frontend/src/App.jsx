import { BrowserRouter as Router, Routes, Route, Navigate, Outlet } from "react-router-dom";

/* ================= PUBLIC PAGES ================= */
import Home from "./pages/public/Home";
import Login from "./pages/public/Login";
import About from "./pages/public/About";
import Complaint from "./pages/public/Complaint";
import FAQ from "./pages/public/FAQ";
import Information from "./pages/public/Information";
import Profile from "./pages/public/Profile";
import Registration from "./pages/public/Registration";
import Surveillance from "./pages/public/Surveillance";

/* ================= ADMIN PAGES ================= */
import AdminDashboard from "./pages/admin/AdminDashboard";
import DokumenMutu from "./pages/admin/DokumenMutu";
import IA01Observasi from "./pages/admin/IA01Observasi";
import IA03Pertanyaan from "./pages/admin/IA03Pertanyaan";
import JadwalUji from "./pages/admin/JadwalUji";
import Notifikasi from "./pages/admin/Notifikasi";
import Pengaduan from "./pages/admin/Pengaduan";
import ProfileAdmin from "./pages/admin/ProfileAdmin";
import Skema from "./pages/admin/Skema";
import Skkni from "./pages/admin/Skkni";
import TempatUji from "./pages/admin/TempatUji";
import UnitKompetensi from "./pages/admin/UnitKompetensi";
import VerifikasiPendaftaran from "./pages/admin/VerifikasiPendaftaran";
import Asesor from "./pages/admin/Asesor";
import Banding from "./pages/admin/Banding";

/* ================= ROLE GUARD ================= */
const getUser = () => {
  const user = localStorage.getItem("user");
  return user ? JSON.parse(user) : null;
};

const ProtectedRoute = ({ children, role }) => {
  const user = getUser();
  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role?.toLowerCase() !== role) return <Navigate to="/login" replace />;
  return children;
};

export default function App() {
  return (
    <Router>
      <Routes>
        {/* ================= PUBLIC ROUTES ================= */}
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/about" element={<About />} />
        <Route path="/complaint" element={<Complaint />} />
        <Route path="/faq" element={<FAQ />} />
        <Route path="/information" element={<Information />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/registration" element={<Registration />} />
        <Route path="/surveillance" element={<Surveillance />} />

        {/* ================= ADMIN ROUTES (NESTED) ================= */}
        {/* Perubahan Utama: 
            Semua route admin dibungkus dalam satu Route Parent.
            AdminDashboard menjadi Layout utama.
        */}
        <Route 
          path="/admin" 
          element={
            <ProtectedRoute role="admin">
              <AdminDashboard />
            </ProtectedRoute>
          }
        >
          {/* Index akan otomatis mengarah ke dashboard overview yang ada di AdminDashboard.jsx */}
          <Route path="dashboard" element={null} /> 

          {/* MENYAMAKAN PATH DENGAN SIDEBAR.JSX */}
          
          {/* Menu: Standar Kompetensi */}
          <Route path="unit-kompetensi" element={<UnitKompetensi />} />
          <Route path="skkni" element={<Skkni />} />
          <Route path="skema" element={<Skema />} />

          {/* Menu: Dokumen Mutu */}
          <Route path="dokumen-mutu" element={<DokumenMutu />} />

          {/* Menu: Event & Jadwal */}
          {/* Sidebar mengarah ke /admin/jadwal/uji-kompetensi */}
          <Route path="jadwal/uji-kompetensi" element={<JadwalUji />} /> 
          
          {/* Menu: Tempat Uji */}
          <Route path="tuk" element={<TempatUji />} />

          {/* Menu: Data Asesi */}
          {/* Sidebar mengarah ke /admin/verifikasi-pendaftaran */}
          <Route path="verifikasi-pendaftaran" element={<VerifikasiPendaftaran />} />
          
          {/* Sidebar mengarah ke submenu IA01 & IA03 */}
          <Route path="asesi/ia01-observasi" element={<IA01Observasi />} />
          <Route path="asesi/ia03-pertanyaan" element={<IA03Pertanyaan />} />

          {/* Menu: Data Asesor */}
          <Route path="asesor" element={<Asesor />} />

          {/* Menu: Sistem & Web */}
          <Route path="notifikasi" element={<Notifikasi />} />

          {/* Menu: Layanan */}
          <Route path="pengaduan" element={<Pengaduan />} />
          <Route path="profil-lsp" element={<ProfileAdmin />} /> {/* Sidebar arahnya ke /admin/profil-lsp */}
          
          {/* Route Tambahan untuk path yang mungkin belum dibuat file-nya tapi ada di sidebar 
              (Agar tidak blank page, Anda bisa buat komponen Placeholder sementara)
          */}
           <Route path="banding" element={<Banding />} />
           <Route path="laporan/*" element={<div>Halaman Laporan (Belum dibuat)</div>} />
           <Route path="keuangan" element={<div>Halaman Keuangan (Belum dibuat)</div>} />
           
        </Route>

      </Routes>
    </Router>
  );
}