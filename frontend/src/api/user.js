import axios from "redaxios";
import { getEndpoint } from "../utils/Helper";

export const fetchUser = async (userId) => {
  return axios.get(`${getEndpoint}/api/users/${userId}`);
};

export const fetchUsers = async () => {
  return axios.get(`${getEndpoint}/api/users`);
};

export const updateUser = async (userId, user) => {
  return axios.put(`${getEndpoint}/api/users/${userId}`, user);
};

export const createUser = async (user) => {
  return axios.post(`${getEndpoint}/api/sign-up`, user);
};

export const deleteUser = async (userId) => {
  return axios.delete(`${getEndpoint}/api/users/${userId}`);
};

export const signOutUser = async (userId) => {
  return axios.patch(`${getEndpoint}/api/sign-out/${userId}`);
};
