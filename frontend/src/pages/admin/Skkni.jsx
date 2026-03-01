import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";
import { FaPlus, FaSearch, FaEdit, FaTrash, FaEye, FaTimes, FaSave, FaFileAlt } from "react-icons/fa";
import "./adminstyles/Skkni.css";

const Skkni = () => {
  // --- STATE ---
  const [dataList, setDataList] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchTerm, setSearchTerm] = useState("");

  // State Modal Form (Create/Edit)
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Modal Detail
  const [showDetailModal, setShowDetailModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState(null);

  // State Form Data (Sesuai Model Backend)
  const [formData, setFormData] = useState({
    jenis_standar: "SKKNI",
    no_skkni: "",
    judul_skkni: "",
    legalitas: "",
    sektor: "",
    sub_sektor: "",
    penerbit: "",
  });

  // State khusus file upload
  const [dokumenFile, setDokumenFile] = useState(null);

  // Load Data
  useEffect(() => {
    fetchData();
  }, []);

  // --- API FUNCTIONS ---
  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/skkni");
      // Urutkan manual berdasarkan ID descending (karena timestamps: false)
      const sortedData = (response.data.data || []).sort((a, b) => b.id_skkni - a.id_skkni);
      setDataList(sortedData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // --- HANDLERS ---
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e) => {
    setDokumenFile(e.target.files[0]);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({
      jenis_standar: "SKKNI",
      no_skkni: "",
      judul_skkni: "",
      legalitas: "",
      sektor: "",
      sub_sektor: "",
      penerbit: "",
    });
    setDokumenFile(null);
    setShowModal(true);
  };

  const openEditModal = (item) => {
    setIsEditing(true);
    setEditId(item.id_skkni);
    setFormData({
      jenis_standar: item.jenis_standar || "SKKNI",
      no_skkni: item.no_skkni || "",
      judul_skkni: item.judul_skkni || "",
      legalitas: item.legalitas || "",
      sektor: item.sektor || "",
      sub_sektor: item.sub_sektor || "",
      penerbit: item.penerbit || "",
    });
    setDokumenFile(null); 
    setSelectedItem(item); 
    setShowModal(true);
  };

  const openDetailModal = (item) => {
    setSelectedItem(item);
    setShowDetailModal(true);
  };

  // --- SUBMIT (CREATE / UPDATE) ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi Input Wajib
    if (!formData.no_skkni || !formData.judul_skkni) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Pastikan No SKKNI dan Judul SKKNI telah diisi.",
      });
      return;
    }

    // 2. Konfirmasi
    const confirmResult = await Swal.fire({
      title: isEditing ? "Simpan Perubahan?" : "Tambah Data Baru?",
      text: isEditing 
        ? "Pastikan data yang diubah sudah benar." 
        : "Apakah Anda yakin ingin menyimpan data ini?",
      icon: "question",
      showCancelButton: true,
      confirmButtonText: isEditing ? "Ya, Update" : "Ya, Simpan",
      confirmButtonColor: "#2563eb",
      cancelButtonText: "Batal",
    });

    if (!confirmResult.isConfirmed) return;

    // 3. Prepare FormData
    const payload = new FormData();
    
    // Append text fields
    Object.keys(formData).forEach((key) => {
      payload.append(key, formData[key]);
    });

    // Append File dengan nama field 'file_dokumen' (SESUAI BACKEND)
    if (dokumenFile) {
      payload.append("file_dokumen", dokumenFile);
    }

    try {
      Swal.fire({
        title: "Sedang Memproses...",
        allowOutsideClick: false,
        didOpen: () => Swal.showLoading(),
      });

      if (isEditing) {
        // Update
        await api.put(`/admin/skkni/${editId}`, payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Berhasil!", "Data SKKNI berhasil diperbarui.", "success");
      } else {
        // Create
        await api.post("/admin/skkni", payload, {
          headers: { "Content-Type": "multipart/form-data" },
        });
        Swal.fire("Berhasil!", "Data SKKNI berhasil ditambahkan.", "success");
      }

      setShowModal(false);
      fetchData();

    } catch (err) {
      console.error(err);
      Swal.fire({
        icon: "error",
        title: "Gagal",
        text: err.response?.data?.message || "Terjadi kesalahan server.",
      });
    }
  };

  // --- DELETE ---
  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Apakah Anda Yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#ef4444",
      cancelButtonColor: "#64748b",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    if (result.isConfirmed) {
      try {
        Swal.fire({
            title: "Menghapus...",
            allowOutsideClick: false,
            didOpen: () => Swal.showLoading() 
        });
        
        await api.delete(`/admin/skkni/${id}`);
        Swal.fire("Terhapus!", "Data SKKNI telah dihapus.", "success");
        fetchData();
      } catch (err) {
        Swal.fire("Gagal", "Gagal menghapus data.", "error");
      }
    }
  };

  // --- FILTERING ---
  const filteredData = dataList.filter((item) =>
    (item.judul_skkni || "").toLowerCase().includes(searchTerm.toLowerCase()) ||
    (item.no_skkni || "").toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="skkni-container">
      
      {/* HEADER */}
      <div className="header-section">
        <div className="title-box">
          <h2>Data SKKNI</h2>
          <p>Kelola Standar Kompetensi Kerja Nasional Indonesia</p>
        </div>
        <button onClick={openCreateModal} className="btn-create">
          <FaPlus /> Tambah Data
        </button>
      </div>

      {/* SEARCH & TABLE */}
      <div className="mb-4">
        <div className="search-box">
          <FaSearch className="search-icon" />
          <input
            type="text"
            className="search-input"
            placeholder="Cari Judul atau No SKKNI..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="table-container">
        <table>
          <thead>
            <tr>
              <th style={{width: "50px"}}>No</th>
              <th style={{width: "180px"}}>Nomor SKKNI</th>
              <th>Judul SKKNI</th>
              <th>Jenis</th>
              <th>Sektor</th>
              <th style={{textAlign: "center", width: "320px"}}>Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="6" className="text-center py-8">Loading data...</td>
              </tr>
            ) : filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <tr key={item.id_skkni}>
                  <td>{index + 1}</td>
                  <td className="font-mono text-sm">{item.no_skkni}</td>
                  <td className="font-medium">{item.judul_skkni}</td>
                  <td>
                    {/* Mapping tampilan jenis standar agar lebih user friendly jika perlu */}
                    {item.jenis_standar === 'SI' ? 'Standar Int.' : 
                     item.jenis_standar === 'SKK' ? 'SKK Khusus' : item.jenis_standar}
                  </td>
                  <td>{item.sektor || "-"}</td>
                  <td>
                    <div className="action-buttons justify-center">
                      <button 
                        className="btn-action btn-detail" 
                        onClick={() => openDetailModal(item)}
                        title="Lihat Detail"
                      >
                        <FaEye /> Detail
                      </button>
                      <button 
                        className="btn-action btn-edit" 
                        onClick={() => openEditModal(item)}
                        title="Edit Data"
                      >
                        <FaEdit /> Edit
                      </button>
                      <button 
                        className="btn-action btn-delete" 
                        onClick={() => handleDelete(item.id_skkni)}
                        title="Hapus Data"
                      >
                        <FaTrash /> Hapus
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="6" className="text-center py-8 text-gray-500">
                  Tidak ada data ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* --- MODAL FORM (CREATE / EDIT) --- */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <form onSubmit={handleSubmit}>
              <div className="modal-header">
                <h3>
                  {isEditing ? <FaEdit className="text-amber-500"/> : <FaPlus className="text-blue-500"/>}
                  {isEditing ? "Edit Data SKKNI" : "Tambah Data SKKNI"}
                </h3>
                <button type="button" className="btn-close" onClick={() => setShowModal(false)}>
                  <FaTimes />
                </button>
              </div>
              
              <div className="modal-body">
                <div className="form-grid">
                  <div className="form-group">
                    <label>Jenis Standar <span className="text-red-500">*</span></label>
                    <select 
                      name="jenis_standar" 
                      value={formData.jenis_standar} 
                      onChange={handleInputChange} 
                      className="form-control"
                    >
                      {/* VALUE HARUS SESUAI ENUM BACKEND (SKKNI, SKK, SI) */}
                      <option value="SKKNI">SKKNI</option>
                      <option value="SKK">SKK Khusus</option>
                      <option value="SI">Standar Internasional</option>
                    </select>
                  </div>

                  <div className="form-group">
                    <label>Nomor SKKNI <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="no_skkni"
                      value={formData.no_skkni}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Contoh: 123 Tahun 2023"
                      required
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Judul SKKNI <span className="text-red-500">*</span></label>
                    <input
                      type="text"
                      name="judul_skkni"
                      value={formData.judul_skkni}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Masukkan Judul Lengkap"
                      required
                    />
                  </div>

                  <div className="form-group">
                    <label>Sektor</label>
                    <input
                      type="text"
                      name="sektor"
                      value={formData.sektor}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Contoh: Teknologi Informasi"
                    />
                  </div>

                  <div className="form-group">
                    <label>Sub Sektor</label>
                    <input
                      type="text"
                      name="sub_sektor"
                      value={formData.sub_sektor}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Contoh: Rekayasa Perangkat Lunak"
                    />
                  </div>

                  <div className="form-group">
                    <label>Legalitas (Nomor Keputusan)</label>
                    <input
                      type="text"
                      name="legalitas"
                      value={formData.legalitas}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Nomor Keputusan Menteri..."
                    />
                  </div>

                  <div className="form-group">
                    <label>Penerbit</label>
                    <input
                      type="text"
                      name="penerbit"
                      value={formData.penerbit}
                      onChange={handleInputChange}
                      className="form-control"
                      placeholder="Contoh: Kemenaker"
                    />
                  </div>

                  <div className="form-group full-width">
                    <label>Upload Dokumen (PDF/Doc)</label>
                    <input
                      type="file"
                      onChange={handleFileChange}
                      className="form-control"
                      accept=".pdf,.doc,.docx"
                    />
                    {isEditing && selectedItem?.dokumen && (
                      <p className="file-info">
                        File saat ini: <strong>{selectedItem.dokumen}</strong> <br/>
                        (Biarkan kosong jika tidak ingin mengubah file)
                      </p>
                    )}
                  </div>
                </div>
              </div>

              <div className="modal-footer">
                <button type="button" className="btn-action" style={{backgroundColor: '#94a3b8'}} onClick={() => setShowModal(false)}>
                  Batal
                </button>
                <button type="submit" className="btn-action" style={{backgroundColor: '#2563eb'}}>
                  <FaSave /> {isEditing ? "Update Data" : "Simpan Data"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* --- MODAL DETAIL --- */}
      {showDetailModal && selectedItem && (
        <div className="modal-overlay">
          <div className="modal-content">
            <div className="modal-header">
              <h3><FaEye className="text-sky-500"/> Detail Data SKKNI</h3>
              <button className="btn-close" onClick={() => setShowDetailModal(false)}><FaTimes /></button>
            </div>
            <div className="modal-body">
              <div className="detail-grid">
                <div className="detail-item">
                    <label>Jenis Standar</label>
                    <p>{selectedItem.jenis_standar}</p>
                </div>
                <div className="detail-item">
                    <label>Nomor SKKNI</label>
                    <p>{selectedItem.no_skkni}</p>
                </div>
                <div className="detail-item" style={{gridColumn: "span 2"}}>
                    <label>Judul SKKNI</label>
                    <p>{selectedItem.judul_skkni}</p>
                </div>
                <div className="detail-item">
                    <label>Sektor</label>
                    <p>{selectedItem.sektor || "-"}</p>
                </div>
                <div className="detail-item">
                    <label>Sub Sektor</label>
                    <p>{selectedItem.sub_sektor || "-"}</p>
                </div>
                <div className="detail-item">
                    <label>Legalitas</label>
                    <p>{selectedItem.legalitas || "-"}</p>
                </div>
                <div className="detail-item">
                    <label>Penerbit</label>
                    <p>{selectedItem.penerbit || "-"}</p>
                </div>
                <div className="detail-item" style={{gridColumn: "span 2"}}>
                    <label>Dokumen</label>
                    {selectedItem.dokumen ? (
                        <div className="flex items-center gap-2 mt-2">
                            <FaFileAlt className="text-red-500" size={20}/>
                            <span className="text-gray-700">{selectedItem.dokumen}</span>
                            {/* Tambahkan link download/preview jika URL tersedia dari backend (misal /uploads/namafile) */}
                        </div>
                    ) : (
                        <p className="text-gray-400 italic">Tidak ada dokumen diupload.</p>
                    )}
                </div>
              </div>
            </div>
            <div className="modal-footer">
                <button className="btn-action" style={{backgroundColor: '#64748b'}} onClick={() => setShowDetailModal(false)}>
                    Tutup
                </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};

export default Skkni;