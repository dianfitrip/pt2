import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './adminstyles/AdminDashboard.css'; 

const AdminNavbar = () => {
  const navigate = useNavigate();
  const [userData, setUserData] = useState({ name: 'Admin', role: 'Administrator' });

  // 1. Ambil Data User dari LocalStorage
  useEffect(() => {
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUserData({
          name: parsedUser.name || parsedUser.username || 'Admin',
          role: parsedUser.role || 'Administrator'
        });
      } catch (e) {
        console.error("Gagal parsing data user", e);
      }
    }
  }, []);

  return (
    <header className="top-header">
      {/* CSS KHUSUS UNTUK UBAH TEKS NAVBAR JADI HITAM/GELAP */}
      <style>{`
        /* Judul Sapaan */
        .top-header .header-title h3 {
          color: #1e293b !important; /* Hitam elegan */
          font-weight: 700;
          margin-bottom: 2px;
        }
        
        /* Subtitle / Teks kecil di bawah sapaan */
        .top-header .header-title .subtitle {
          color: #475569 !important; /* Abu-abu gelap (agar tidak tertukar dengan judul utama) */
          font-weight: 500;
        }

        /* Lingkaran Avatar Inisial */
        .top-header .avatar {
          background-color: #f97316 !important; /* Warna Oranye agar serasi dengan sidebar */
          color: #ffffff !important; /* Teks inisial putih */
          font-weight: bold;
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          box-shadow: 0 2px 4px rgba(249, 115, 22, 0.3); /* Tambahan efek shadow tipis */
        }
      `}</style>

      {/* BAGIAN KIRI: SAPAAN */}
      <div className="header-title">
        <h3>Selamat datang, {userData.name}!</h3>
        <p className="subtitle">Semoga harimu menyenangkan di sistem ini.</p>
      </div>
      
      {/* BAGIAN KANAN: PROFIL ONLY */}
      <div className="header-actions">
        
        {/* Area Profil (Klik langsung ke halaman profil) */}
        <div 
          className="user-profile clickable" 
          onClick={() => navigate('/admin/profil')}
          title="Ke Halaman Profil"
          style={{ 
            cursor: 'pointer', 
            display: 'flex', 
            alignItems: 'center', 
            gap: '12px',
            padding: '6px 12px',
            borderRadius: '8px',
            transition: 'background 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = '#f1f5f9'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
        >
          <div className="text-right">
            <span className="name" style={{ display: 'block', fontWeight: '700', fontSize: '14px', color: '#1e293b' }}>
              {userData.name}
            </span>
            <span className="role" style={{ fontSize: '12px', color: '#64748b', fontWeight: '500' }}>
              {userData.role}
            </span>
          </div>
          
          <div className="avatar">
            {userData.name.charAt(0).toUpperCase()}
          </div>
        </div>

      </div>
    </header>
  );
};

export default AdminNavbar;