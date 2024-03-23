import { Link } from "react-router-dom";
import { IoPersonCircleSharp, IoLibrary } from "react-icons/io5";

const DashboardLayout = () => {
  return (
    <>
      <aside
        id="sidebar"
        className="fixed top-0 left-0 z-20 flex flex-col flex-shrink-0 w-64 h-full pt-16 font-normal"
      >
        <div className="relative flex flex-col flex-1 min-h-0 pt-0 bg-white border-r border-gray-200 ">
          <div className="flex flex-col flex-1 pt-5 pb-4 overflow-y-auto">
            <div className="flex-1 px-3 space-y-1 divide-y divide-gray-200 ">
              <ul className="py-10 space-y-2">
                <li>
                  <Link
                    to="/dashboard/users"
                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <IoPersonCircleSharp className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900" />
                    <span className="ml-3">Users</span>
                  </Link>
                </li>
                <li>
                  <Link
                    to="/dashboard/wastes"
                    className="flex items-center p-2 text-base text-gray-900 rounded-lg hover:bg-gray-100 group"
                  >
                    <IoLibrary className="w-6 h-6 text-gray-500 transition duration-75 group-hover:text-gray-900 hover:text-white" />
                    <span className="ml-3">Wastes</span>
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </aside>
    </>
  );
};

export default DashboardLayout;
