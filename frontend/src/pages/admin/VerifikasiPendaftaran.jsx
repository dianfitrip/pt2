import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api"; 
import { 
  Search, Eye, CheckCircle, XCircle, 
  User, MapPin, Calendar, School, Loader2, FileText 
} from 'lucide-react';
import './adminstyles/VerifikasiPendaftaran.css';

const VerifikasiPendaftaran = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 1. FETCH DATA ---
  // Sesuai Controller: exports.getAll
  const fetchData = async () => {
    setLoading(true);
    try {
      // Endpoint: GET /admin/pendaftaran
      const response = await api.get('/admin/pendaftaran');
      
      // Controller response: response.success(res, "List pendaftaran asesi", data);
      // Biasanya formatnya: { status: true, message: "...", data: [...] }
      const resultData = response.data.data || []; 
      
      setData(resultData);
      setFilteredData(resultData);
    } catch (error) {
      console.error("Error fetching data:", error);
      
      // Deteksi Error 500 (Masalah Database)
      if (error.response && error.response.status === 500) {
        Swal.fire({
          icon: 'error',
          title: 'Server Error (500)',
          text: 'Terjadi kesalahan di server. Kemungkinan tabel database belum ada. Cek terminal backend Anda.',
          footer: 'Pastikan file SQL sudah di-import ke phpMyAdmin'
        });
      } else {
        Swal.fire({
          icon: 'error',
          title: 'Gagal',
          text: 'Gagal mengambil data pendaftaran.'
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. SEARCH / FILTER ---
  useEffect(() => {
    if (!searchTerm) {
      setFilteredData(data);
    } else {
      const lowerTerm = searchTerm.toLowerCase();
      const filtered = data.filter(item => 
        (item.nama_lengkap && item.nama_lengkap.toLowerCase().includes(lowerTerm)) ||
        (item.nik && item.nik.includes(lowerTerm)) ||
        (item.program_studi && item.program_studi.toLowerCase().includes(lowerTerm))
      );
      setFilteredData(filtered);
    }
  }, [searchTerm, data]);

  // --- 3. HANDLE ACTIONS (APPROVE / REJECT) ---

  // Handle Approve (Verifikasi)
  const handleApprove = async (id) => {
    if (showModal) closeModal();

    const result = await Swal.fire({
      title: 'Verifikasi Pendaftaran?',
      text: "Sistem akan membuat akun user dan mengirim email ke asesi.",
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981', 
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Verifikasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      // Loading state saat proses backend berjalan (kirim email dll)
      Swal.fire({
        title: 'Memproses...',
        text: 'Sedang membuat akun dan mengirim email notifikasi.',
        allowOutsideClick: false,
        didOpen: () => {
          Swal.showLoading();
        }
      });

      try {
        // PERUBAHAN PENTING:
        // Controller: exports.approvePendaftaran (menggunakan parameter req.params.id)
        // Route: router.post("/pendaftaran/:id/approve", ...)
        // Method: POST
        await api.post(`/admin/pendaftaran/${id}/approve`);

        Swal.fire(
          'Berhasil!',
          'Pendaftaran diverifikasi. Akun telah dibuat dan email terkirim.',
          'success'
        );
        fetchData(); // Refresh data tabel
      } catch (error) {
        console.error("Error approve:", error);
        Swal.fire(
          'Gagal!',
          error.response?.data?.message || 'Terjadi kesalahan saat verifikasi.',
          'error'
        );
      }
    }
  };

  // Handle Reject (Tolak)
  const handleReject = async (id) => {
    if (showModal) closeModal();

    const result = await Swal.fire({
      title: 'Tolak Pendaftaran?',
      text: "Status akan diubah menjadi rejected dan notifikasi dikirim.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#64748B',
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      Swal.fire({
        title: 'Memproses...',
        didOpen: () => Swal.showLoading()
      });

      try {
        // PERUBAHAN PENTING:
        // Controller: exports.rejectPendaftaran (menggunakan parameter req.params.id)
        // Route: router.post("/pendaftaran/:id/reject", ...)
        // Method: POST
        await api.post(`/admin/pendaftaran/${id}/reject`);

        Swal.fire(
          'Ditolak!',
          'Pendaftaran telah ditolak.',
          'success'
        );
        fetchData(); // Refresh data tabel
      } catch (error) {
        console.error("Error reject:", error);
        Swal.fire(
          'Gagal!',
          error.response?.data?.message || 'Terjadi kesalahan.',
          'error'
        );
      }
    }
  };

  // --- 4. MODAL HELPERS ---
  const handleOpenModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  // Helper Format Date
  const formatDate = (dateString) => {
    if (!dateString) return "-";
    return new Date(dateString).toLocaleDateString('id-ID', {
      day: 'numeric', month: 'long', year: 'numeric'
    });
  };

  // Helper Badge Status
  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return <span className="status-badge success">Terverifikasi</span>;
      case 'rejected':
        return <span className="status-badge danger">Ditolak</span>;
      default:
        return <span className="status-badge warning">Menunggu</span>;
    }
  };

  return (
    <div className="verifikasi-page">
      {/* Header */}
      <div className="page-header">
        <div>
          <h1 className="page-title">Verifikasi Pendaftaran</h1>
          <p className="page-subtitle">Kelola dan verifikasi pendaftaran asesi baru</p>
        </div>
      </div>

      {/* Filter & Search */}
      <div className="filter-section-card">
        <div className="search-input-wrapper">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari nama, NIK, atau prodi..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="flex justify-center items-center py-20">
            <Loader2 className="animate-spin text-blue-600" size={40} />
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Tanggal Daftar</th>
                  <th>NIK</th>
                  <th>Nama Lengkap</th>
                  <th>Program Studi</th>
                  <th>Status</th>
                  <th className="text-center">Aksi</th>
                </tr>
              </thead>
              <tbody>
                {filteredData.length > 0 ? (
                  filteredData.map((item) => (
                    <tr key={item.id_pendaftaran}>
                      {/* Pastikan nama field sesuai Model Sequelize: tanggal_daftar, nik, dll */}
                      <td>{formatDate(item.tanggal_daftar)}</td>
                      <td>{item.nik}</td>
                      <td>
                        <div className="font-medium text-gray-900">{item.nama_lengkap}</div>
                        <div className="text-xs text-gray-500">{item.email}</div>
                      </td>
                      <td>{item.program_studi}</td>
                      <td>{getStatusBadge(item.status)}</td>
                      <td>
                        <div className="flex justify-center gap-2">
                          <button 
                            className="btn-action btn-view"
                            onClick={() => handleOpenModal(item)}
                            title="Lihat Detail"
                          >
                            <Eye size={18} />
                          </button>
                          
                          {/* Tombol Aksi Langsung (Hanya muncul jika pending) */}
                          {item.status === 'pending' && (
                            <>
                              <button 
                                className="btn-action btn-check"
                                onClick={() => handleApprove(item.id_pendaftaran)}
                                title="Verifikasi"
                              >
                                <CheckCircle size={18} />
                              </button>
                              <button 
                                className="btn-action btn-cross"
                                onClick={() => handleReject(item.id_pendaftaran)}
                                title="Tolak"
                              >
                                <XCircle size={18} />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan="6" className="text-center py-8 text-gray-500">
                      Data tidak ditemukan
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* --- MODAL DETAIL --- */}
      {showModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content-modern">
            <div className="modal-header-modern">
              <div>
                <h3 className="text-xl font-bold text-gray-800">Detail Pendaftaran</h3>
                <p className="text-sm text-gray-500">ID: #{selectedItem.id_pendaftaran}</p>
              </div>
              <button className="close-btn" onClick={closeModal}>
                <XCircle size={24} />
              </button>
            </div>

            <div className="modal-body-modern custom-scrollbar">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Kolom Kiri: Info Pribadi */}
                <div>
                  <h4 className="group-title"><User size={16}/> Informasi Pribadi</h4>
                  
                  <div className="detail-row">
                    <span className="label">Nama Lengkap</span>
                    <span className="value">{selectedItem.nama_lengkap}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">NIK</span>
                    <span className="value">{selectedItem.nik}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Email</span>
                    <span className="value">{selectedItem.email}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">No. HP</span>
                    <span className="value">{selectedItem.no_hp}</span>
                  </div>
                </div>

                {/* Kolom Kanan: Info Akademik & Wilayah */}
                <div>
                  <h4 className="group-title"><School size={16}/> Data Akademik</h4>
                  
                  <div className="detail-row">
                    <span className="label">Program Studi</span>
                    <span className="value">{selectedItem.program_studi}</span>
                  </div>
                  <div className="detail-row">
                    <span className="label">Kompetensi</span>
                    <span className="value">{selectedItem.kompetensi_keahlian}</span>
                  </div>
                  <div className="detail-row mt-4 mb-2">
                    <span className="label flex items-center gap-2">
                      <FileText size={14}/> Wilayah RJI
                    </span>
                  </div>
                  <div className="bg-gray-50 p-2 rounded text-sm font-medium border border-gray-200">
                    {selectedItem.wilayah_rji}
                  </div>
                </div>
              </div>

              {/* Bagian Bawah: Alamat */}
              <div className="mt-6">
                <h4 className="group-title"><MapPin size={16}/> Alamat Lengkap</h4>
                <div className="address-box">
                  <p className="font-medium text-gray-800">{selectedItem.alamat_lengkap}</p>
                  <p className="text-sm text-gray-500 mt-1">
                    Kel. {selectedItem.kelurahan}, Kec. {selectedItem.kecamatan}, <br/>
                    {selectedItem.kota}, {selectedItem.provinsi}
                  </p>
                </div>
              </div>

              {/* Status Info */}
              <div className="mt-6 flex items-center justify-between bg-blue-50 p-4 rounded-lg border border-blue-100">
                <div className="flex items-center gap-3">
                  <Calendar size={20} className="text-blue-600"/>
                  <div>
                    <p className="text-xs text-blue-600 font-semibold uppercase">Tanggal Mendaftar</p>
                    <p className="text-sm font-bold text-gray-700">{formatDate(selectedItem.tanggal_daftar)}</p>
                  </div>
                </div>
                <div>
                  {getStatusBadge(selectedItem.status)}
                </div>
              </div>
            </div>

            {/* Footer Modal */}
            <div className="modal-footer-modern">
              <button className="px-4 py-2 rounded-lg text-gray-600 hover:bg-gray-100 font-medium transition-colors" onClick={closeModal}>
                Tutup
              </button>
              
              {/* Tombol Action hanya muncul jika status masih PENDING */}
              {selectedItem.status === 'pending' && (
                <>
                  <button 
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                    onClick={() => handleReject(selectedItem.id_pendaftaran)}
                  >
                    <XCircle size={16}/> Tolak
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-md hover:shadow-lg transition-all font-medium flex items-center gap-2"
                    onClick={() => handleApprove(selectedItem.id_pendaftaran)}
                  >
                    <CheckCircle size={16}/> Verifikasi
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default VerifikasiPendaftaran;