const axios = require("axios");

const BASE_URL = "https://emsifa.github.io/api-wilayah-indonesia/api";

exports.getProvinsi = async (req, res) => {
  try {
    const { data } = await axios.get(`${BASE_URL}/provinces.json`);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error getProvinsi:", error.message);
    res.status(500).json({ message: "Gagal mengambil data provinsi" });
  }
};

exports.getKota = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${BASE_URL}/regencies/${id}.json`);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error getKota:", error.message);
    res.status(500).json({ message: "Gagal mengambil data kota" });
  }
};

exports.getKecamatan = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${BASE_URL}/districts/${id}.json`);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error getKecamatan:", error.message);
    res.status(500).json({ message: "Gagal mengambil data kecamatan" });
  }
};

exports.getKelurahan = async (req, res) => {
  try {
    const { id } = req.params;
    const { data } = await axios.get(`${BASE_URL}/villages/${id}.json`);
    res.status(200).json(data);
  } catch (error) {
    console.error("❌ Error getKelurahan:", error.message);
    res.status(500).json({ message: "Gagal mengambil data kelurahan" });
  }
};
