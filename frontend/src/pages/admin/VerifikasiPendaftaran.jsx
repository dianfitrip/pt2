import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api"; 
import { 
  Search, Eye, CheckCircle, XCircle, 
  User, MapPin, Phone, Mail, School, 
  Loader2, Clock 
} from 'lucide-react';
import './adminstyles/VerifikasiPendaftaran.css';

const VerifikasiPendaftaran = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionLoading, setActionLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // --- 1. FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/pendaftaran');
      const resultData = response.data.data || []; 
      setData(resultData);
      setFilteredData(resultData);
    } catch (error) {
      console.error("Error fetching data:", error);
      if (error.response?.status !== 500) {
        Swal.fire({
          icon: 'error',
          title: 'Gagal Memuat Data',
          text: error.response?.data?.message || 'Terjadi kesalahan koneksi.',
        });
      }
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- 2. SEARCH & FILTER ---
  useEffect(() => {
    const lowerTerm = searchTerm.toLowerCase();
    const filtered = data.filter(item => 
      (item.nama_lengkap && item.nama_lengkap.toLowerCase().includes(lowerTerm)) ||
      (item.email && item.email.toLowerCase().includes(lowerTerm)) ||
      (item.nik && item.nik.includes(lowerTerm))
    );
    setFilteredData(filtered);
  }, [searchTerm, data]);

  // --- 3. ACTIONS ---
  
  // Handle Verifikasi (Approve)
  const handleApprove = async (item) => {
    // Konfirmasi Awal
    const result = await Swal.fire({
      title: 'Verifikasi Pendaftaran?',
      html: `
        <p>Sistem akan membuat akun ASESI untuk:</p>
        <p><strong>${item.nama_lengkap}</strong></p>
        <br/>
        <p class="text-sm text-gray-500">Notifikasi berisi Password akan dikirim otomatis ke email pendaftar.</p>
      `,
      icon: 'question',
      showCancelButton: true,
      confirmButtonColor: '#10B981',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Verifikasi',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        // REQUEST KE BACKEND
        // Menggunakan POST sesuai route backend kamu
        await api.post(`/admin/pendaftaran/${item.id_pendaftaran}/approve`);
        
        // SUKSES - Tampilkan Username Saja (Username = NIK)
        await Swal.fire({
          icon: 'success',
          title: 'Akun Berhasil Dibuat!',
          html: `
            <div class="text-left">
              <p class="mb-2">Akun asesi telah aktif.</p>
              <p><strong>Username:</strong> ${item.nik}</p>
              <p class="text-sm text-gray-500 mt-2">
                *Password telah dikirim ke email: ${item.email}
              </p>
            </div>
          `,
          confirmButtonText: 'Oke, Mengerti'
        });

        setShowModal(false);
        fetchData(); // Refresh tabel
      } catch (error) {
        console.error("Approve error:", error);
        
        // Handle Error Spesifik
        let errorMessage = 'Gagal memverifikasi pendaftaran.';
        
        if (error.response?.status === 500) {
          // Jika error 500 (kemungkinan masalah email di backend), kita tetap beri info user
          errorMessage = 'Terjadi kesalahan pada server (kemungkinan konfigurasi email). Namun, cek apakah status user sudah berubah.';
        } else if (error.response?.data?.message) {
          errorMessage = error.response.data.message;
        }

        Swal.fire('Gagal!', errorMessage, 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // Handle Tolak (Reject)
  const handleReject = async (id_pendaftaran) => {
    const result = await Swal.fire({
      title: 'Tolak Pendaftaran?',
      text: "Pendaftar akan menerima email penolakan.",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#EF4444',
      cancelButtonColor: '#6B7280',
      confirmButtonText: 'Ya, Tolak',
      cancelButtonText: 'Batal'
    });

    if (result.isConfirmed) {
      setActionLoading(true);
      try {
        await api.post(`/admin/pendaftaran/${id_pendaftaran}/reject`);
        
        Swal.fire('Ditolak!', 'Pendaftaran telah ditolak.', 'success');
        setShowModal(false);
        fetchData();
      } catch (error) {
        console.error("Reject error:", error);
        Swal.fire('Gagal!', error.response?.data?.message || 'Gagal menolak pendaftaran.', 'error');
      } finally {
        setActionLoading(false);
      }
    }
  };

  // --- 4. UI HELPERS ---
  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedItem(null);
  };

  const getStatusBadge = (status) => {
    switch(status) {
      case 'approved':
        return <span className="status-badge status-approved"><CheckCircle size={14}/> Verified</span>;
      case 'rejected':
        return <span className="status-badge status-rejected"><XCircle size={14}/> Rejected</span>;
      default:
        return <span className="status-badge status-pending"><Clock size={14}/> Pending</span>;
    }
  };

  // --- RENDER ---
  return (
    <div className="verifikasi-page">
      <div className="page-header">
        <h1 className="page-title">Verifikasi Pendaftaran</h1>
        <p className="page-subtitle">Validasi data calon asesi baru</p>
      </div>

      <div className="filter-section-card">
        <div className="search-input-wrapper">
          <Search size={20} className="text-gray-400" />
          <input 
            type="text" 
            placeholder="Cari Nama, NIK, atau Email..." 
            className="search-input"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="bg-slate-50 text-slate-600 font-semibold border-b border-slate-200">
              <tr>
                <th className="px-6 py-4">No</th>
                <th className="px-6 py-4">Identitas</th>
                <th className="px-6 py-4">Program / Kompetensi</th>
                <th className="px-6 py-4">Tanggal Daftar</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    <div className="flex justify-center items-center gap-2">
                      <Loader2 className="animate-spin" /> Memuat data...
                    </div>
                  </td>
                </tr>
              ) : filteredData.length === 0 ? (
                <tr>
                  <td colSpan="6" className="text-center py-10 text-slate-500">
                    Tidak ada data pendaftaran.
                  </td>
                </tr>
              ) : (
                filteredData.map((item, index) => (
                  <tr key={item.id_pendaftaran} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4 text-slate-500">{index + 1}</td>
                    <td className="px-6 py-4">
                      <div className="font-bold text-slate-800">{item.nama_lengkap}</div>
                      <div className="text-xs text-slate-500">NIK: {item.nik}</div>
                      <div className="text-xs text-blue-600">{item.email}</div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-700 font-medium">{item.program_studi}</div>
                      <div className="text-xs text-slate-500">{item.kompetensi_keahlian || '-'}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      {item.tanggal_daftar ? new Date(item.tanggal_daftar).toLocaleDateString('id-ID') : '-'}
                    </td>
                    <td className="px-6 py-4">
                      {getStatusBadge(item.status)}
                    </td>
                    <td className="px-6 py-4 text-center">
                      <button 
                        onClick={() => openDetailModal(item)}
                        className="btn-icon-blue"
                        title="Lihat Detail"
                      >
                        <Eye size={18} />
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL DETAIL */}
      {showModal && selectedItem && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl w-full max-w-3xl shadow-2xl overflow-hidden animate-slide-up">
            
            <div className="px-6 py-4 border-b border-slate-100 flex justify-between items-center bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-blue-100 text-blue-600 rounded-lg">
                  <User size={20} />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-slate-800">Detail Pendaftar</h3>
                  <p className="text-xs text-slate-500">ID: #{selectedItem.id_pendaftaran}</p>
                </div>
              </div>
              <button onClick={closeModal} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>

            <div className="p-6 max-h-[70vh] overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                
                {/* Info Pribadi */}
                <div className="space-y-4">
                  <h4 className="section-title text-blue-600 flex items-center gap-2">
                    <User size={16}/> Data Diri
                  </h4>
                  <div className="space-y-2">
                    <DetailRow label="Nama Lengkap" value={selectedItem.nama_lengkap} />
                    <DetailRow label="NIK" value={selectedItem.nik} />
                    <DetailRow label="Email" value={selectedItem.email} />
                    <DetailRow label="No HP" value={selectedItem.no_hp} />
                  </div>
                </div>

                {/* Alamat & Wilayah */}
                <div className="space-y-4">
                  <h4 className="section-title text-blue-600 flex items-center gap-2">
                    <MapPin size={16}/> Domisili & Wilayah
                  </h4>
                  <div className="bg-slate-50 p-3 rounded-lg border border-slate-100 text-sm">
                    <p className="font-medium text-slate-800 mb-1">{selectedItem.alamat_lengkap}</p>
                    <p className="text-slate-500">
                      {selectedItem.kelurahan}, {selectedItem.kecamatan}, {selectedItem.kota}, {selectedItem.provinsi}
                    </p>
                  </div>
                  <DetailRow label="Wilayah RJI" value={selectedItem.wilayah_rji} />
                </div>

                {/* Akademik */}
                <div className="md:col-span-2 mt-2 pt-4 border-t border-slate-100">
                   <h4 className="section-title text-blue-600 flex items-center gap-2 mb-3">
                    <School size={16}/> Data Akademik
                  </h4>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <DetailRow label="Program Studi" value={selectedItem.program_studi} />
                      <DetailRow label="Kompetensi Keahlian" value={selectedItem.kompetensi_keahlian} />
                   </div>
                </div>

              </div>
            </div>

            <div className="px-6 py-4 bg-slate-50 border-t border-slate-200 flex justify-end gap-3">
              <button 
                className="px-4 py-2 rounded-lg text-slate-600 hover:bg-slate-200 font-medium transition-colors" 
                onClick={closeModal}
                disabled={actionLoading}
              >
                Tutup
              </button>
              
              {/* Tombol Aksi HANYA jika status Pending */}
              {selectedItem.status === 'pending' && (
                <>
                  <button 
                    className="px-4 py-2 rounded-lg border border-red-200 text-red-600 hover:bg-red-50 font-medium transition-colors flex items-center gap-2"
                    onClick={() => handleReject(selectedItem.id_pendaftaran)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin"/> : <XCircle size={16}/>}
                    Tolak
                  </button>
                  <button 
                    className="px-4 py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 shadow-sm hover:shadow-md transition-all font-medium flex items-center gap-2"
                    onClick={() => handleApprove(selectedItem)}
                    disabled={actionLoading}
                  >
                    {actionLoading ? <Loader2 size={16} className="animate-spin"/> : <CheckCircle size={16}/>}
                    Verifikasi
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

// Komponen Kecil untuk Baris Detail
const DetailRow = ({ label, value }) => (
  <div className="flex justify-between border-b border-slate-100 pb-1 mb-1 last:border-0">
    <span className="text-slate-500 text-sm">{label}</span>
    <span className="text-slate-800 font-medium text-sm text-right">{value || '-'}</span>
  </div>
);

export default VerifikasiPendaftaran;