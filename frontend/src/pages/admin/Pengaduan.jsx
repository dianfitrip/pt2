import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Eye, Save, X,
  MessageSquare, User, Mail, Phone, CheckCircle, Clock, AlertCircle, Loader2
} from 'lucide-react';
import './adminstyles/Pengaduan.css'; 

const Pengaduan = () => {
  // --- STATE ---
  const [data, setData] = useState([]); 
  const [filteredData, setFilteredData] = useState([]); 
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);
  const [statusEdit, setStatusEdit] = useState(''); 

  // --- FETCH DATA ---
  useEffect(() => {
    fetchData();
  }, []);

  // Filter Client-Side (Disesuaikan dengan nama kolom database baru)
  useEffect(() => {
    if (!data) return;
    
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = data.filter(item => {
      // PERBAIKAN: Menggunakan 'nama_pengadu' dan 'email_pengadu'
      const nama = item.nama_pengadu?.toLowerCase() || '';
      const email = item.email_pengadu?.toLowerCase() || '';
      const isi = item.isi_pengaduan?.toLowerCase() || '';
      
      return nama.includes(lowerTerm) || 
             email.includes(lowerTerm) || 
             isi.includes(lowerTerm);
    });
    
    setFilteredData(filtered);
  }, [searchTerm, data]);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/pengaduan');
      const result = response.data.data || [];
      setData(result);
      setFilteredData(result);
    } catch (error) {
      console.error("Error fetching pengaduan:", error);
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleDetailClick = (item) => {
    setSelectedItem(item);
    setStatusEdit(item.status_pengaduan);
    setShowModal(true);
  };

  const handleStatusChange = async () => {
    if (!selectedItem) return;
    try {
      await api.put(`/admin/pengaduan/${selectedItem.id_pengaduan}/status`, {
        status_pengaduan: statusEdit
      });
      
      Swal.fire("Berhasil", "Status pengaduan diperbarui", "success");
      setShowModal(false);
      fetchData(); 
    } catch (error) {
      Swal.fire("Gagal", "Terjadi kesalahan saat memperbarui status", "error");
    }
  };

  // Helper Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'selesai': 
        return <span className="status-badge bg-green-100 text-green-800"><CheckCircle size={14}/> Selesai</span>;
      case 'tindak_lanjut': 
        return <span className="status-badge bg-blue-100 text-blue-800"><Clock size={14}/> Diproses</span>;
      default: 
        return <span className="status-badge bg-yellow-100 text-yellow-800"><AlertCircle size={14}/> Masuk</span>;
    }
  };

  const formatDate = (dateStr) => {
    if (!dateStr) return '-';
    return new Date(dateStr).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit'
    });
  };

  return (
    <div className="pengaduan-container">
      {/* HEADER */}
      <div className="header-section">
        <div className="title-box">
          <h2>Layanan Pengaduan</h2>
          <p>Daftar keluhan dan masukan dari pengguna sistem.</p>
        </div>
      </div>

      {/* CONTENT CARD */}
      <div className="content-card">
        
        {/* TOOLBAR & SEARCH */}
        <div className="table-toolbar">
          <div className="toolbar-title">
            <h4>Daftar Laporan</h4>
          </div>
          <div className="toolbar-actions">
            <div className="search-bar-wrapper">
              <Search size={18} className="search-icon-inside" />
              <input 
                type="text" 
                className="search-input" 
                placeholder="Cari Nama / Isi Aduan..." 
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
        </div>

        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin text-orange-500" size={32} />
            <p>Memuat data pengaduan...</p>
          </div>
        ) : (
          <div className="table-responsive">
            <table className="modern-table">
              <thead>
                <tr>
                  <th>No</th>
                  <th>Tanggal</th>
                  <th>Pengirim</th>
                  <th>Isi Singkat</th> {/* Diganti dari Subjek ke Isi Singkat */}
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item, index) => (
                    <tr key={item.id_pengaduan}>
                      <td>{index + 1}</td>
                      <td>{formatDate(item.tanggal_pengaduan)}</td>
                      <td>
                        <div className="user-info">
                          {/* PERBAIKAN: Mapping data sesuai DB */}
                          <span className="name">{item.nama_pengadu}</span>
                          <span className="email text-xs text-gray-500">{item.sebagai_siapa}</span>
                        </div>
                      </td>
                      <td className="subject-col">
                        {/* PERBAIKAN: Menampilkan cuplikan isi pengaduan karena tidak ada kolom subjek */}
                        {item.isi_pengaduan}
                      </td>
                      <td>{getStatusBadge(item.status_pengaduan)}</td>
                      <td className="text-center">
                        <button 
                          className="btn-icon view" 
                          onClick={() => handleDetailClick(item)}
                          title="Lihat Detail"
                        >
                          <Eye size={18} />
                        </button>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="empty-state">
                      <MessageSquare size={40} className="text-gray-300 mb-2"/>
                      <p>Data tidak ditemukan.</p>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* MODAL DETAIL */}
      {showModal && selectedItem && (
        <div className="modal-backdrop">
          <div className="modal-card wide-modal">
            <div className="modal-header-modern">
              <h3>Detail Pengaduan</h3>
              <button className="btn-close-modern" onClick={() => setShowModal(false)}><X size={24}/></button>
            </div>
            
            <div className="modal-body-scroll">
              
              {/* INFO PENGIRIM */}
              <div className="info-box">
                <h4 className="box-title"><User size={16}/> Informasi Pengirim</h4>
                <div className="info-grid">
                  <div className="info-item">
                    <label>Nama Lengkap</label>
                    <p>{selectedItem.nama_pengadu}</p>
                  </div>
                  <div className="info-item">
                    <label>Sebagai</label>
                    <p className="capitalize">{selectedItem.sebagai_siapa}</p>
                  </div>
                  <div className="info-item">
                    <label><Mail size={14}/> Email</label>
                    <p>{selectedItem.email_pengadu || '-'}</p>
                  </div>
                  <div className="info-item">
                    <label><Phone size={14}/> No HP</label>
                    <p>{selectedItem.no_hp_pengadu || '-'}</p>
                  </div>
                </div>
              </div>

              {/* ISI PENGADUAN */}
              <div className="message-box">
                <h4 className="box-title"><MessageSquare size={16}/> Isi Laporan</h4>
                <div className="message-content">
                  <div className="message-header">
                    <span className="msg-date"><Clock size={12} className="inline mr-1"/>{formatDate(selectedItem.tanggal_pengaduan)}</span>
                  </div>
                  <p className="msg-text">{selectedItem.isi_pengaduan}</p>
                </div>
              </div>

              {/* UPDATE STATUS */}
              <div className="status-action-box">
                <label>Update Status Penanganan</label>
                <select 
                  className="status-select"
                  value={statusEdit} 
                  onChange={(e) => setStatusEdit(e.target.value)}
                >
                  <option value="masuk">Masuk (Belum dibaca)</option>
                  <option value="tindak_lanjut">Sedang Ditindak Lanjuti</option>
                  <option value="selesai">Selesai</option>
                </select>
              </div>

            </div>

            <div className="modal-footer-modern">
              <button type="button" className="btn-secondary" onClick={() => setShowModal(false)}>Tutup</button>
              <button type="button" className="btn-primary" onClick={handleStatusChange}>
                <Save size={16} className="mr-2"/> Simpan Status
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Pengaduan;