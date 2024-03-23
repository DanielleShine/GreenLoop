import { useState, useEffect } from "react";
import { Link, NavLink, useNavigate, useSearchParams } from "react-router-dom";

import { useWindowSize } from "@uidotdev/usehooks";
import {
  IoExitOutline,
  IoSearch,
  IoHomeOutline,
  IoListOutline,
  IoAddCircleOutline,
  IoChatboxEllipsesOutline,
  IoNotificationsOutline,
  IoSettings,
} from "react-icons/io5";

import Notification from "../../../modules/Notification/Desktop";
import SettingsDropdown from "../SettingsDropdown";
import Logout from "../Modal/Logout";
import { useSocketMessages } from "../../../hooks/useSocket";

import greenloopLogo from "../../../assets/images/greenloop-logo.png";
import { useUser } from "../../../hooks/useUser";

const iconSizes = "h-4.5 w-4.5 lg:h-5 lg:w-5 md:h-5 md:w-5";

const Menus = [
  {
    name: "Home",
    icon: <IoHomeOutline className={iconSizes} />,
    route: "",
  },
  {
    name: "Listing",
    icon: <IoListOutline className={iconSizes} />,
    route: "listing",
  },
  {
    name: "Post",
    icon: <IoAddCircleOutline className={iconSizes} />,
    route: "post",
  },
  {
    name: "Chats",
    icon: <IoChatboxEllipsesOutline className={iconSizes} />,
    route: "chats",
  },
  {
    name: "Notifications",
    icon: <IoNotificationsOutline className={iconSizes} />,
    route: "notifications",
  },
  {
    name: "Settings",
    icon: <IoSettings className={iconSizes} />,
    route: "profile",
  },
];

const Navbar = () => {
  const user = JSON.parse(localStorage.getItem("user:detail"));

  // Just want to get the data from the backend
  const { userData } = useUser(user?.id);

  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");
  const [scrollActive, setScrollActive] = useState(false);
  const [showNotification, setShowNotification] = useState(false);
  const [hideModals, setHideModals] = useState(false);
  const [hideMenuLabels, setHideMenuLabels] = useState(false);
  const [isHoveredSettings, setHoveredSettings] = useState(false);

  const conversationId = searchParams.get("id");

  const { width } = useWindowSize();

  const handleSubmit = (e) => {
    e.preventDefault();

    setSearchQuery("");
    navigate(`/listing?filter=${searchQuery}`);
  };

  const { newMessages, hasReadMessage } = useSocketMessages(user);

  useEffect(() => {
    window.addEventListener("scroll", () => {
      setScrollActive(window.scrollY > 10);
    });

    if (width > 640) {
      setHideModals(true);
    } else {
      setHideModals(false);
      setShowNotification(false);
      setHoveredSettings(false);
    }
    width > 900 ? setHideMenuLabels(true) : setHideMenuLabels(false);
  }, [width]);

  console.log("userData: ", userData);
  return (
    <>
      <header
        className={`fixed lg:top-0 w-screen z-50 transition-all ${
          !hideModals && "bg-[#F8F8F8] "
        } ${scrollActive && " shadow-md pt-0"} 
        }`}
      >
        <nav
          className={`fixed grid z-30 px-6 h-[5rem] text-center top-0 border-gray-200 w-screen bg-[#F8F8F8] md:justify-between sm:justify-center md:border-0 md:h-[4rem] ${
            scrollActive && `${!conversationId && "shadow-md"} pt-0`
          } `}
        >
          {!hideModals && (
            <div
              className={`w-screen col-start-1 col-end-4 flex items-center justify-between ${
                hideModals && " fixed z-100"
              }`}
            >
              <div className="flex items-center ml-10">
                <Link to="/" className="cursor-pointer">
                  <img
                    src={greenloopLogo}
                    className="h-[3.5rem] w-auto sm:w-[2.6rem] sm:h-[2.6rem] 2xsm:w-[2.5rem] 2xsm:h-[2.5rem]"
                    alt="green-loop logo"
                  />
                </Link>
                <div className="relative ml-5">
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Search here ..."
                      className="w-[20rem] bg-[#FEFEFE] border border-[#CACACA] focus:bg-white focus:border-gray-300 focus:outline-none h-10 p-4 pl-8 placeholder-gray-500 rounded-full text-xs sm:h-4 sm:w-[14rem] sm:p-3.5 sm:pl-8 sm:max-w-xs xsm:w-[13rem] 2xsm:w-[11rem] 2xsm:p-3 2xsm:pl-8 2xsm:h-4"
                    />
                    <IoSearch className="absolute align-center left-3 top-3.5 h-3 w-3 text-gray-300 pointer-events-none sm:top-2.5" />
                  </form>
                </div>
              </div>

              <button onClick={() => setIsLoggingOut(true)}>
                <IoExitOutline className="w-7 h-7 mr-5" />
              </button>
            </div>
          )}

          <div className="bg-white justify-between max-h-[5rem] items-center h-[5rem] text-xl w-screen flex fixed md:shadow-md md:py-1 md:text-2xl md:text-center md:justify-between md:h-[3.5rem] sm:justify-center sm:h-[3rem] sm:bottom-0 sm:items-center xsm:px-0 2xsm:px-0">
            {hideModals && (
              <div className="flex items-center text-center px-5">
                <Link to="/">
                  <img
                    src={greenloopLogo}
                    className="h-14 w-auto items-center cursor-pointer lg:h-12 md:h-9"
                    alt="green-loop logo"
                  />
                </Link>
                <div className="relative flex items-center ml-5 lg:h-12 md:h-9">
                  <form onSubmit={(e) => handleSubmit(e)}>
                    <input
                      type="text"
                      id="search"
                      name="search"
                      placeholder="Search here ..."
                      className="w-[20rem] h-10 p-4 pl-8 placeholder-gray-500 rounded-full text-sm bg-[#FEFEFE] border border-[#CACACA] focus:bg-white focus:border-gray-300 focus:outline-none lg:h-6 lg:w-[15rem] md:h-2 md:w-[12rem] md:text-xs md:max-w-xs "
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    <IoSearch className="absolute align-center left-3 top-3 h-3 w-3 text-gray-300 pointer-events-none lg:top-5 md:top-3" />
                  </form>
                </div>
              </div>
            )}

            <ul className="flex relative h-[5rem] items-center pl-5 md:pl-0 md:justify-center md:text-2xl md:h-[3.5rem] sm:h-[3rem]">
              {Menus.map((menu, index) => {
                if (
                  (hideModals && menu.name.includes("Notifications")) ||
                  (hideModals && menu.name.includes("Settings"))
                ) {
                  return (
                    <div
                      key={index}
                      onClick={() =>
                        menu.name.includes("Notifications")
                          ? setShowNotification(!showNotification)
                          : setHoveredSettings(!isHoveredSettings)
                      }
                      className="px-6 text-[#31572C] h-[5rem] cursor-pointer hover:text-white hover:bg-[#5e8759] duration-200 lg:px-6 md:h-[3.5rem] md:px-[1.1rem] sm:h-[3rem] xsm:px-[1.3rem] 2xsm:px-[1rem]"
                    >
                      {menu.name.includes("Notifications") &&
                        newMessages.length > 0 && (
                          <span className="absolute top-3 right-17 bg-red-500 text-white w-4 h-4 text-center justify-between rounded-full font-medium text-xs">
                            {newMessages.length}
                          </span>
                        )}
                      <span className="flex flex-col text-center items-center justify-center w-full h-[5rem] sm:text-3xl md:h-[3.5rem] sm:h-[3rem]">
                        {menu.icon}
                        {hideMenuLabels && (
                          <span
                            className={`text-sm lg:text-[0.7rem] translate-y-1 duration-200`}
                          >
                            {menu.name}
                          </span>
                        )}
                      </span>
                    </div>
                  );
                } else {
                  return (
                    <NavLink
                      key={index}
                      to={menu.route}
                      className="px-6 text-[#31572C] h-[5rem] cursor-pointer hover:text-white hover:bg-[#5e8759] duration-200 lg:px-6 md:h-[3.5rem] sm:h-[3rem] md:px-[1.1rem] xsm:px-[1.3rem] 2xsm:px-[1rem]"
                    >
                      <span className="flex flex-col text-center items-center justify-center w-full h-[5rem] md:h-[3.5rem] sm:h-[3rem] sm:text-xl">
                        {menu.name.includes("Notifications") &&
                          newMessages.length > 0 && (
                            <span className="absolute top-2 bg-red-500 text-white w-4 h-4 text-center justify-between rounded-full font-medium text-xs">
                              {newMessages.length}
                            </span>
                          )}
                        {menu.icon}

                        {hideMenuLabels && (
                          <span
                            className={`text-sm lg:text-[0.7rem] translate-y-1 duration-200`}
                          >
                            {menu.name}
                          </span>
                        )}
                      </span>
                    </NavLink>
                  );
                }
              })}
              {showNotification && (
                <Notification
                  newMessages={newMessages}
                  hasReadMessage={hasReadMessage}
                />
              )}

              {isHoveredSettings && (
                <SettingsDropdown userData={userData && userData[0]} />
              )}
              {isLoggingOut && <Logout setIsLoggingOut={setIsLoggingOut} />}
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
