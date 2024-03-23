import io from "socket.io-client";
import { useEffect, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { updateHasReadMessage } from "../api/message";
import { socketPort } from "../utils/Helper";

export const useSocketMessages = (user) => {
  const queryClient = useQueryClient();

  const [socket, setSocket] = useState(null);
  const [newMessages, setNewMessages] = useState([]);
  const [onClickedRead, setOnClickedRead] = useState(false);

  const { mutate: readMessage } = useMutation({
    mutationFn: (messageId) => updateHasReadMessage(messageId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["conversations"] });
    },
  });

  const hasReadMessage = (messageId, all = false) => {
    if (messageId) readMessage(messageId);

    if (all) {
      newMessages?.forEach((message) => {
        readMessage(message?.message?.id);
      });
    }

    setOnClickedRead(true);
  };

  useEffect(() => {
    setSocket(io(socketPort));
  }, []);

  useEffect(() => {
    socket?.emit("getNewMessages", user?.id);
    socket?.on("getNewMessages", (data) => {
      setNewMessages(data);
    });
    setOnClickedRead(false);
  }, [socket, onClickedRead]);

  return { newMessages, hasReadMessage };
};
