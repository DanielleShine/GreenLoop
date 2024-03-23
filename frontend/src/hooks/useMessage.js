import { useQuery } from "@tanstack/react-query";
import { getMessages } from "../api/conversation";

export const useMessage = (conversationId, userId, receiverId) => {
  const { data, isLoading, error } = useQuery({
    queryKey: ["messages"],
    queryFn: () => getMessages(conversationId, userId, receiverId),
  });

  return { data, isLoading, error };
};
