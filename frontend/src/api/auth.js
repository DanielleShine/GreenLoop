import axios from "redaxios";
import { getEndpoint } from "../utils/Helper";

export const signInUser = async (userData) => {
  console.log("userData: ", userData);
  console.log("getEndPoint: ", getEndpoint);
  return await axios.post(`${getEndpoint}/api/sign-in`, userData);
};

export const signUpUser = async (userData) => {
  return await axios.post(`${getEndpoint}/api/sign-up`, userData);
};
