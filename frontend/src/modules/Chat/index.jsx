import { io } from "socket.io-client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";

import Input from "../../components/Common/Input";
import { getConversations, getMessages } from "../../api/conversation";
import { sendUserMessage } from "../../api/message";

import { TbSend, TbCirclePlus, TbArrowLeft } from "react-icons/tb";

import { useWindowSize } from "@uidotdev/usehooks";
import defaultImage from "../../assets/images/default-image.jpg";
import { getEndpoint, socketPort } from "../../utils/Helper";

const Chat = () => {
  document.title = "Green Loop | Chat";

  const loggedInUser = JSON.parse(localStorage.getItem("user:detail"));
  const [searchParams, setSearchParams] = useSearchParams();
  const [receiverUser, setReceiverUser] = useState({});

  const [file, setFile] = useState([]);
  const [conversations, setConversations] = useState([]);
  const [messages, setMessages] = useState({});
  const [message, setMessage] = useState("");
  const [users, setUsers] = useState([]);
  const [socket, setSocket] = useState(null);
  const [openConvo, setOpenConvo] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [isTablet, setIsTable] = useState(false);

  const messageRef = useRef(null);
  const { width } = useWindowSize();

  const user = JSON.parse(localStorage.getItem("user:detail"));
  const conversationId = searchParams.get("id");

  useEffect(() => {
    setSocket(io.connect(socketPort));
  }, []);

  useMemo(() => {
    socket?.emit("addUser", user?.id);
    socket?.on("getUsers", (users) => {
      console.log("activeUsers: ", users);
    });
    socket?.on("getMessage", (data) => {
      setMessages((prev) => ({
        ...prev,
        messages: [
          ...prev.messages,
          { user: data.user, message: data.message },
        ],
      }));
    });
  }, [socket]);

  useEffect(() => {
    messageRef?.current?.scrollIntoView({ behavior: "smooth" });
    width < 512 ? setIsMobile(true) : setIsMobile(false);
    width > 512 && width < 768 ? setIsTable(true) : setIsTable(false);
  }, [messages?.messages, width]);

  useMemo(() => {
    const fetchConversations = async () => {
      const { data } = await getConversations(loggedInUser?.id);
      setConversations(data);
    };
    fetchConversations();
  }, []);

  useMemo(() => {
    const fetchUsers = async () => {
      const res = await fetch(`${getEndpoint}:8000/api/users`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
      });
      const resData = await res.json();
      setUsers(resData);
    };
    fetchUsers();
  }, []);

  useMemo(() => {
    const getConversation = async () => {
      if (conversationId) {
        const receiver = conversations?.find(
          (convo) => convo?.conversation.conversationId === conversationId
        );
        const { data } = await getMessages(
          conversationId,
          user?.id,
          receiver?.conversation.sender.senderId
        );
        setReceiverUser(receiver?.conversation.sender);
        setMessages({
          messages: data,
          receiver: receiver?.conversation.sender.senderId,
          conversationId,
        });
      } else {
        setMessages({});
      }
    };
    getConversation();
  }, [conversationId, conversations, messages.messages?.length]);

  const fetchImage = (e) => {
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setFile(reader.result);
    };
  };

  const fetchMessages = async (conversationId, receiver) => {
    searchParams.set("id", conversationId);
    setSearchParams(searchParams);

    const { data } = await getMessages(conversationId, user?.id, receiver);

    setOpenConvo(true);
    setMessages({ messages: data, receiver, conversationId });
  };

  const sendMessage = async () => {
    setMessage("");
    socket?.emit("sendMessage", {
      senderId: user?.id,
      receiverId: messages?.receiver?.receiverId,
      message,
      image: file,
      conversationId: messages?.conversationId,
    });
    const messageForm = {
      conversationId: messages?.conversationId,
      senderId: user?.id,
      message,
      receiverId: messages?.receiver?.receiverId,
    };
    file.length > 0 && (messageForm.image = file);

    await sendUserMessage(messageForm);
    setFile([]);
  };

  const handleMoveBack = () => {
    searchParams.delete("id");
    setOpenConvo(false);
    setReceiverUser({});
  };

  console.log("receiverUserTest: ", receiverUser);

  return (
    <div className="w-full h-full bg-white" id="profile">
      <div className="flex pt-[3.8rem] border-grey rounded">
        {isMobile ? (
          <>
            <div className="h-full w-full">
              <div className="relative mx-auto rounded-lg">
                {!openConvo ? (
                  <h3 className="text-md font-semibold uppercase text-gray-400 mb-4 pl-2 py-2">
                    Chats
                  </h3>
                ) : (
                  <>
                    <div className="fixed top-13 w-full bg-white flex items-center mb-5 py-3 shadow-md">
                      <TbArrowLeft
                        className="flex text-md font-semibold uppercase text-gray-800 cursor-pointer pl-2 w-9 h-9"
                        onClick={handleMoveBack}
                      />
                      <img
                        className="rounded-full w-8 h-8 items-start flex-shrink-0 ml-4 mr-3 border border-primary"
                        src={
                          receiverUser?.image?.url
                            ? receiverUser.image.url
                            : defaultImage
                        }
                        alt="Marie Zulfikar"
                      />
                      <h4 className="text-sm font-semibold text-gray-900">
                        {receiverUser?.companyName}
                      </h4>
                    </div>
                  </>
                )}
                <div className="divide-y divide-gray-200">
                  {conversations && !openConvo
                    ? conversations.map((convo) => {
                        return (
                          <Link
                            key={conversationId}
                            className="w-full flex justify-center text-left py-8 sm:px-5 sm:py-1 sm:my-2 xsm:justify-start overflow-x-hidden"
                            onClick={() => {
                              fetchMessages(
                                convo.conversation.conversationId,
                                convo.conversation.sender.senderId
                              );
                            }}
                          >
                            <div className="flex items-center">
                              <img
                                className="rounded-full flex-shrink-0 mr-5 border border-primary"
                                src={
                                  convo.conversation?.sender?.image?.url
                                    ? convo.conversation.sender.image.url
                                    : defaultImage
                                }
                                width="48"
                                height="48"
                                alt={convo.conversation.sender.companyName}
                              />
                              <div className="text-clamp-base">
                                <h4 className="font-semibold text-gray-900 ">
                                  {convo.conversation.sender.companyName}
                                </h4>
                              </div>
                            </div>
                          </Link>
                        );
                      })
                    : !openConvo && (
                        <div className="text-center text-lg font-semibold mt-24">
                          No Conversations
                        </div>
                      )}
                </div>
                <div className="h-full overflow-y-auto mb-[6.5rem]">
                  <div className="p-14 sm:p-0 ">
                    {messages?.messages?.length > 0 && openConvo
                      ? messages.messages.map(
                          ({ message, user: messageSender = {} }, index) => {
                            return (
                              <>
                                {/* Receiver Side */}
                                {messageSender.id === user?.id ? (
                                  <div key={index}>
                                    <div className="w-full flex justify-end text-left py-8 sm:px-2 sm:py-1 sm:pr-3 sm:my-2 overflow-x-hidden">
                                      <div className="flex items-center">
                                        <h4 className="text-xs text-blue p-3 bg-gray-200 rounded-xl">
                                          {message.msg}
                                        </h4>
                                      </div>
                                    </div>

                                    {message?.msgImage?.url && (
                                      <div>
                                        <div className="w-full flex justify-end text-left py-8 overflow-x-hidden sm:px-2 sm:pr-3 sm:py-1 sm:my-2 xsm:pl-16">
                                          <div className="flex flex-col-2 gap-4 text-right justify-end">
                                            <img
                                              src={message?.msgImage?.url}
                                              className="rounded-lg w-24 h-24 ml-2"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div key={index}>
                                    {/* Sender Side */}
                                    <div className="w-full flex justify-start text-left py-8 xsm:pr-16 sm:px-2 sm:py-1 sm:my-2 overflow-x-hidden">
                                      <span className="flex items-center">
                                        <img
                                          src={
                                            messageSender.image?.url?.length > 0
                                              ? messageSender.image.url
                                              : defaultImage
                                          }
                                          alt={messageSender?.companyName}
                                          className="rounded-full w-12 h-12 sm:mr-2"
                                        />
                                        <p className="text-xs text-blue p-3 bg-gray-200 rounded-xl">
                                          {message.msg}
                                        </p>
                                      </span>
                                    </div>

                                    {message?.msgImage?.url && (
                                      <div>
                                        <div className="w-full flex justify-start text-left py-8 xsm:pr-16 sm:py-1 sm:my-2 overflow-x-hidden">
                                          <div className="">
                                            <img
                                              className="rounded-full w-12 h-12 flex-shrink-0 sm:ml-2"
                                              src={
                                                messageSender.image?.url
                                                  ?.length > 0
                                                  ? messageSender.image.url
                                                  : defaultImage
                                              }
                                              alt={messageSender?.companyName}
                                            />
                                          </div>
                                          <div className="flex flex-col-2 gap-4 text-right justify-start">
                                            <img
                                              src={message?.msgImage?.url}
                                              className="rounded-lg w-auto h-24 ml-2"
                                            />
                                          </div>
                                        </div>
                                      </div>
                                    )}

                                    <div ref={messageRef}></div>
                                  </div>
                                )}
                              </>
                            );
                          }
                        )
                      : messages?.messages?.length > 0 &&
                        !openConvo &&
                        !conversationId && (
                          <div className="text-center text-lg font-semibold mt-24">
                            No Messages or No Conversation Selected
                          </div>
                        )}
                  </div>
                </div>

                {messages?.conversationId && (
                  <div className="fixed bottom-12 px-10 py-3 w-full bg-white flex justify-center items-center">
                    <input
                      type="file"
                      id="image-upload"
                      className="hidden"
                      accept="image/*"
                      onChange={(e) => fetchImage(e)}
                    />
                    <label
                      htmlFor="image-upload"
                      className="cursor-pointer mr-2"
                    >
                      <TbCirclePlus className="h-6 w-6 mr-2 cursor-pointer" />
                    </label>
                    <Input
                      id="message"
                      placeholder="Type a message..."
                      value={message}
                      onChange={(e) => setMessage(e.target.value)}
                      className="w-full"
                      inputClassName="p-2 pl-5 border-0 shadow-md rounded-full bg-light focus:ring-0 focus:border-0 outline-none"
                    />
                    <div
                      className={`ml-2 p-2 cursor-pointer bg-light rounded-full ${
                        !message && "pointer-events-none"
                      }`}
                      onClick={() => sendMessage()}
                    >
                      <TbSend className="h-6 w-6" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </>
        ) : (
          // Desktop View
          <>
            <div className="grid grid-cols-4 grid-rows-chat gap-0 md:h-[88vh] pt-[3.8rem] md:pt-0 h-[90dvh] w-full">
              <div className={`h-full ${conversationId && "border-r"}`}>
                <div className=" py-2 bg-grey-lightest">
                  <span className="text-5xl text-gray-700 float-left px-5 font-semibold text-clamp">
                    Chats
                  </span>
                </div>
              </div>

              {/* Conversation User Name */}
              <div className="row-start-1 col-start-2 col-span-3 px-3 bg-grey-lighter flex flex-row justify-between items-center border-b">
                <div className="row-start-1 col-start-2 border-0 h-full">
                  <div className="bg-grey-lighter overflow-y-auto">
                    {conversationId && (
                      <div className="flex items-center py-1 px-7 cursor-pointer">
                        <img
                          src={
                            receiverUser?.image?.url
                              ? receiverUser.image.url
                              : defaultImage
                          }
                          className="w-[3rem] h-[3rem] rounded-full p-[2px] border border-primary"
                        />
                        <div className="ml-6">
                          <h3 className="text-clamp-to-desktop font-normal">
                            {!isTablet && receiverUser?.companyName}
                          </h3>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              </div>

              <div className="row-start-2 row-span-3 col-start-1 h-full border border-b-0">
                <div className="bg-grey-lighter overflow-y-auto">
                  {conversations.length > 0 ? (
                    conversations.map((convo, index) => {
                      return (
                        <div
                          key={index}
                          className="flex items-center py-3 px-7 hover:bg-gray-100 cursor-pointer"
                          onClick={() =>
                            fetchMessages(
                              convo.conversation.conversationId,
                              convo.conversation.sender.senderId
                            )
                          }
                        >
                          <img
                            src={
                              convo.conversation?.sender?.image?.url
                                ? convo.conversation.sender.image.url
                                : defaultImage
                            }
                            className="w-[3rem] h-[3rem] rounded-full p-[2px] border border-primary"
                          />
                          <div className="ml-6">
                            <h3 className="text-clamp-to-desktop font-semibold">
                              {!isTablet &&
                                convo.conversation.sender.companyName}
                            </h3>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="text-center text-lg font-semibold mt-24">
                      No Conversations
                    </div>
                  )}
                </div>
              </div>

              <div className="row-start-2 col-span-3 w-full overflow-y-auto">
                <div className="py-2 px-3">
                  <div className="flex justify-center mb-2">
                    <p className="text-sm uppercase">
                      {new Date().toUTCString().slice(5, 16)}
                    </p>
                  </div>

                  <div className="flex justify-center mb-4">
                    <div className="rounded py-2 px-4">
                      <p className="text-xs">
                        Messages to this chat and calls are now secured with
                        end-to-end encryption.
                      </p>
                    </div>
                  </div>
                </div>
                <div className="p-14 sm:p-2">
                  {messages?.messages?.length > 0 ? (
                    messages.messages.map(
                      ({ message, user: messageSender }, index) => {
                        return (
                          <div key={index}>
                            {messageSender.id == user?.id ? (
                              <>
                                {/* Current User Message Message Chat Box */}
                                <div
                                  className={`max-w-[70%]  rounded-b-xl p-2 mb-2 ${
                                    messageSender !== user?.id
                                      ? "bg-primary text-blue rounded-tl-xl ml-auto"
                                      : "bg-secondary rounded-tr-xl"
                                  } `}
                                >
                                  <div className="flex text-left justify-end">
                                    <span className="bg-gray-200 rounded-3xl px-5">
                                      <p className="text-sm text-blue py-3">
                                        {message.msg}
                                      </p>
                                    </span>
                                  </div>
                                </div>

                                {/* Current User Image Message Message Chat Box */}
                                {message?.msgImage?.url && (
                                  <div
                                    className={`w-full rounded-b-xl p-2 mb-2 ${
                                      messageSender === user?.id
                                        ? "bg-primary text-blue rounded-tl-xl ml-auto"
                                        : "bg-secondary rounded-tr-xl"
                                    } `}
                                  >
                                    <div className="flex text-right justify-end">
                                      <img
                                        src={message?.msgImage?.url}
                                        className="rounded-lg w-62 h-62"
                                      />
                                    </div>
                                  </div>
                                )}
                              </>
                            ) : (
                              <>
                                {/* Desktop Text Message Chat Box */}
                                <div
                                  className={`max-w-[70%] rounded-b-xl p-4 mb-6 sm:p-2 ${
                                    messageSender === user?.id
                                      ? "bg-primary text-blue rounded-tl-xl ml-auto"
                                      : "bg-secondary rounded-tr-xl"
                                  } `}
                                >
                                  <div className="flex flex-col-2 gap-4 text-left justify-start">
                                    <span className="text-clamp-xs w-12 sm:w-9">
                                      <img
                                        src={
                                          messageSender?.image?.url?.length > 0
                                            ? messageSender.image.url
                                            : defaultImage
                                        }
                                        alt={messageSender?.companyName}
                                        className="rounded-full w-12 h-12 sm:w-9 sm:h-9"
                                      />
                                    </span>
                                    <p className="text-clamp-xs text-blue p-3 bg-gray-200 rounded-xl">
                                      {message.msg}
                                    </p>
                                  </div>
                                </div>
                                {/* Desktop Image Message Chat Box */}
                                {message?.msgImage?.url && (
                                  <div
                                    className={`max-w-[70%] rounded-b-xl p-4 mb-6 ${
                                      messageSender === user?.id
                                        ? "bg-primary text-blue rounded-tl-xl ml-auto"
                                        : "bg-secondary rounded-tr-xl"
                                    } `}
                                  >
                                    <div className="flex flex-col-2 gap-4 text-right justify-start">
                                      <span className="text-clamp-xs">
                                        <img
                                          src={
                                            messageSender?.image?.url?.length >
                                            0
                                              ? messageSender.image.url
                                              : defaultImage
                                          }
                                          alt={messageSender?.companyName}
                                          className="rounded-full w-12 h-12"
                                        />
                                      </span>
                                      <div className="flex text-right justify-end">
                                        <img
                                          src={message?.msgImage?.url}
                                          className="rounded-lg"
                                        />
                                      </div>
                                    </div>
                                  </div>
                                )}
                              </>
                            )}
                            <div ref={messageRef}></div>
                          </div>
                        );
                      }
                    )
                  ) : (
                    <div className="text-center text-lg  font-semibold mt-24">
                      No Messages or No Conversation Selected
                    </div>
                  )}
                </div>
              </div>
              {messages?.conversationId && (
                <div className="row-start-3 col-start-2 col-span-3 px-10 w-full flex justify-center items-center md:pb-8 sm:pb-4">
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={(e) => fetchImage(e)}
                  />
                  <label htmlFor="image-upload" className="cursor-pointer mr-2">
                    <TbCirclePlus className="h-6 w-6 mr-2 cursor-pointer" />
                  </label>
                  <Input
                    id="message"
                    placeholder="Type a message..."
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-2/3 xsm:w-full"
                    inputClassName="p-2 pl-5 border-0 shadow-md rounded-full bg-light h-[3rem] focus:ring-0 focus:border-0 outline-none xsm:h-[1.5rem]"
                  />
                  <div
                    className={`ml-2 p-2 cursor-pointer bg-light rounded-full ${
                      !message && "pointer-events-none"
                    }`}
                    onClick={(e) => sendMessage(e)}
                  >
                    <TbSend className="h-6 w-6" />
                  </div>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Chat;
