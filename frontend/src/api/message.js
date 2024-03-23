import axios from "redaxios";
import { getEndpoint } from "../utils/Helper";

export const sendUserMessage = async (newMessage) => {
  return axios.post(`${getEndpoint}/api/message`, newMessage);
};

export const updateHasReadMessage = async (messageId) => {
  return axios.get(`${getEndpoint}/api/message/${messageId}`);
};
