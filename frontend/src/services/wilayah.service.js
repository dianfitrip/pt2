import axios from "axios";

const API_URL = "http://localhost:3000/api/public";

export const getProvinsi = async () => {
  const res = await axios.get(`${API_URL}/provinsi`);
  return res.data;
};

export const getKota = async (id) => {
  const res = await axios.get(`${API_URL}/kota/${id}`);
  return res.data;
};

export const getKecamatan = async (id) => {
  const res = await axios.get(`${API_URL}/kecamatan/${id}`);
  return res.data;
};

export const getKelurahan = async (id) => {
  const res = await axios.get(`${API_URL}/kelurahan/${id}`);
  return res.data;
};
