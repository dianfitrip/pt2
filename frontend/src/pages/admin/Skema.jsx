import React, { useState, useEffect } from 'react';
import Swal from 'sweetalert2';
import api from "../../services/api";
import * as XLSX from 'xlsx';
import { 
  Search, Plus, Eye, Edit2, Trash2, X, Save, Download, Upload,
  FileText, Loader2, BookOpen, Layers, FileCheck, Globe
} from 'lucide-react';
import './adminstyles/Skema.css'; 

const Skema = () => {
  // --- STATE ---
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // Modal State
  const [showModal, setShowModal] = useState(false);
  const [showImportModal, setShowImportModal] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentId, setCurrentId] = useState(null);

  // State Form (Sesuai Model Database)
  const initialFormState = {
    kode_skema: '',
    judul_skema: '',
    judul_skema_en: '',
    jenis_skema: 'kkni', // Default Enum
    level_kkni: '',
    bidang_okupasi: '',
    kode_sektor: '',
    kode_kbli: '',
    kode_kbji: '',
    keterangan_bukti: '',
    skor_min_ai05: 0,
    kedalaman_bukti: 'elemen_kompetensi', // Default Enum
    dokumen: '', // String path/link
    status: 'draft' // Default Enum
  };

  const [formData, setFormData] = useState(initialFormState);

  // --- FETCH DATA ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get('/admin/skema');
      const skemaData = response.data.data || [];
      setData(skemaData);
    } catch (error) {
      console.error("Error fetching data:", error);
      Swal.fire('Error', 'Gagal memuat data skema.', 'error');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // --- FILTER ---
  const filteredData = data.filter(item => 
    (item.judul_skema && item.judul_skema.toLowerCase().includes(searchTerm.toLowerCase())) ||
    (item.kode_skema && item.kode_skema.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  // --- HANDLERS ---
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validasi Sederhana
    if (!formData.kode_skema || !formData.judul_skema) {
      Swal.fire('Peringatan', 'Kode dan Judul Skema wajib diisi!', 'warning');
      return;
    }

    try {
      Swal.fire({ title: 'Menyimpan...', didOpen: () => Swal.showLoading() });

      // Sanitasi Payload
      const payload = {
        ...formData,
        level_kkni: formData.level_kkni ? parseInt(formData.level_kkni) : null,
        skor_min_ai05: formData.skor_min_ai05 ? parseInt(formData.skor_min_ai05) : 0,
      };

      if (isEditMode) {
        await api.put(`/admin/skema/${currentId}`, payload);
        Swal.fire('Sukses', 'Data Skema diperbarui', 'success');
      } else {
        await api.post('/admin/skema', payload);
        Swal.fire('Sukses', 'Skema baru ditambahkan', 'success');
      }

      setShowModal(false);
      fetchData();
      resetForm();

    } catch (error) {
      console.error("Submit error:", error);
      const msg = error.response?.data?.message || 'Gagal menyimpan data';
      Swal.fire('Gagal', msg, 'error');
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: 'Hapus Skema?',
      text: "Data tidak dapat dikembalikan!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#d33',
      confirmButtonText: 'Ya, Hapus!'
    });

    if (result.isConfirmed) {
      try {
        await api.delete(`/admin/skema/${id}`);
        Swal.fire('Terhapus!', 'Data berhasil dihapus.', 'success');
        fetchData();
      } catch (error) {
        Swal.fire('Gagal', 'Gagal menghapus data.', 'error');
      }
    }
  };

  // --- HELPERS ---
  const resetForm = () => {
    setFormData(initialFormState);
    setIsEditMode(false);
    setCurrentId(null);
  };

  const handleAdd = () => {
    resetForm();
    setShowModal(true);
  };

  const handleEdit = (item) => {
    setIsEditMode(true);
    setCurrentId(item.id_skema);
    setFormData({
      kode_skema: item.kode_skema || '',
      judul_skema: item.judul_skema || '',
      judul_skema_en: item.judul_skema_en || '',
      jenis_skema: item.jenis_skema || 'kkni',
      level_kkni: item.level_kkni || '',
      bidang_okupasi: item.bidang_okupasi || '',
      kode_sektor: item.kode_sektor || '',
      kode_kbli: item.kode_kbli || '',
      kode_kbji: item.kode_kbji || '',
      keterangan_bukti: item.keterangan_bukti || '',
      skor_min_ai05: item.skor_min_ai05 || 0,
      kedalaman_bukti: item.kedalaman_bukti || 'elemen_kompetensi',
      dokumen: item.dokumen || '',
      status: item.status || 'draft'
    });
    setShowModal(true);
  };

  const handleExport = () => {
    const ws = XLSX.utils.json_to_sheet(data);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Data Skema");
    XLSX.writeFile(wb, "Data_Skema_LSP.xlsx");
  };

  return (
    <div className="skema-container">
      {/* HEADER */}
      <div className="header-section">
        <div className="title-box">
          <h2 className="page-title">Data Skema Sertifikasi</h2>
          <p className="page-subtitle">Kelola skema sertifikasi KKNI, Okupasi, dan Klaster</p>
        </div>
        <div className="action-buttons-group">
          <button className="btn-create" onClick={handleAdd}><Plus size={18} /> Tambah Skema</button>
          <button className="btn-export" onClick={handleExport}><Download size={18} /> Export</button>
          {/* <button className="btn-import" onClick={() => setShowImportModal(true)}><Upload size={18} /> Import</button> */}
        </div>
      </div>

      {/* FILTER */}
      <div className="filter-box">
        <div className="search-wrapper">
          <Search className="search-icon" size={20} />
          <input 
            type="text" 
            placeholder="Cari Judul atau Kode Skema..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* TABLE */}
      {loading ? (
        <div className="loading-state"><Loader2 className="animate-spin" /> Memuat Data...</div>
      ) : (
        <div className="table-wrapper">
          <table className="custom-table">
            <thead>
              <tr>
                <th>No</th>
                <th>Kode</th>
                <th>Judul Skema</th>
                <th>Jenis</th>
                <th>Level</th>
                <th>Status</th>
                <th>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {filteredData.length > 0 ? (
                filteredData.map((item, index) => (
                  <tr key={item.id_skema || index}>
                    <td>{index + 1}</td>
                    <td><span className="font-mono font-bold text-blue-600">{item.kode_skema}</span></td>
                    <td>
                      <div className="font-semibold text-gray-800">{item.judul_skema}</div>
                      {item.judul_skema_en && <div className="text-xs text-gray-500 italic">{item.judul_skema_en}</div>}
                    </td>
                    <td style={{textTransform: 'uppercase'}}>{item.jenis_skema}</td>
                    <td className="text-center">{item.level_kkni || '-'}</td>
                    <td>
                      <span className={`badge status-${item.status}`}>
                        {item.status}
                      </span>
                    </td>
                    <td>
                      <div className="action-group">
                        <button className="btn-icon btn-edit" onClick={() => handleEdit(item)}><Edit2 size={16}/></button>
                        <button className="btn-icon btn-delete" onClick={() => handleDelete(item.id_skema)}><Trash2 size={16}/></button>
                      </div>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="7" className="text-center py-8 text-gray-500">Data tidak ditemukan.</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {/* MODAL FORM */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content modal-xl">
            <div className="modal-header">
              <h3>{isEditMode ? 'Edit Skema' : 'Tambah Skema Baru'}</h3>
              <button className="btn-close" onClick={() => setShowModal(false)}><X size={20}/></button>
            </div>
            
            <form onSubmit={handleSubmit}>
              <div className="modal-body-scroll">
                
                {/* SECTION 1: INFORMASI DASAR */}
                <div className="form-section-label"><Layers size={14}/> Identitas Skema</div>
                <div className="grid-2-col">
                  <div className="form-group">
                    <label>Kode Skema *</label>
                    <input name="kode_skema" value={formData.kode_skema} onChange={handleChange} required placeholder="Misal: SKM/LSP/001"/>
                  </div>
                  <div className="form-group">
                    <label>Status Skema</label>
                    <select name="status" value={formData.status} onChange={handleChange}>
                      <option value="draft">Draft</option>
                      <option value="aktif">Aktif</option>
                      <option value="nonaktif">Non-Aktif</option>
                    </select>
                  </div>
                </div>
                <div className="form-group">
                  <label>Judul Skema (Indonesia) *</label>
                  <input name="judul_skema" value={formData.judul_skema} onChange={handleChange} required />
                </div>
                <div className="form-group">
                  <label>Judul Skema (Inggris)</label>
                  <input name="judul_skema_en" value={formData.judul_skema_en} onChange={handleChange} placeholder="Optional" />
                </div>

                {/* SECTION 2: KLASIFIKASI */}
                <div className="form-section-label mt-4"><BookOpen size={14}/> Klasifikasi & Sektor</div>
                <div className="grid-3-col">
                  <div className="form-group">
                    <label>Jenis Skema *</label>
                    <select name="jenis_skema" value={formData.jenis_skema} onChange={handleChange}>
                      <option value="kkni">KKNI</option>
                      <option value="okupasi">Okupasi</option>
                      <option value="klaster">Klaster</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Level KKNI</label>
                    <input type="number" name="level_kkni" value={formData.level_kkni} onChange={handleChange} placeholder="1-9" />
                  </div>
                  <div className="form-group">
                    <label>Kode Sektor</label>
                    <input name="kode_sektor" value={formData.kode_sektor} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Bidang Okupasi</label>
                  <input name="bidang_okupasi" value={formData.bidang_okupasi} onChange={handleChange} />
                </div>
                <div className="grid-2-col">
                  <div className="form-group">
                    <label>Kode KBLI</label>
                    <input name="kode_kbli" value={formData.kode_kbli} onChange={handleChange} />
                  </div>
                  <div className="form-group">
                    <label>Kode KBJI</label>
                    <input name="kode_kbji" value={formData.kode_kbji} onChange={handleChange} />
                  </div>
                </div>

                {/* SECTION 3: PENGATURAN ASESMEN */}
                <div className="form-section-label mt-4"><FileCheck size={14}/> Parameter Asesmen</div>
                <div className="grid-2-col">
                  <div className="form-group">
                    <label>Kedalaman Bukti</label>
                    <select name="kedalaman_bukti" value={formData.kedalaman_bukti} onChange={handleChange}>
                      <option value="elemen_kompetensi">Elemen Kompetensi</option>
                      <option value="kriteria_unjuk_kerja">Kriteria Unjuk Kerja</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Skor Min. AI 05</label>
                    <input type="number" name="skor_min_ai05" value={formData.skor_min_ai05} onChange={handleChange} />
                  </div>
                </div>
                <div className="form-group">
                  <label>Keterangan Bukti</label>
                  <textarea name="keterangan_bukti" rows="3" value={formData.keterangan_bukti} onChange={handleChange}></textarea>
                </div>
                
                <div className="form-group">
                  <label>Link Dokumen (G-Drive / URL)</label>
                  <input type="text" name="dokumen" value={formData.dokumen} onChange={handleChange} placeholder="https://..." />
                </div>

              </div>

              <div className="modal-footer">
                <button type="button" className="btn-cancel" onClick={() => setShowModal(false)}>Batal</button>
                <button type="submit" className="btn-save"><Save size={16}/> Simpan</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Skema;