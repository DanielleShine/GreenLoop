import axios from "redaxios";
import { getEndpoint } from "../utils/Helper";

export const fetchWastes = async () => {
  return await axios.get(`${getEndpoint}/api/wastes`);
};

export const uploadPost = async (post) => {
  return axios.post(`${getEndpoint}/api/wastes/new`, post);
};

export const updateWaste = async (wasteId, data) => {
  return await axios.put(`${getEndpoint}/api/wastes/update/${wasteId}`, data);
};

export const deleteWaste = async (wasteId) => {
  return await axios.delete(`${getEndpoint}/api/wastes/${wasteId}`);
};
