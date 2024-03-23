import { useNavigate } from "react-router-dom";
import { signOutUser } from "../../../../api/user";

const Logout = ({ setIsLoggingOut }) => {
  const user = JSON.parse(localStorage.getItem("user:detail"));
  const navigate = useNavigate();

  const signOut = async () => {
    navigate("/users/sign-in");
    localStorage.clear();
    await signOutUser(user.id);
  };
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-2xl">
          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-108 bg-white outline-none focus:outline-none xsm:h-3/4 xsm:w-80">
            <p className="p-7 text-clamp-base">
              Are you sure you want to logout?
            </p>
            <div className="flex items-center justify-end p-6 border-t border-solid border-blueGray-200 rounded-b md:p-2">
              <button
                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                type="button"
                onClick={() => setIsLoggingOut(false)}
              >
                Cancel
              </button>
              <button
                className="bg-[#31572C] text-white active:bg-[#2e4d29] font-bold uppercase text-sm px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                type="button"
                onClick={() => signOut()}
              >
                Yes
              </button>
            </div>
          </div>
        </div>
      </div>
      <div className="opacity-25 fixed inset-0 z-40 bg-black" />
    </>
  );
};

export default Logout;
