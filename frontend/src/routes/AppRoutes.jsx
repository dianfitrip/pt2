import { Routes, Route } from "react-router-dom";

import Home from "../pages/public/Home";
import Profile from "../pages/public/Profile";
import About from "../pages/public/About";
import Registration from "../pages/public/Registration";
import Surveillance from "../pages/public/Surveillance";
import Information from "../pages/public/Information";
import FAQ from "../pages/public/FAQ";
import Complaint from "../pages/public/Complaint";
import Login from "../pages/public/Login";

import DashboardAdmin from "../pages/admin/Dashboard";

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/profil-kami" element={<Profile />} />
      <Route path="/tentang-aplikasi" element={<About />} />
      <Route path="/pendaftaran" element={<Registration />} />
      <Route path="/surveillance" element={<Surveillance />} />
      <Route path="/informasi" element={<Information />} />
      <Route path="/faq" element={<FAQ />} />
      <Route path="/pengaduan" element={<Complaint />} />
      <Route path="/admin/dashboard" element={<DashboardAdmin />} />
      <Route path="/login" element={<Login />} />
    </Routes>
  );
}