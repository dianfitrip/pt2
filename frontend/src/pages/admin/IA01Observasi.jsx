import React, { useState, useEffect } from "react";
import api from "../../services/api";

const IA01Observasi = () => {
  // State untuk pencarian & tabel
  const [searchQuery, setSearchQuery] = useState("");
  const [dataList, setDataList] = useState([]);
  
  // State untuk Modal Form Tambah Data
  const [showModal, setShowModal] = useState(false);
  const [unitList, setUnitList] = useState([]); 
  
  // State status
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState({ type: "", text: "" });

  const [formData, setFormData] = useState({
    id_unit: "",
    id_kuk: "",
    elemen: "",
    kuk: "",
    urutan: ""
  });

  // Ambil data Unit Kompetensi KHUSUS untuk Dropdown di dalam Modal
  useEffect(() => {
    const fetchUnits = async () => {
      try {
        const response = await api.get("/admin/unit-kompetensi");
        setUnitList(response.data.data || []);
      } catch (err) {
        console.error("Gagal mengambil data Unit Kompetensi");
      }
    };
    fetchUnits();
  }, []);

  // FUNGSI SEARCH (Memanggil data berdasarkan ID Unit yang diketik)
  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    if (!searchQuery) return alert("Ketik ID Unit (angka) di kolom pencarian terlebih dahulu!");

    setLoading(true);
    setMessage({ type: "", text: "" });
    try {
      const response = await api.get(`/admin/ia01-observasi/unit/${searchQuery}`);
      setDataList(response.data.data || []);
      if (response.data.data?.length === 0) {
        setMessage({ type: "error", text: "Data tidak ditemukan untuk pencarian tersebut." });
      }
    } catch (err) {
      setMessage({ type: "error", text: "Gagal mengambil data. Pastikan kamu mengetik ID Unit yang benar." });
      setDataList([]);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  // Submit Data Baru via Modal
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!formData.id_unit) return alert("Pilih Unit Kompetensi terlebih dahulu.");

    try {
      setLoading(true);
      
      const payload = {
        id_unit: parseInt(formData.id_unit, 10),
        id_kuk: formData.id_kuk ? parseInt(formData.id_kuk, 10) : null,
        elemen: formData.elemen,
        kuk: formData.kuk,
        urutan: parseInt(formData.urutan, 10)
      };

      await api.post("/admin/ia01-observasi", payload);
      
      setMessage({ type: "success", text: "Data observasi berhasil ditambahkan!" });
      setFormData({ id_unit: "", id_kuk: "", elemen: "", kuk: "", urutan: "" });
      setShowModal(false); // Tutup modal setelah sukses
      
      // Jika data yang baru ditambah sesuai dengan hasil pencarian saat ini, auto refresh tabelnya
      if (searchQuery == payload.id_unit) {
        handleSearch();
      }
    } catch (err) {
      setMessage({ type: "error", text: err.response?.data?.message || "Gagal menambah data" });
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id_observasi) => {
    if (!window.confirm("Yakin ingin menghapus data ini?")) return;

    try {
      setLoading(true);
      await api.delete(`/admin/ia01-observasi/${id_observasi}`);
      setMessage({ type: "success", text: "Data berhasil dihapus!" });
      handleSearch(); // Refresh tabel
    } catch (err) {
      setMessage({ type: "error", text: "Gagal menghapus data" });
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <div className="flex flex-col md:flex-row justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-800">Data IA.01 Observasi</h2>
      </div>

      {message.text && (
        <div className={`p-4 mb-4 text-white rounded ${message.type === "error" ? "bg-red-500" : "bg-green-500"}`}>
          {message.text}
        </div>
      )}

      <div className="bg-white p-6 rounded-lg shadow-md">
        {/* TOOLBAR: SEARCH & TOMBOL TAMBAH */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-6 gap-4 border-b pb-4">
          
          {/* Form Search Biasa */}
          <form onSubmit={handleSearch} className="flex w-full md:w-1/2 lg:w-1/3">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Ketik ID Unit (Contoh: 1, 2)..."
              className="w-full border border-gray-300 rounded-l-lg p-2 focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
            <button type="submit" className="bg-gray-800 text-white px-4 py-2 rounded-r-lg hover:bg-gray-900 transition">
              {loading ? "..." : "Cari"}
            </button>
          </form>

          {/* Tombol Tambah Data */}
          <button 
            onClick={() => setShowModal(true)} 
            className="w-full md:w-auto bg-blue-600 text-white px-5 py-2 rounded-lg hover:bg-blue-700 transition shadow"
          >
            + Tambah Data
          </button>
        </div>

        {/* TABEL DATA */}
        <div className="overflow-x-auto">
          <table className="w-full text-sm text-left border text-gray-600">
            <thead className="bg-gray-100 text-gray-700 uppercase">
              <tr>
                <th className="px-4 py-3 border w-16 text-center">Urutan</th>
                <th className="px-4 py-3 border">ID KUK</th>
                <th className="px-4 py-3 border">Elemen</th>
                <th className="px-4 py-3 border">KUK</th>
                <th className="px-4 py-3 border text-center w-24">Aksi</th>
              </tr>
            </thead>
            <tbody>
              {dataList.length > 0 ? (
                dataList.map((item) => (
                  <tr key={item.id_observasi} className="border-b hover:bg-gray-50">
                    <td className="px-4 py-3 border text-center font-semibold">{item.urutan}</td>
                    <td className="px-4 py-3 border text-center">{item.id_kuk || "-"}</td>
                    <td className="px-4 py-3 border">{item.elemen}</td>
                    <td className="px-4 py-3 border">{item.kuk}</td>
                    <td className="px-4 py-3 border text-center">
                      <button 
                        onClick={() => handleDelete(item.id_observasi)} 
                        className="bg-red-500 text-white px-3 py-1 rounded text-xs hover:bg-red-600"
                      >
                        Hapus
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center py-8 text-gray-500">
                    {searchQuery ? "Data tidak ditemukan." : "Silakan ketik ID Unit di kolom pencarian untuk menampilkan data."}
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL TAMBAH DATA (POP-UP) */}
      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 px-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-xl overflow-hidden">
            <div className="px-6 py-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="text-lg font-bold text-gray-800">Tambah Observasi Baru</h3>
              <button onClick={() => setShowModal(false)} className="text-gray-500 hover:text-red-500 text-2xl font-bold leading-none">&times;</button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
              {/* Dropdown Unit */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Pilih Unit Kompetensi</label>
                <select
                  name="id_unit"
                  value={formData.id_unit}
                  onChange={handleChange}
                  className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200"
                  required
                >
                  <option value="">-- Pilih Unit Kompetensi --</option>
                  {unitList.map((unit) => (
                    <option key={unit.id_unit} value={unit.id_unit}>
                      {unit.kode_unit} - {unit.judul_unit}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">ID KUK (Opsional)</label>
                <input type="number" name="id_kuk" value={formData.id_kuk} onChange={handleChange} placeholder="Kosongkan jika tidak ada" className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Elemen</label>
                <textarea name="elemen" value={formData.elemen} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200" rows="2" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">KUK</label>
                <textarea name="kuk" value={formData.kuk} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200" rows="3" required></textarea>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Urutan</label>
                <input type="number" name="urutan" value={formData.urutan} onChange={handleChange} className="w-full border border-gray-300 rounded p-2 focus:ring focus:ring-blue-200" required />
              </div>
              
              <div className="pt-4 flex gap-3 justify-end border-t mt-4">
                <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 bg-gray-200 text-gray-800 rounded hover:bg-gray-300">Batal</button>
                <button type="submit" disabled={loading} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700">Simpan Data</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default IA01Observasi;