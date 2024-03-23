import { Link } from "react-router-dom";

import { useSocketMessages } from "../../../hooks/useSocket";
import defaultImage from "../../../assets/images/default-image.jpg";

const MobileNotification = () => {
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const { newMessages, hasReadMessage } = useSocketMessages(user);

  return (
    <div className="w-full h-full bg-white" id="profile">
      <div className="flex pt-[5rem] border-grey rounded">
        <div className="h-full w-full">
          <div className="relative mx-auto rounded-lg">
            <h3 className="text-md font-semibold uppercase text-gray-400 mb-4 pl-2">
              Notifications
            </h3>
            <div className="divide-y divide-gray-200">
              {newMessages.map((message) => (
                <Link
                  to={`/chats?id=${message?.conversationId}`}
                  key={message.conversationId}
                  className="w-full flex justify-start bg-gray-100 text-left sm:px-5 sm:py-3 sm:my-2 overflow-x-hidden"
                  onClick={() => hasReadMessage(message?.message?.id)}
                >
                  <img
                    className="rounded-full w-10 h-10 flex-shrink-0 mr-5 border border-primary"
                    src={
                      message?.message?.user?.image?.url.length > 0
                        ? message?.message?.user?.image?.url
                        : defaultImage
                    }
                    alt={message?.user?.companyName}
                  />
                  <div className="text-gray-500 font-normal text-clamp-xs mb-1 ">
                    New message from {""}
                    <span className="font-semibold text-gray-900">
                      {message.user.companyName}
                    </span>
                    : <br />
                    <p className="text-clamp-base font-semibold text-gray-700">
                      {message.message.msg}
                    </p>
                    <blockquote className="text-clamp-xs text-gray-500 font-light">
                      {message.message.msgImage.url && "Attached an image"}
                    </blockquote>
                  </div>
                </Link>
              ))}
              {!newMessages.length && (
                <div className="text-center text-lg font-semibold mt-24">
                  No Notifications
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MobileNotification;
