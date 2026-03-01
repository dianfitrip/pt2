import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import Sidebar from './Sidebar';
import AdminNavbar from './AdminNavbar'; // Import komponen navbar yang baru dibuat
import './adminstyles/AdminDashboard.css';
import {
  FaLayerGroup,
  FaUserTie,
  FaUsers,
  FaBuilding,
  FaEllipsisV,
  FaCalendarAlt
} from "react-icons/fa";

// --- KOMPONEN: DASHBOARD OVERVIEW (RESUME & STATISTIK) ---
const DashboardOverview = () => {
  const currentYear = new Date().getFullYear();

  const stats = [
    { label: "Total Skema", value: "12", icon: <FaLayerGroup />, color: "orange" },
    { label: "Total Asesor", value: "45", icon: <FaUserTie />, color: "blue" },
    { label: "Total Asesi", value: "1,250", icon: <FaUsers />, color: "green" },
    { label: "Data TUK", value: "8", icon: <FaBuilding />, color: "purple" },
  ];

  const recentRegistrations = [
    { name: "Budi Santoso", schema: "Pemrograman Web", date: "16 Feb 2026", status: "Menunggu" },
    { name: "Siti Aminah", schema: "Desain Grafis", date: "16 Feb 2026", status: "Verifikasi" },
    { name: "Andi Saputra", schema: "Jaringan Komputer", date: "15 Feb 2026", status: "Diterima" },
    { name: "Dewi Lestari", schema: "Digital Marketing", date: "15 Feb 2026", status: "Ditolak" },
    { name: "Rizky Pratama", schema: "Pemrograman Web", date: "14 Feb 2026", status: "Diterima" },
  ];

  return (
    <div className="dashboard-container">
      {/* 1. STATS CARDS */}
      <div className="stats-grid">
        {stats.map((item, index) => (
          <div className="stat-card" key={index}>
            <div className={`stat-icon bg-${item.color}`}>
              {item.icon}
            </div>
            <div className="stat-info">
              <h3>{item.value}</h3>
              <p>{item.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* 2. CHARTS */}
      <div className="charts-grid">
        <div className="card-box">
          <div className="card-header-inner">
            <h4>Pendaftar dan Kandidat Tahun {currentYear}</h4>
            <button className="btn-icon-small"><FaEllipsisV /></button>
          </div>
          <div className="bar-chart-list">
            <div className="bar-item">
              <span>Web Dev</span>
              <div className="progress-track"><div className="progress-fill" style={{width: '85%'}}></div></div>
              <span className="val">850</span>
            </div>
            {/* ... bagian baris chart lainnya tetap sama ... */}
            <div className="bar-item">
              <span>Jaringan</span>
              <div className="progress-track"><div className="progress-fill" style={{width: '60%'}}></div></div>
              <span className="val">600</span>
            </div>
            <div className="bar-item">
              <span>Desain</span>
              <div className="progress-track"><div className="progress-fill" style={{width: '45%'}}></div></div>
              <span className="val">450</span>
            </div>
            <div className="bar-item">
              <span>Admin</span>
              <div className="progress-track"><div className="progress-fill" style={{width: '75%'}}></div></div>
              <span className="val">750</span>
            </div>
          </div>
        </div>

        <div className="card-box">
          <div className="card-header-inner">
            <h4>Persentase Kelulusan</h4>
            <button className="btn-icon-small"><FaEllipsisV /></button>
          </div>
          <div className="pie-chart-container">
            <div className="pie-chart" style={{ background: `conic-gradient(#FF8A00 0% 70%, #F3F4F6 70% 100%)` }}>
              <div className="pie-center">
                <span>70%</span>
                <small>Kompeten</small>
              </div>
            </div>
            <div className="chart-legend">
              <div className="legend-item"><span className="dot orange"></span> Kompeten</div>
              <div className="legend-item"><span className="dot gray"></span> Belum Kompeten</div>
            </div>
          </div>
        </div>
      </div>

      {/* 3. TABLE & SCHEDULE */}
      <div className="bottom-grid">
        {/* ... bagian tabel dan schedule tetap sama persis ... */}
        <div className="card-box table-section">
          <div className="card-header-inner">
            <h4>Pendaftaran Terbaru</h4>
            <a href="#" className="link-text">Lihat Semua</a>
          </div>
          <table className="dashboard-table">
            <thead>
              <tr>
                <th>Nama Asesi</th>
                <th>Skema</th>
                <th>Tanggal</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody>
              {recentRegistrations.map((row, idx) => (
                <tr key={idx}>
                  <td className="fw-bold">{row.name}</td>
                  <td>{row.schema}</td>
                  <td>{row.date}</td>
                  <td>
                    <span className={`badge ${row.status.toLowerCase()}`}>{row.status}</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="card-box schedule-section">
          <div className="card-header-inner">
            <h4>Jadwal Asesmen</h4>
            <FaCalendarAlt className="text-muted" />
          </div>
          <div className="schedule-list">
            <div className="schedule-item">
              <div className="date-box">
                <span className="d">18</span><span className="m">FEB</span>
              </div>
              <div className="info">
                <h5>Uji Kompetensi Web</h5>
                <p>08:00 WIB • Lab 1</p>
              </div>
            </div>
            <div className="schedule-item">
              <div className="date-box">
                <span className="d">20</span><span className="m">FEB</span>
              </div>
              <div className="info">
                <h5>Uji Komp. Jaringan</h5>
                <p>09:00 WIB • Lab 2</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

// --- KOMPONEN UTAMA: ADMIN DASHBOARD (LAYOUT) ---
const AdminDashboard = () => {
  const location = useLocation();

  // Cek apakah user sedang di halaman Dashboard Home
  const isDashboardHome = location.pathname === '/admin/dashboard' || location.pathname === '/admin';

  return (
    <div className="admin-layout">
      {/* SIDEBAR NAVIGATION */}
      <Sidebar />
      
      <main className="main-content">
        
        {/* PANGGIL ADMIN NAVBAR YANG BARU */}
        <AdminNavbar />

        {/* DYNAMIC CONTENT AREA */}
        <div className="content-area">
           {/* Jika URL Dashboard -> Tampilkan Statistik. Jika Bukan -> Tampilkan Outlet (Halaman Lain) */}
           {isDashboardHome ? <DashboardOverview /> : <Outlet />}
        </div>
      </main>
    </div>
  );
};

export default AdminDashboard;