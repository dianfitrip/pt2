import React, { useState, useEffect } from "react";
import api from "../../services/api";
import Swal from "sweetalert2";

const UnitKompetensi = () => {
  const [dataList, setDataList] = useState([]);
  const [skkniList, setSkkniList] = useState([]);
  const [loading, setLoading] = useState(false);

  // State untuk Mode Edit
  const [isEditing, setIsEditing] = useState(false);
  const [editId, setEditId] = useState(null);

  // State Form
  const [formData, setFormData] = useState({
    id_skkni: "",
    kode_unit: "",
    judul_unit: ""
  });

  // Load data awal
  useEffect(() => {
    fetchData();
    fetchSkkni();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      const response = await api.get("/admin/unit-kompetensi");
      setDataList(response.data.data || []);
    } catch (err) {
      console.error(err);
      // Error fetch data tidak perlu popup besar, cukup log atau toast kecil
    } finally {
      setLoading(false);
    }
  };

  const fetchSkkni = async () => {
    try {
      const response = await api.get("/admin/skkni");
      setSkkniList(response.data.data || []);
    } catch (err) {
      console.error("Gagal ambil SKKNI", err);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value
    }));
  };

  // --- LOGIKA TOMBOL SIMPAN / UPDATE ---
  const handleSubmit = async (e) => {
    e.preventDefault();

    // 1. Validasi Input Kosong
    if (!formData.id_skkni || !formData.kode_unit || !formData.judul_unit) {
      Swal.fire({
        icon: "warning",
        title: "Data Belum Lengkap",
        text: "Mohon lengkapi semua field (SKKNI, Kode Unit, Judul Unit).",
        confirmButtonColor: "#3085d6",
      });
      return;
    }

    // 2. Tentukan Pesan Konfirmasi (Create vs Update)
    const actionTitle = isEditing ? "Simpan Perubahan?" : "Tambah Data Baru?";
    const actionText = isEditing 
      ? "Apakah Anda yakin ingin menyimpan perubahan pada data ini?" 
      : "Apakah Anda yakin ingin menambahkan data unit kompetensi ini?";
    const confirmButtonText = isEditing ? "Ya, Update!" : "Ya, Simpan!";

    // 3. Tampilkan SweetAlert Konfirmasi
    const result = await Swal.fire({
      title: actionTitle,
      text: actionText,
      icon: "question",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: confirmButtonText,
      cancelButtonText: "Batal",
    });

    // 4. Jika User Klik "Ya"
    if (result.isConfirmed) {
      try {
        // Tampilkan Loading saat proses request
        Swal.fire({
          title: "Memproses Data...",
          text: "Mohon tunggu sebentar.",
          allowOutsideClick: false,
          didOpen: () => {
            Swal.showLoading();
          },
        });

        if (isEditing) {
          // Request Update (PUT)
          await api.put(`/admin/unit-kompetensi/${editId}`, formData);
          
          Swal.fire({
            icon: "success",
            title: "Berhasil Diperbarui!",
            text: "Data unit kompetensi berhasil diupdate.",
            timer: 2000,
            showConfirmButton: false,
          });
        } else {
          // Request Create (POST)
          await api.post("/admin/unit-kompetensi", formData);
          
          Swal.fire({
            icon: "success",
            title: "Berhasil Ditambahkan!",
            text: "Data unit kompetensi baru berhasil disimpan.",
            timer: 2000,
            showConfirmButton: false,
          });
        }

        // Reset & Refresh
        resetForm();
        fetchData();

      } catch (err) {
        console.error(err);
        Swal.fire({
          icon: "error",
          title: "Gagal!",
          text: err.response?.data?.message || "Terjadi kesalahan saat menyimpan data.",
        });
      }
    }
  };

  // --- LOGIKA EDIT ---
  const handleEdit = (item) => {
    setIsEditing(true);
    setEditId(item.id_unit);
    setFormData({
      id_skkni: item.id_skkni,
      kode_unit: item.kode_unit,
      judul_unit: item.judul_unit
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  // --- LOGIKA HAPUS ---
  const handleDelete = async (id) => {
    // 1. Konfirmasi Hapus
    const result = await Swal.fire({
      title: "Apakah Anda yakin?",
      text: "Data yang dihapus tidak dapat dikembalikan lagi!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Ya, Hapus!",
      cancelButtonText: "Batal",
    });

    // 2. Jika User Klik "Ya"
    if (result.isConfirmed) {
      try {
        Swal.fire({
          title: "Menghapus...",
          allowOutsideClick: false,
          didOpen: () => Swal.showLoading(),
        });

        await api.delete(`/admin/unit-kompetensi/${id}`);
        
        Swal.fire({
          icon: "success",
          title: "Terhapus!",
          text: "Data unit kompetensi telah dihapus.",
          timer: 1500,
          showConfirmButton: false,
        });

        fetchData();
      } catch (err) {
        console.error(err);
        Swal.fire("Gagal", "Terjadi kesalahan saat menghapus data.", "error");
      }
    }
  };

  // Reset form
  const resetForm = () => {
    setIsEditing(false);
    setEditId(null);
    setFormData({ id_skkni: "", kode_unit: "", judul_unit: "" });
  };

  return (
    <div className="p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-xl font-semibold mb-4">Manajemen Unit Kompetensi</h2>

      {/* --- FORM SECTION --- */}
      <form onSubmit={handleSubmit} className="mb-6 p-4 border rounded bg-gray-50 shadow-sm">
        <h3 className="text-lg font-medium mb-3 border-b pb-2 text-gray-700">
          {isEditing ? "Edit Data Unit Kompetensi" : "Tambah Unit Kompetensi Baru"}
        </h3>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
          {/* Dropdown SKKNI */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Pilih SKKNI</label>
            <select
              name="id_skkni"
              value={formData.id_skkni}
              onChange={handleChange}
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">-- Pilih SKKNI --</option>
              {skkniList.map((skkni) => (
                <option key={skkni.id_skkni} value={skkni.id_skkni}>
                  {skkni.judul_skkni}
                </option>
              ))}
            </select>
          </div>

          {/* Input Kode Unit */}
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-700">Kode Unit</label>
            <input
              type="text"
              name="kode_unit"
              value={formData.kode_unit}
              onChange={handleChange}
              placeholder="Contoh: TIK.JK01.001.01"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Input Judul Unit */}
          <div className="md:col-span-2">
            <label className="block text-sm font-medium mb-1 text-gray-700">Judul Unit</label>
            <input
              type="text"
              name="judul_unit"
              value={formData.judul_unit}
              onChange={handleChange}
              placeholder="Masukkan Judul Unit Kompetensi"
              className="w-full border border-gray-300 p-2 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
        </div>

        <div className="flex gap-2">
          <button
            type="submit"
            className={`px-5 py-2 rounded text-white font-medium shadow transition-colors ${
              isEditing 
                ? "bg-green-600 hover:bg-green-700" 
                : "bg-blue-600 hover:bg-blue-700"
            }`}
          >
            {isEditing ? "Update Perubahan" : "Simpan Data"}
          </button>
          
          {(isEditing || formData.kode_unit || formData.judul_unit) && (
            <button
              type="button"
              onClick={resetForm}
              className="px-5 py-2 bg-gray-500 text-white rounded font-medium hover:bg-gray-600 transition-colors shadow"
            >
              Batal
            </button>
          )}
        </div>
      </form>

      {/* --- TABLE SECTION --- */}
      <div className="overflow-x-auto rounded border border-gray-200">
        <table className="w-full border-collapse text-sm bg-white">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-3 border-b text-center font-semibold text-gray-700 w-12">No</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">SKKNI</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700 w-48">Kode Unit</th>
              <th className="px-4 py-3 border-b text-left font-semibold text-gray-700">Judul Unit</th>
              <th className="px-4 py-3 border-b text-center font-semibold text-gray-700 w-32">Aksi</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500">
                  <div className="flex justify-center items-center gap-2">
                    <div className="w-5 h-5 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    Memuat data...
                  </div>
                </td>
              </tr>
            ) : dataList.length > 0 ? (
              dataList.map((item, index) => (
                <tr key={item.id_unit} className="border-b hover:bg-gray-50 transition-colors">
                  <td className="px-4 py-3 text-center text-gray-600">{index + 1}</td>
                  <td className="px-4 py-3 text-gray-700">
                    {item.skkni?.judul_skkni || <span className="text-gray-400 italic">ID: {item.id_skkni}</span>}
                  </td>
                  <td className="px-4 py-3 font-mono text-gray-700">{item.kode_unit}</td>
                  <td className="px-4 py-3 text-gray-700">{item.judul_unit}</td>
                  <td className="px-4 py-3 text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => handleEdit(item)}
                        className="bg-yellow-500 text-white p-2 rounded hover:bg-yellow-600 transition-colors shadow-sm"
                        title="Edit Data"
                      >
                        {/* Ikon Edit (Opsional, pakai text Edit jika tidak ada icon) */}
                        <span className="text-xs font-bold">Edit</span>
                      </button>
                      <button
                        onClick={() => handleDelete(item.id_unit)}
                        className="bg-red-500 text-white p-2 rounded hover:bg-red-600 transition-colors shadow-sm"
                        title="Hapus Data"
                      >
                         {/* Ikon Hapus */}
                         <span className="text-xs font-bold">Hapus</span>
                      </button>
                    </div>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="5" className="text-center py-8 text-gray-500 bg-gray-50 italic">
                  Belum ada data unit kompetensi tersedia.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default UnitKompetensi;