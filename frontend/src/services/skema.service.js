import axios from "axios";

const API_URL = "http://localhost:3000/api/public";

export const getSkema = async () => {
  const response = await axios.get(`${API_URL}/skema`);
  return response.data.data; 
};
