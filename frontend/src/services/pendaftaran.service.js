import axios from "axios";

const API_URL = "http://localhost:3000/api/public";

export const submitPendaftaran = async (data) => {
  const res = await axios.post(`${API_URL}/pendaftaran`, data);
  return res.data;
};
