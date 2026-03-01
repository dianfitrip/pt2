import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Bell, Mail, MessageSquare, Filter, 
  CheckCircle, XCircle, Clock, Eye, Trash2, 
  Loader2, ChevronLeft, ChevronRight, X, AlertCircle
} from 'lucide-react';
import './adminstyles/Notifikasi.css';

const NotifikasiAdmin = () => {
  // --- STATE ---
  const [allData, setAllData] = useState([]); // Data mentah dari DB
  const [data, setData] = useState([]);       // Data yang ditampilkan (paginated)
  const [loading, setLoading] = useState(true);
  
  // Filter & Pagination
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState(''); 
  const [filterChannel, setFilterChannel] = useState('');
  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });
  
  // Modal
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedNotif, setSelectedNotif] = useState(null);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/notifikasi');
      if (response.data.success) {
        setAllData(response.data.data || []);
      }
    } catch (error) {
      console.error(error);
      Swal.fire('Error', 'Gagal mengambil data notifikasi', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTERING & PAGINATION LOGIC ---
  useEffect(() => {
    let processedData = [...allData];

    // 1. Search
    if (searchTerm) {
      const lowerSearch = searchTerm.toLowerCase();
      processedData = processedData.filter(item => 
        (item.pesan && item.pesan.toLowerCase().includes(lowerSearch)) ||
        (item.tujuan && item.tujuan.toLowerCase().includes(lowerSearch))
      );
    }

    // 2. Filter Type
    if (filterType) {
      processedData = processedData.filter(item => item.ref_type === filterType);
    }

    // 3. Filter Channel
    if (filterChannel) {
      processedData = processedData.filter(item => item.channel === filterChannel);
    }

    // 4. Pagination Config
    const totalItems = processedData.length;
    const totalPages = Math.ceil(totalItems / pagination.limit);
    const currentPage = pagination.page > totalPages && totalPages > 0 ? totalPages : pagination.page;

    // 5. Slicing
    const startIndex = (currentPage - 1) * pagination.limit;
    const endIndex = startIndex + pagination.limit;
    const paginatedData = processedData.slice(startIndex, endIndex);

    setData(paginatedData);
    setPagination(prev => ({
      ...prev,
      page: currentPage,
      total: totalItems,
      totalPages: totalPages || 1
    }));

  }, [allData, searchTerm, filterType, filterChannel, pagination.page]);

  // --- HANDLERS ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Log?',
      text: "Data notifikasi ini akan dihapus permanen.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Ya, Hapus',
      cancelButtonText: 'Batal',
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/notifikasi/${id}`);
        Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const openDetail = (item) => {
    setSelectedNotif(item);
    setShowDetailModal(true);
  };

  const formatDateTime = (dateString) => {
    if (!dateString) return '-';
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('id-ID', { day: 'numeric', month: 'short', year: 'numeric' }),
      time: date.toLocaleTimeString('id-ID', { hour: '2-digit', minute: '2-digit' })
    };
  };

  return (
    <div className="notifikasi-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Riwayat Notifikasi</h1>
          <p className="page-subtitle">Monitor status pengiriman Email & WhatsApp Gateway</p>
        </div>
      </div>

      {/* Toolbar (Search & Filters) */}
      <div className="toolbar-section">
        <div className="search-wrapper">
          <Search className="search-icon" size={18} />
          <input 
            type="text" 
            className="search-input"
            placeholder="Cari tujuan, email, atau isi pesan..." 
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setPagination(p => ({...p, page: 1}));
            }}
          />
        </div>
        
        <div className="filter-group">
          <div className="custom-select">
            <Filter size={16} className="select-icon"/>
            <select value={filterType} onChange={(e) => setFilterType(e.target.value)}>
              <option value="">Semua Kategori</option>
              <option value="pendaftaran">Pendaftaran</option>
              <option value="pengaduan">Pengaduan</option>
              <option value="akun">Akun User</option>
            </select>
          </div>

          <div className="custom-select">
            <Mail size={16} className="select-icon"/>
            <select value={filterChannel} onChange={(e) => setFilterChannel(e.target.value)}>
              <option value="">Semua Channel</option>
              <option value="email">Email</option>
              <option value="wa">WhatsApp</option>
            </select>
          </div>
        </div>
      </div>

      {/* Table */}
      <div className="table-wrapper">
        {loading ? (
          <div className="loading-state">
            <Loader2 className="animate-spin text-blue-500" size={40}/>
            <p>Memuat riwayat...</p>
          </div>
        ) : (
          <table className="modern-table">
            <thead>
              <tr>
                <th width="5%">No</th>
                <th width="15%">Waktu Kirim</th>
                <th width="15%">Channel & Tipe</th>
                <th width="20%">Tujuan</th>
                <th width="25%">Pesan</th>
                <th width="10%">Status</th>
                <th width="10%" className="text-center">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => {
                  const { date, time } = formatDateTime(item.waktu_kirim);
                  return (
                    <tr key={item.id_notifikasi || index} className="table-row">
                      <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                      <td>
                        <div className="date-cell">
                          <span className="font-medium text-gray-700">{date}</span>
                          <span className="text-xs text-gray-500 flex items-center gap-1">
                            <Clock size={10}/> {time}
                          </span>
                        </div>
                      </td>
                      <td>
                        <div className="flex flex-col gap-1 items-start">
                          <span className={`channel-badge ${item.channel}`}>
                            {item.channel === 'email' ? <Mail size={10}/> : <MessageSquare size={10}/>}
                            {item.channel?.toUpperCase()}
                          </span>
                          <span className="text-xs text-gray-500 capitalize bg-gray-100 px-2 py-0.5 rounded">
                            {item.ref_type || 'General'}
                          </span>
                        </div>
                      </td>
                      <td className="font-medium text-gray-800 break-all text-sm">
                        {item.tujuan}
                      </td>
                      <td>
                        <div className="text-sm text-gray-600 truncate max-w-[250px]" title={item.pesan}>
                          {item.pesan}
                        </div>
                      </td>
                      <td>
                        <span className={`status-pill ${item.status_kirim}`}>
                          {item.status_kirim === 'terkirim' ? <CheckCircle size={12}/> : <XCircle size={12}/>}
                          {item.status_kirim === 'terkirim' ? 'Sukses' : 'Gagal'}
                        </span>
                      </td>
                      <td>
                        {/* --- TOMBOL AKSI DIPERBESAR --- */}
                        <div className="action-buttons-text">
                          <button 
                            className="btn-text btn-detail-text" 
                            onClick={() => openDetail(item)}
                            title="Lihat Detail Notifikasi"
                          >
                            <Eye size={16}/> Detail
                          </button>
                          <button 
                            className="btn-text btn-reject-text" 
                            onClick={() => handleDelete(item.id_notifikasi)}
                            title="Hapus Data Notifikasi"
                          >
                            <Trash2 size={16}/> Hapus
                          </button>
                        </div>
                        {/* ----------------------------- */}
                      </td>
                    </tr>
                  );
                })
              ) : (
                <tr>
                  <td colSpan="7" className="empty-state">
                    <div className="empty-content">
                      <Bell size={40} className="text-gray-300 mb-2"/>
                      <p>Tidak ada riwayat notifikasi ditemukan</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <div className="pagination-info">
          Menampilkan {data.length} dari {pagination.total} data
        </div>
        <div className="pagination-controls">
          <button 
            disabled={pagination.page === 1} 
            onClick={() => setPagination(p=>({...p, page: p.page-1}))}
          >
            <ChevronLeft size={18}/>
          </button>
          <span>Hal {pagination.page} dari {pagination.totalPages}</span>
          <button 
            disabled={pagination.page === pagination.totalPages || pagination.totalPages === 0} 
            onClick={() => setPagination(p=>({...p, page: p.page+1}))}
          >
            <ChevronRight size={18}/>
          </button>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {showDetailModal && selectedNotif && (
        <div className="modal-backdrop">
          <div className="modal-card">
            <div className="modal-header-modern">
              <div>
                <h3>Detail Notifikasi</h3>
                <p className="text-sm opacity-80">Rincian pesan yang dikirimkan sistem</p>
              </div>
              <button className="btn-close-modern" onClick={() => setShowDetailModal(false)}>
                <X size={24}/>
              </button>
            </div>
            
            <div className="modal-body-scroll">
              <div className={`status-banner ${selectedNotif.status_kirim}`}>
                STATUS PENGIRIMAN: {selectedNotif.status_kirim?.toUpperCase()}
              </div>

              <div className="detail-grid-modern">
                <div className="detail-col full-width">
                  <div className="detail-group">
                    <h4 className="group-title"><Mail size={16}/> Informasi Pengiriman</h4>
                    <div className="detail-row">
                      <span className="label">Channel</span>
                      <span className={`channel-badge ${selectedNotif.channel}`}>
                        {selectedNotif.channel?.toUpperCase()}
                      </span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Tujuan</span>
                      <span className="value text-blue-600">{selectedNotif.tujuan}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">Waktu Kirim</span>
                      <span className="value">
                        {formatDateTime(selectedNotif.waktu_kirim).date} pukul {formatDateTime(selectedNotif.waktu_kirim).time}
                      </span>
                    </div>
                  </div>
                </div>

                <div className="detail-col full-width">
                  <div className="detail-group">
                    <h4 className="group-title"><AlertCircle size={16}/> Konteks</h4>
                    <div className="detail-row">
                      <span className="label">Tipe Referensi</span>
                      <span className="value capitalize">{selectedNotif.ref_type || '-'}</span>
                    </div>
                    <div className="detail-row">
                      <span className="label">ID Referensi</span>
                      <span className="value font-mono">#{selectedNotif.ref_id || '-'}</span>
                    </div>
                  </div>
                </div>

                <div className="detail-col full-width">
                  <div className="detail-group">
                    <h4 className="group-title"><MessageSquare size={16}/> Isi Pesan</h4>
                    <div className="message-box">
                      {selectedNotif.pesan}
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="modal-footer-modern">
              <button className="btn-secondary" onClick={() => setShowDetailModal(false)}>Tutup</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotifikasiAdmin;