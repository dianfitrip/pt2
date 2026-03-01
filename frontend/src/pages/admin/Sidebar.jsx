import React, { useState, useEffect, useRef } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./adminstyles/Sidebar.css";
import {
  FaHome, FaBullhorn, FaGavel, FaChartBar, FaUniversity, FaBook, FaAward, 
  FaLayerGroup, FaMoneyBillWave, FaCalendarAlt, FaBuilding, FaUserGraduate, 
  FaUserTie, FaUsersCog, FaCommentDots, FaGlobe, FaCogs, FaCalculator, 
  FaCreditCard, FaEnvelopeOpenText, FaEye, FaLock, FaSignOutAlt, 
  FaChevronDown, FaChevronRight
} from "react-icons/fa";

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const sidebarContentRef = useRef(null); 

  // State untuk Dropdown Menu
  const [openMenus, setOpenMenus] = useState({
    laporan: false,
    standar: false,
    biaya: false,
    event: false,
    tuk: false, // <-- Menambahkan state dropdown untuk TUK
    asesi: false,
    asesor: false,
    manajemen: false,
    pembayaran: false,
    persuratan: false
  });

  // 1. AUTO-OPEN MENU INDUK JIKA ANAKNYA SEDANG AKTIF
  useEffect(() => {
    const path = location.pathname;
    setOpenMenus((prev) => ({
      ...prev,
      laporan: prev.laporan || path.includes('/admin/laporan'),
      standar: prev.standar || path.includes('/admin/unit-kompetensi') || path.includes('/admin/skkni'),
      biaya: prev.biaya || path.includes('/admin/biaya'),
      event: prev.event || path.includes('/admin/jadwal'),
      tuk: prev.tuk || path.includes('/admin/tuk'), // <-- Auto-open untuk dropdown TUK
      asesi: prev.asesi || path.includes('/admin/asesi') || path.includes('/admin/verifikasi-pendaftaran'),
      asesor: prev.asesor || path.includes('/admin/asesor'),
      manajemen: prev.manajemen || path.includes('/admin/manajemen'),
      pembayaran: prev.pembayaran || path.includes('/admin/pembayaran'),
      persuratan: prev.persuratan || path.includes('/admin/surat')
    }));
  }, [location.pathname]);

  // 2. KEMBALIKAN POSISI SCROLL SIDEBAR SETIAP RENDER
  useEffect(() => {
    const savedScrollPos = sessionStorage.getItem("sidebarScrollPosition");
    if (sidebarContentRef.current && savedScrollPos) {
      sidebarContentRef.current.scrollTop = parseInt(savedScrollPos, 10);
    }
  }, []);

  // 3. SIMPAN POSISI SCROLL SETIAP KALI USER MENGGESER SIDEBAR
  const handleScroll = (e) => {
    sessionStorage.setItem("sidebarScrollPosition", e.target.scrollTop);
  };

  const toggleMenu = (key) => {
    setOpenMenus((prev) => ({ ...prev, [key]: !prev[key] }));
  };

  const isActive = (path) => location.pathname.includes(path);

  const handleNav = (path) => {
    navigate(path);
  };

  // FUNGSI KHUSUS UNTUK LOGOUT + KONFIRMASI
  const handleLogout = () => {
    const isConfirm = window.confirm("Yakin mau keluar dari sistem?");
    if (isConfirm) {
      // Hapus token/data user dari local storage jika ada
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // Arahkan ke halaman login
      navigate('/login');
    }
  };

  return (
    <div className="sidebar">
      {/* CSS KHUSUS SIDEBAR ORANYE */}
      <style>{`
        /* Mengubah semua teks menu dan ikon menjadi warna hitam/gelap */
        .nav-item, .submenu-item, .nav-section-label, .nav-label, .nav-icon, .arrow-icon {
          color: #1e293b !important; 
        }
        
        /* Teks logo SILSP juga dihitamkan */
        .logo-text h1, .logo-text p, .logo-icon {
          color: #1e293b !important;
        }

        /* HIGHLIGHT MENU AKTIF: Kotak Putih, Teks Hitam (TIDAK BOLD) */
        .nav-item.active, .submenu-item.active {
          font-weight: 500 !important;
          background-color: #ffffff !important; 
          color: #000000 !important; 
          border-radius: 6px;
          box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1); 
        }
        
        /* Pastikan Ikon dan Teks di dalam menu aktif tetap hitam pekat */
        .nav-item.active .nav-icon, .nav-item.active .nav-label {
          color: #000000 !important; 
        }

        /* Titik submenu saat aktif jadi hitam */
        .submenu-item.active .dot {
          background-color: #000000 !important;
          box-shadow: none !important;
        }
        
        /* Hover Effect untuk menu biasa */
        .nav-item:hover, .submenu-item:hover {
          background-color: rgba(255, 255, 255, 0.3) !important; 
        }

        /* ================================================== */
        /* CSS KHUSUS TOMBOL LOGOUT                           */
        /* ================================================== */
        .sidebar-footer .logout {
          color: #1e293b !important; /* Teks default warna hitam */
          transition: all 0.2s ease-in-out;
        }
        .sidebar-footer .logout .nav-icon {
          color: #000000 !important; /* Ikon default warna hitam pekat */
        }
        
        /* Saat kursor diarahkan ke tombol Logout, berubah jadi merah peringatan */
        .sidebar-footer .logout:hover {
          background-color: #fee2e2 !important; /* Background merah muda pastel */
          color: #b91c1c !important; /* Teks Merah menyala tebal */
          font-weight: bold !important;
          border-radius: 6px;
        }
        .sidebar-footer .logout:hover .nav-icon {
          color: #b91c1c !important; /* Ikon berubah Merah menyala */
        }
      `}</style>

      {/* HEADER */}
      <div className="sidebar-header">
        <div className="logo-box">
          <FaUniversity className="logo-icon" />
        </div>
        <div className="logo-text">
          <h1>S.I.LSP</h1>
          <p>Sistem Informasi LSP</p>
        </div>
      </div>

      {/* CONTENT */}
      <div className="sidebar-content" ref={sidebarContentRef} onScroll={handleScroll}>
        
        {/* UTAMA */}
        <div className="nav-section-label">Utama</div>
        
        <button className={`nav-item ${isActive('/admin/dashboard') ? 'active' : ''}`} onClick={() => handleNav('/admin/dashboard')}>
          <div className="nav-icon"><FaHome /></div>
          <span className="nav-label">Home / Dashboard</span>
        </button>

        <button className={`nav-item ${isActive('/admin/pengaduan') ? 'active' : ''}`} onClick={() => handleNav('/admin/pengaduan')}>
          <div className="nav-icon"><FaBullhorn /></div>
          <span className="nav-label">Layanan Pengaduan</span>
        </button>

        <button className={`nav-item ${isActive('/admin/banding') ? 'active' : ''}`} onClick={() => handleNav('/admin/banding')}>
          <div className="nav-icon"><FaGavel /></div>
          <span className="nav-label">Layanan Banding</span>
        </button>

        {/* REPORTING (DROPDOWN) */}
        <div className="nav-section-label">Reporting</div>
        <button className={`nav-item has-submenu ${openMenus.laporan ? 'open' : ''} ${isActive('/admin/laporan') ? 'active' : ''}`} onClick={() => toggleMenu('laporan')}>
          <div className="nav-icon"><FaChartBar /></div>
          <span className="nav-label">Laporan Sertifikasi</span>
          <span className="arrow-icon">{openMenus.laporan ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.laporan && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/laporan/umum') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/umum')}><span className="dot"></span> Laporan Umum</button>
            <button className={`submenu-item ${isActive('/admin/laporan/bulanan') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/bulanan')}><span className="dot"></span> Laporan Bulanan</button>
            <button className={`submenu-item ${isActive('/admin/laporan/tahunan') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/tahunan')}><span className="dot"></span> Laporan Tahunan</button>
            <button className={`submenu-item ${isActive('/admin/laporan/kinerja-asesor') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/kinerja-asesor')}><span className="dot"></span> Kinerja Asesor</button>
            <button className={`submenu-item ${isActive('/admin/laporan/kinerja-tuk') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/kinerja-tuk')}><span className="dot"></span> Kinerja TUK</button>
            <button className={`submenu-item ${isActive('/admin/laporan/feedback') ? 'active' : ''}`} onClick={() => handleNav('/admin/laporan/feedback')}><span className="dot"></span> Umpan Balik</button>
          </div>
        )}

        {/* MASTER DATA */}
        <div className="nav-section-label">Master Data</div>
        <button className={`nav-item ${isActive('/admin/profil-lsp') ? 'active' : ''}`} onClick={() => handleNav('/admin/profil-lsp')}>
          <div className="nav-icon"><FaUniversity /></div>
          <span className="nav-label">Profil LSP</span>
        </button>

        <button className={`nav-item ${isActive('/admin/dokumen-mutu') ? 'active' : ''}`} onClick={() => handleNav('/admin/dokumen-mutu')}>
          <div className="nav-icon"><FaBook /></div>
          <span className="nav-label">Dokumen Mutu</span>
        </button>

        <button className={`nav-item has-submenu ${openMenus.standar ? 'open' : ''} ${(isActive('/admin/unit-kompetensi') || isActive('/admin/skkni')) ? 'active' : ''}`} onClick={() => toggleMenu('standar')}>
          <div className="nav-icon"><FaAward /></div>
          <span className="nav-label">Standar Kompetensi</span>
          <span className="arrow-icon">{openMenus.standar ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.standar && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/unit-kompetensi') ? 'active' : ''}`} onClick={() => handleNav('/admin/unit-kompetensi')}><span className="dot"></span> Unit Kompetensi</button>
            <button className={`submenu-item ${isActive('/admin/skkni') ? 'active' : ''}`} onClick={() => handleNav('/admin/skkni')}><span className="dot"></span> Data SKKNI</button>
          </div>
        )}

        <button className={`nav-item ${isActive('/admin/skema') ? 'active' : ''}`} onClick={() => handleNav('/admin/skema')}>
          <div className="nav-icon"><FaLayerGroup /></div>
          <span className="nav-label">Skema Sertifikasi</span>
        </button>

        <button className={`nav-item has-submenu ${openMenus.biaya ? 'open' : ''} ${isActive('/admin/biaya') ? 'active' : ''}`} onClick={() => toggleMenu('biaya')}>
          <div className="nav-icon"><FaMoneyBillWave /></div>
          <span className="nav-label">Biaya & Rekening</span>
          <span className="arrow-icon">{openMenus.biaya ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.biaya && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/biaya/rekening') ? 'active' : ''}`} onClick={() => handleNav('/admin/biaya/rekening')}><span className="dot"></span> Rekening Bank</button>
            <button className={`submenu-item ${isActive('/admin/biaya/komponen') ? 'active' : ''}`} onClick={() => handleNav('/admin/biaya/komponen')}><span className="dot"></span> Komponen Biaya</button>
          </div>
        )}

        {/* OPERASIONAL */}
        <div className="nav-section-label">Operasional</div>
        
        <button className={`nav-item has-submenu ${openMenus.event ? 'open' : ''} ${isActive('/admin/jadwal') ? 'active' : ''}`} onClick={() => toggleMenu('event')}>
          <div className="nav-icon"><FaCalendarAlt /></div>
          <span className="nav-label">Event & Jadwal</span>
          <span className="arrow-icon">{openMenus.event ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.event && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/jadwal/cari') ? 'active' : ''}`} onClick={() => handleNav('/admin/jadwal/cari')}>
              <span className="dot"></span> Cari Jadwal
            </button>
            <button className={`submenu-item ${isActive('/admin/jadwal/uji-kompetensi') ? 'active' : ''}`} onClick={() => handleNav('/admin/jadwal/uji-kompetensi')}>
              <span className="dot"></span> Jadwal Uji Kompetensi
            </button>
            <button className={`submenu-item ${isActive('/admin/jadwal/event-uji') ? 'active' : ''}`} onClick={() => handleNav('/admin/jadwal/event-uji')}>
              <span className="dot"></span> Event Uji Kompetensi
            </button>
            <button className={`submenu-item ${isActive('/admin/jadwal/arsip') ? 'active' : ''}`} onClick={() => handleNav('/admin/jadwal/arsip')}>
              <span className="dot"></span> Arsip Jadwal
            </button>
          </div>
        )}

        {/* --- PERUBAHAN TUK MENJADI DROPDOWN --- */}
        <button className={`nav-item has-submenu ${openMenus.tuk ? 'open' : ''} ${isActive('/admin/tuk') ? 'active' : ''}`} onClick={() => toggleMenu('tuk')}>
          <div className="nav-icon"><FaBuilding /></div>
          <span className="nav-label">Tempat Uji (TUK)</span>
          <span className="arrow-icon">{openMenus.tuk ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.tuk && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/tuk') && !isActive('/admin/tuk/persyaratan') ? 'active' : ''}`} onClick={() => handleNav('/admin/tuk')}>
              <span className="dot"></span> Daftar TUK
            </button>
            <button className={`submenu-item ${isActive('/admin/tuk/persyaratan') ? 'active' : ''}`} onClick={() => handleNav('/admin/tuk/persyaratan')}>
              <span className="dot"></span> Persyaratan TUK
            </button>
          </div>
        )}
        {/* --- AKHIR PERUBAHAN TUK --- */}

        <button className={`nav-item has-submenu ${openMenus.asesi ? 'open' : ''} ${(isActive('/admin/asesi') || isActive('/admin/verifikasi-pendaftaran')) ? 'active' : ''}`} onClick={() => toggleMenu('asesi')}>
          <div className="nav-icon"><FaUserGraduate /></div>
          <span className="nav-label">Data Asesi</span>
          <span className="arrow-icon">{openMenus.asesi ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.asesi && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/asesi/cari') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/cari')}><span className="dot"></span> Pencarian Asesi</button>
            <button className={`submenu-item ${isActive('/admin/verifikasi-pendaftaran') ? 'active' : ''}`} onClick={() => handleNav('/admin/verifikasi-pendaftaran')}><span className="dot"></span> Pendaftar Baru</button>
            <button className={`submenu-item ${isActive('/admin/asesi/ia01-observasi') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/ia01-observasi')}><span className="dot"></span> IA.01 Observasi</button>
            <button className={`submenu-item ${isActive('/admin/asesi/ia03-pertanyaan') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/ia03-pertanyaan')}><span className="dot"></span> IA.03 Pertanyaan</button>
            <button className={`submenu-item ${isActive('/admin/asesi/terjadwal') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/terjadwal')}><span className="dot"></span> Terjadwal</button>
            <button className={`submenu-item ${isActive('/admin/asesi/kompeten') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/kompeten')}><span className="dot"></span> Kompeten</button>
            <button className={`submenu-item ${isActive('/admin/asesi/belum-sertifikat') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/belum-sertifikat')}><span className="dot"></span> Belum Sertifikat</button>
            <button className={`submenu-item ${isActive('/admin/asesi/arsip') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/arsip')}><span className="dot"></span> Arsip</button>
            <button className={`submenu-item ${isActive('/admin/asesi/blokir') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesi/blokir')}><span className="dot"></span> Diblokir</button>
          </div>
        )}

        <button className={`nav-item has-submenu ${openMenus.asesor ? 'open' : ''} ${isActive('/admin/asesor') ? 'active' : ''}`} onClick={() => toggleMenu('asesor')}>
          <div className="nav-icon"><FaUserTie /></div>
          <span className="nav-label">Data Asesor</span>
          <span className="arrow-icon">{openMenus.asesor ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.asesor && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/asesor') && !isActive('/admin/asesor/statistik') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesor')}>
              <span className="dot"></span> Daftar Asesor
            </button>
            <button className={`submenu-item ${isActive('/admin/asesor/statistik') ? 'active' : ''}`} onClick={() => handleNav('/admin/asesor/statistik')}>
              <span className="dot"></span> Statistik Wilayah
            </button>
          </div>
        )}

        <button className={`nav-item ${isActive('/admin/komite') ? 'active' : ''}`} onClick={() => handleNav('/admin/komite')}>
          <div className="nav-icon"><FaUsersCog /></div>
          <span className="nav-label">Komite Teknis</span>
        </button>

        {/* SISTEM & WEB */}
        <div className="nav-section-label">Sistem & Web</div>
        
        <button className={`nav-item ${isActive('/admin/notifikasi') ? 'active' : ''}`} onClick={() => handleNav('/admin/notifikasi')}>
          <div className="nav-icon"><FaCommentDots /></div>
          <span className="nav-label">Notifikasi</span>
        </button>

        <button className={`nav-item ${isActive('/admin/website') ? 'active' : ''}`} onClick={() => handleNav('/admin/website')}>
          <div className="nav-icon"><FaGlobe /></div>
          <span className="nav-label">Konten Website</span>
        </button>

        <button className={`nav-item has-submenu ${openMenus.manajemen ? 'open' : ''} ${isActive('/admin/manajemen') ? 'active' : ''}`} onClick={() => toggleMenu('manajemen')}>
          <div className="nav-icon"><FaCogs /></div>
          <span className="nav-label">Manajemen Sistem</span>
          <span className="arrow-icon">{openMenus.manajemen ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.manajemen && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/manajemen/users') ? 'active' : ''}`} onClick={() => handleNav('/admin/manajemen/users')}><span className="dot"></span> Users</button>
            <button className={`submenu-item ${isActive('/admin/manajemen/pengusul') ? 'active' : ''}`} onClick={() => handleNav('/admin/manajemen/pengusul')}><span className="dot"></span> Pengusul</button>
            <button className={`submenu-item ${isActive('/admin/manajemen/wa') ? 'active' : ''}`} onClick={() => handleNav('/admin/manajemen/wa')}><span className="dot"></span> WhatsApp API</button>
            <button className={`submenu-item ${isActive('/admin/manajemen/bnsp') ? 'active' : ''}`} onClick={() => handleNav('/admin/manajemen/bnsp')}><span className="dot"></span> Integrasi BNSP</button>
          </div>
        )}

        {/* KEUANGAN & ADMIN */}
        <div className="nav-section-label">Keuangan & Admin</div>

        <button className={`nav-item ${isActive('/admin/keuangan') ? 'active' : ''}`} onClick={() => handleNav('/admin/keuangan')}>
          <div className="nav-icon"><FaCalculator /></div>
          <span className="nav-label">Keuangan</span>
        </button>

        <button className={`nav-item has-submenu ${openMenus.pembayaran ? 'open' : ''} ${isActive('/admin/pembayaran') ? 'active' : ''}`} onClick={() => toggleMenu('pembayaran')}>
          <div className="nav-icon"><FaCreditCard /></div>
          <span className="nav-label">Pembayaran</span>
          <span className="arrow-icon">{openMenus.pembayaran ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.pembayaran && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/pembayaran/cari') ? 'active' : ''}`} onClick={() => handleNav('/admin/pembayaran/cari')}><span className="dot"></span> Cari Pembayaran</button>
            <button className={`submenu-item ${isActive('/admin/pembayaran/validasi') ? 'active' : ''}`} onClick={() => handleNav('/admin/pembayaran/validasi')}><span className="dot"></span> Validasi</button>
            <button className={`submenu-item ${isActive('/admin/pembayaran/lunas') ? 'active' : ''}`} onClick={() => handleNav('/admin/pembayaran/lunas')}><span className="dot"></span> Tervalidasi</button>
          </div>
        )}

        <button className={`nav-item has-submenu ${openMenus.persuratan ? 'open' : ''} ${isActive('/admin/surat') ? 'active' : ''}`} onClick={() => toggleMenu('persuratan')}>
          <div className="nav-icon"><FaEnvelopeOpenText /></div>
          <span className="nav-label">Persuratan</span>
          <span className="arrow-icon">{openMenus.persuratan ? <FaChevronDown /> : <FaChevronRight />}</span>
        </button>
        {openMenus.persuratan && (
          <div className="submenu">
            <button className={`submenu-item ${isActive('/admin/surat/sk') ? 'active' : ''}`} onClick={() => handleNav('/admin/surat/sk')}><span className="dot"></span> SK & Tugas</button>
            <button className={`submenu-item ${isActive('/admin/surat/masuk') ? 'active' : ''}`} onClick={() => handleNav('/admin/surat/masuk')}><span className="dot"></span> Surat Masuk</button>
            <button className={`submenu-item ${isActive('/admin/surat/keluar') ? 'active' : ''}`} onClick={() => handleNav('/admin/surat/keluar')}><span className="dot"></span> Surat Keluar</button>
            <button className={`submenu-item ${isActive('/admin/surat/mou') ? 'active' : ''}`} onClick={() => handleNav('/admin/surat/mou')}><span className="dot"></span> MoU / MoA</button>
          </div>
        )}

        <button className={`nav-item ${isActive('/admin/surveillance') ? 'active' : ''}`} onClick={() => handleNav('/admin/surveillance')}>
          <div className="nav-icon"><FaEye /></div>
          <span className="nav-label">Surveillance</span>
        </button>

        {/* ACCOUNT */}
        <div className="nav-section-label">Akun</div>
        <button className={`nav-item ${isActive('/admin/ubah-sandi') ? 'active' : ''}`} onClick={() => handleNav('/admin/ubah-sandi')}>
          <div className="nav-icon"><FaLock /></div>
          <span className="nav-label">Ubah Sandi</span>
        </button>

      </div>

      {/* FOOTER: TOMBOL LOGOUT SEKARANG PAKAI FUNGSI handleLogout */}
      <div className="sidebar-footer">
        <button className="nav-item logout" onClick={handleLogout}>
          <div className="nav-icon"><FaSignOutAlt /></div>
          <span className="nav-label">Keluar</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;