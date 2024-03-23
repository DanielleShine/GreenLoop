import { Link, useNavigate } from "react-router-dom";

import { signOutUser } from "../../../api/user";

const SettingsDropdown = ({ userData }) => {
  const navigate = useNavigate();

  const signOut = async () => {
    navigate("/users/sign-in");
    localStorage.clear();
    await signOutUser(userData?.userId);
  };

  return (
    <div
      className="z-50 fixed text-left top-[4.5rem] right-2 my-4 text-clamp-xs leading-5 list-none bg-white divide-y divide-gray-100 rounded shadow"
      id="dropdown-2"
    >
      <Link to={`profile/${userData?.userId}`}>
        <div className="px-4 py-3 cursor-pointer hover:bg-gray-100">
          <p role="none">My Account</p>
        </div>
      </Link>
      <ul className="py-1">
        {userData?.isAdmin && (
          <li>
            <Link to="dashboard/users">
              <span
                className="block px-4 py-4 cursor-pointer hover:bg-gray-100"
                role="menuitem"
              >
                Dashboard
              </span>
            </Link>
          </li>
        )}
        <li>
          <span
            className="block px-4 py-4 cursor-pointer hover:bg-gray-100"
            role="menuitem"
            onClick={() => signOut()}
          >
            Sign out
          </span>
        </li>
      </ul>
    </div>
  );
};

export default SettingsDropdown;
