import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, Download,
  Calendar, Loader2, ChevronLeft, ChevronRight, Clock
} from 'lucide-react';
import './adminstyles/JadwalUji.css'; 

const JadwalUji = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [modalType, setModalType] = useState(''); 
  const [selectedItem, setSelectedItem] = useState(null);
  
  // Data Pendukung
  const [listSkema, setListSkema] = useState([]);
  const [listTuk, setListTuk] = useState([]);

  const [pagination, setPagination] = useState({ page: 1, limit: 10, total: 0, totalPages: 1 });

  // Constants
  const months = [
    "Januari", "Februari", "Maret", "April", "Mei", "Juni", 
    "Juli", "Agustus", "September", "Oktober", "November", "Desember"
  ];
  
  const gelombangOptions = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

  // Form State
  const [formData, setFormData] = useState({
    Nama_Judul_Kegiatan: '', 
    Tahun: new Date().getFullYear(), 
    Periode: '', 
    Gelombang_Grup: '',
    Tgl_Awal_Pelaksanaan: '', 
    Tgl_Akhir_Pelaksanaan: '', 
    Jam: '', // Disimpan format HH:mm (contoh: 08:00)
    Kuota: '',
    Skema_Kompetensi: '', 
    TUK: '', 
    Nomor_Surat_Tugas: '', 
    Sumber_Anggaran: 'Perusahaan', 
    Instansi_Pemberi_Anggaran: ''
  });

  const isDetailMode = modalType === 'detail';

  // --- FETCH DATA ---
  const fetchOptions = async () => {
    try {
        const [resSkema, resTuk] = await Promise.all([
            api.get('/admin/skema?limit=100').catch(() => ({ data: { data: { data: [] } } })),
            api.get('/admin/tuk?limit=100').catch(() => ({ data: { data: { data: [] } } }))
        ]);
        
        setListSkema(resSkema.data.data.data || []);
        setListTuk(resTuk.data.data.data || []);
    } catch (e) { console.error("Gagal load options", e); }
  };

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/jadwal/uji-kompetensi', {
        params: { search: searchTerm, page: pagination.page, limit: pagination.limit }
      });
      if (response.data.success) {
        setData(response.data.data.data || []);
        setPagination(prev => ({
          ...prev, 
          total: response.data.data.total, 
          totalPages: response.data.data.totalPages
        }));
      }
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
    fetchOptions();
  }, [pagination.page, searchTerm]);

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isDetailMode) return;

    try {
      if (modalType === 'create') {
        await api.post('/admin/jadwal/uji-kompetensi', formData);
        Swal.fire('Sukses', 'Jadwal berhasil ditambahkan', 'success');
      } else {
        await api.put(`/admin/jadwal/uji-kompetensi/${selectedItem.id_jadwal}`, formData);
        Swal.fire('Sukses', 'Jadwal berhasil diperbarui', 'success');
      }
      setShowModal(false);
      fetchData();
    } catch (error) {
      Swal.fire('Error', error.response?.data?.message || 'Gagal menyimpan', 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Jadwal?', text: "Data tidak bisa dikembalikan!", icon: 'warning',
      showCancelButton: true, confirmButtonText: 'Hapus', cancelButtonText: 'Batal', confirmButtonColor: '#d33'
    });
    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/jadwal/uji-kompetensi/${id}`);
        Swal.fire('Terhapus!', 'Data telah dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Error', 'Gagal menghapus data', 'error');
      }
    }
  };

  const openModal = (type, item = null) => {
    setModalType(type);
    setSelectedItem(item);
    
    if (type === 'create') {
      setFormData({
        Nama_Judul_Kegiatan: '', Tahun: new Date().getFullYear(), Periode: '', Gelombang_Grup: '',
        Tgl_Awal_Pelaksanaan: '', Tgl_Akhir_Pelaksanaan: '', 
        Jam: '08:00', // Default jam
        Kuota: '',
        Skema_Kompetensi: '', TUK: '', Nomor_Surat_Tugas: '', 
        Sumber_Anggaran: 'Perusahaan', Instansi_Pemberi_Anggaran: ''
      });
    } else if (item) {
      setFormData({
        ...item,
        Tgl_Awal_Pelaksanaan: item.Tgl_Awal_Pelaksanaan || '',
        Tgl_Akhir_Pelaksanaan: item.Tgl_Akhir_Pelaksanaan || '',
        Jam: item.Jam || ''
      });
    }
    setShowModal(true);
  };

  const handleExport = async (format) => {
    try {
      const response = await api.get(`/admin/jadwal/uji-kompetensi/export?format=${format}`, { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `jadwal_uji.${format}`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (e) { Swal.fire('Error', 'Gagal export', 'error'); }
  };

  return (
    <div className="jadwal-container">
      {/* Header */}
      <div className="header-section">
        <div className="title-box">
          <h2>Jadwal Uji Kompetensi</h2>
          <p>Kelola jadwal pelaksanaan asesmen dan sertifikasi</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn-create" onClick={() => openModal('create')}><Plus size={18} /> Tambah</button>
          <button className="btn-export" onClick={() => handleExport('csv')}><Download size={18} /> Export</button>
        </div>
      </div>

      {/* Filter */}
      <div className="filter-section">
        <div className="search-box">
          <Search className="search-icon" size={20} />
          <input type="text" placeholder="Cari Kegiatan / No Surat..." value={searchTerm} onChange={(e) => setSearchTerm(e.target.value)} />
        </div>
      </div>

      {/* Table */}
      <div className="table-container">
        {loading ? (
          <div className="loading-state"><Loader2 className="animate-spin" size={32} /><p>Memuat data...</p></div>
        ) : (
          <table className="data-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kegiatan</th>
                <th>Tgl Pelaksanaan</th>
                <th>Jam</th>
                <th>Skema</th>
                <th>TUK</th>
                <th>Kuota</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {data.length > 0 ? (
                data.map((item, index) => (
                  <tr key={item.id_jadwal}>
                    <td>{(pagination.page - 1) * pagination.limit + index + 1}</td>
                    <td className="font-medium">{item.Nama_Judul_Kegiatan}</td>
                    <td>
                        <div className="flex flex-col gap-1 text-sm">
                            <span className="flex items-center gap-1"><Calendar size={12}/> {item.Tgl_Awal_Pelaksanaan}</span>
                            <span className="text-gray-400 text-xs">s/d</span>
                            <span className="flex items-center gap-1"><Calendar size={12}/> {item.Tgl_Akhir_Pelaksanaan}</span>
                        </div>
                    </td>
                    <td>
                        <div className="flex items-center gap-1 text-sm bg-gray-100 px-2 py-1 rounded w-fit whitespace-nowrap">
                            <Clock size={12}/> {item.Jam || '-'}
                        </div>
                    </td>
                    <td>{item.skema?.kode_skema || '-'}</td>
                    <td>{item.tuk?.nama_tuk || '-'}</td>
                    <td>{item.Kuota}</td>
                    <td>
                      <div className="action-buttons">
                        <button className="btn-action view" onClick={() => openModal('detail', item)}><Eye size={18} /></button>
                        <button className="btn-action edit" onClick={() => openModal('edit', item)}><Edit2 size={18} /></button>
                        <button className="btn-action delete" onClick={() => handleDelete(item.id_jadwal)}><Trash2 size={18} /></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr><td colSpan="8" className="text-center py-8 text-gray-500">Data tidak ditemukan</td></tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="pagination-section">
        <div className="pagination-info">Menampilkan {data.length} dari {pagination.total} data</div>
        <div className="pagination-controls">
          <button disabled={pagination.page === 1} onClick={() => setPagination(p => ({ ...p, page: p.page - 1 }))}><ChevronLeft size={18}/></button>
          <span>Hal {pagination.page} / {pagination.totalPages}</span>
          <button disabled={pagination.page === pagination.totalPages} onClick={() => setPagination(p => ({ ...p, page: p.page + 1 }))}><ChevronRight size={18}/></button>
        </div>
      </div>

      {/* Modal Form */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content large-modal">
            <div className="modal-header">
              <h3>{isDetailMode ? 'Detail Jadwal' : (modalType === 'create' ? 'Tambah Jadwal' : 'Edit Jadwal')}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            <form onSubmit={handleSubmit}>
              <div className="modal-body scrollable-body">
                
                <h4 className="section-title">Informasi Kegiatan</h4>
                <div className="form-group">
                  <label>Nama Kegiatan <span className="text-red-500">*</span></label>
                  <input type="text" name="Nama_Judul_Kegiatan" value={formData.Nama_Judul_Kegiatan} onChange={handleInputChange} disabled={isDetailMode} required />
                </div>

                <div className="form-row three-col">
                    <div className="form-group"><label>Tahun</label><input type="number" name="Tahun" value={formData.Tahun} onChange={handleInputChange} disabled={isDetailMode}/></div>
                    
                    <div className="form-group">
                        <label>Periode Bulan</label>
                        <select name="Periode" value={formData.Periode} onChange={handleInputChange} disabled={isDetailMode}>
                            <option value="">-- Pilih Bulan --</option>
                            {months.map(m => (
                                <option key={m} value={m}>{m}</option>
                            ))}
                        </select>
                    </div>

                    <div className="form-group">
                        <label>Gelombang</label>
                        <select name="Gelombang_Grup" value={formData.Gelombang_Grup} onChange={handleInputChange} disabled={isDetailMode}>
                            <option value="">-- Pilih --</option>
                            {gelombangOptions.map(g => (
                                <option key={g} value={`Gelombang ${g}`}>{`Gelombang ${g}`}</option>
                            ))}
                        </select>
                    </div>
                </div>

                <h4 className="section-title">Waktu & Tempat</h4>
                <div className="form-row">
                    <div className="form-group">
                        <label>Tanggal Awal Pelaksanaan</label>
                        <input type="date" name="Tgl_Awal_Pelaksanaan" value={formData.Tgl_Awal_Pelaksanaan} onChange={handleInputChange} disabled={isDetailMode}/>
                    </div>
                    <div className="form-group">
                        <label>Tanggal Akhir Pelaksanaan</label>
                        <input type="date" name="Tgl_Akhir_Pelaksanaan" value={formData.Tgl_Akhir_Pelaksanaan} onChange={handleInputChange} disabled={isDetailMode}/>
                    </div>
                    
                    {/* INPUT JAM (1 KOLOM SAJA) */}
                    <div className="form-group">
                        <label>Jam</label>
                        <input 
                            type="time" 
                            name="Jam" 
                            value={formData.Jam} 
                            onChange={handleInputChange}
                            disabled={isDetailMode} 
                            className="w-full p-2 border rounded"
                        />
                    </div>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Tempat Uji Kompetensi (TUK) <span className="text-red-500">*</span></label>
                        <select name="TUK" value={formData.TUK} onChange={handleInputChange} disabled={isDetailMode} required>
                            <option value="">-- Pilih TUK --</option>
                            {listTuk.map(t => <option key={t.id_tuk} value={t.id_tuk}>{t.nama_tuk}</option>)}
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Kuota Peserta</label>
                        <input type="number" name="Kuota" value={formData.Kuota} onChange={handleInputChange} disabled={isDetailMode}/>
                    </div>
                </div>

                <h4 className="section-title">Skema & Anggaran</h4>
                <div className="form-group">
                    <label>Skema Kompetensi <span className="text-red-500">*</span></label>
                    <select name="Skema_Kompetensi" value={formData.Skema_Kompetensi} onChange={handleInputChange} disabled={isDetailMode} required>
                        <option value="">-- Pilih Skema --</option>
                        {listSkema.map(s => <option key={s.id_skema} value={s.id_skema}>{s.kode_skema} - {s.judul_skema}</option>)}
                    </select>
                </div>

                <div className="form-row">
                    <div className="form-group">
                        <label>Sumber Anggaran</label>
                        <select name="Sumber_Anggaran" value={formData.Sumber_Anggaran} onChange={handleInputChange} disabled={isDetailMode}>
                            <option value="Perusahaan">Perusahaan</option>
                            <option value="APBN">APBN</option>
                            <option value="APBD">APBD</option>
                            <option value="Sendiri">Mandiri / Sendiri</option>
                        </select>
                    </div>
                    <div className="form-group">
                        <label>Instansi Pemberi</label>
                        <input type="text" name="Instansi_Pemberi_Anggaran" value={formData.Instansi_Pemberi_Anggaran} onChange={handleInputChange} disabled={isDetailMode}/>
                    </div>
                </div>

                <div className="form-group">
                    <label>Nomor Surat Tugas</label>
                    <input type="text" name="Nomor_Surat_Tugas" value={formData.Nomor_Surat_Tugas} onChange={handleInputChange} disabled={isDetailMode}/>
                </div>

              </div>
              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>{isDetailMode ? 'Tutup' : 'Batal'}</button>
                {!isDetailMode && <button type="submit" className="btn-save"><Save size={16}/> Simpan</button>}
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JadwalUji;