import { jwtDecode } from "jwt-decode";

import { useEffect, useMemo, useRef, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { useMutation } from "@tanstack/react-query";

import Listing from "../Listing";
import { updateUser } from "../../api/user";
import { createConversation } from "../../api/conversation";

import defaultImage from "../../assets/images/default-image.jpg";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useUser } from "../../hooks/useUser";
import mindanaoPlaces from "../../constants/mindanaoPlaces";

const Profile = () => {
  document.title = "Green Loop | Profile";

  const token = localStorage.getItem("user:token");
  const decToken = jwtDecode(token);

  const { id: profileId } = useParams();
  const isLoggedIn = token !== null || false;

  const { image, imagePreview, fetchImage, setImage, setImagePreview } =
    useUploadImage();

  const {
    userData: user,
    isLoading: userLoading,
    error: userError,
  } = useUser(profileId === decToken.userId ? decToken.userId : profileId);

  const userRef = useRef({});

  const currUser = user && profileId === decToken.userId;
  const visitedUser = user && profileId !== decToken.userId;
  const profileType = profileId && isLoggedIn ? currUser : visitedUser;

  const { register, handleSubmit, reset } = useForm();

  const [inputType, setInputType] = useState("password");
  const [places, setPlaces] = useState([]);

  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleOnChangeProvince = (e) => {
    if (e.target.id == "provinces" && e.target.value == "Select a Province") {
      setPlaces([]);
    } else {
      const filteredMunicipalities = mindanaoPlaces.filter((province) =>
        province.name.includes(e.target.value)
      );
      setPlaces(filteredMunicipalities[0].places);
    }
  };

  const handleOpenModal = () => {
    setShowModal(true);
    const filteredMunicipalities = mindanaoPlaces.filter((province) =>
      province.name.includes(user[0].province)
    );
    setPlaces(filteredMunicipalities[0].places);
  };

  const { mutate: messageCompany } = useMutation({
    mutationFn: () => createConversation(decToken.userId, profileId),
    onSuccess: (data) => {
      const { data: conversationId } = data;
      navigate(`/chats?id=${conversationId[0]._id}`);
    },
  });

  const { mutate: editProfile } = useMutation({
    mutationFn: (data) => updateUser(data.userId, data.formData),
    onSuccess: () => {
      alert("Profile updated successfully");
      reset();
      setImagePreview("");
      setImage([]);
    },
    onError: (error) => {
      alert(error.response?.data);
      console.log("error: ", error);
    },
  });

  const onSubmit = (data) => {
    try {
      const formData = { ...data, image };
      editProfile({ userId: decToken?.userId, formData: formData });

      setShowModal(false);
    } catch (err) {
      console.log(err);
    }
  };

  const onCloseModal = () => {
    setShowModal(false);
    setImage([]);
    setImagePreview("");
  };

  useMemo(() => {
    reset(user && user[0]);
  }, [user, reset]);

  return (
    <div
      className="grid w-full py-6 overflow-x-hidden bg-[#F8F8F8]"
      id="profile"
    >
      {user && (
        <>
          <div className="max-w-screen-lg flex flex-col text-center justify-center">
            <div className="bg-white flex justify-center items-center border px-6 w-screen h-108 xl:px-0 sm:h-96">
              <div className="block py-10 h-80 md:max-w-md">
                <span className="flex justify-center items-center text-center mb-3">
                  <img
                    src={user[0].image ? user[0].image : defaultImage}
                    className="rounded-full w-40 h-40 sm:h-28 sm:w-28 xsm:h-24 xsm:w-24"
                  />
                </span>
                <p className="mb-0 text-3xl font-normal text-black md:text-clamp-profile">
                  {user[0].companyName}
                </p>
                <p className="mb-5 text-normal font-thin text-black md:text-clamp-xs ">
                  {user[0].organizationType}
                </p>
                <p className="mb-5 text-normal font-normal text-black md:text-clamp-base">
                  {user[0].cityMunicipality}
                </p>
                {profileType ? (
                  <span
                    onClick={() => handleOpenModal()}
                    className="text-black border bg-primary-700 cursor-pointer hover:bg-[#F8F8F8] focus:ring-4 focus:ring-primary-300 font-semithin rounded-full text-sm px-10 py-1 text-center inline-flex items-center md:text-clamp-xs md:px-6"
                  >
                    Edit Profile
                  </span>
                ) : (
                  <span
                    onClick={messageCompany}
                    className="text-black border bg-primary-700 cursor-pointer hover:bg-[#F8F8F8] focus:ring-4 focus:ring-primary-300 font-semithin rounded-full text-sm px-10 py-1 text-center inline-flex items-center md:text-clamp-xs md:px-6"
                  >
                    Message
                  </span>
                )}

                {showModal ? (
                  <>
                    <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                      <div className="relative w-auto my-6 mx-auto max-w-2xl">
                        <form
                          onSubmit={handleSubmit(onSubmit)}
                          encType="multipart/form-data"
                        >
                          <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-108 max-h-128 bg-white outline-none focus:outline-none xsm:h-3/4 xsm:w-80">
                            <div className="flex items-center justify-center p-4 border-solid mx-auto border-blueGray-200 rounded-t md:p-2">
                              <h3 className="text-2xl font-semibold md:text-clamp">
                                Edit Profile
                              </h3>
                            </div>
                            <hr />
                            <div className="relative p-6 pb-1">
                              <span className="flex justify-center items-center text-center mb-3">
                                {imagePreview ? (
                                  <img
                                    src={
                                      imagePreview
                                        ? URL.createObjectURL(imagePreview)
                                        : null
                                    }
                                    alt={
                                      imagePreview ? imagePreview.name : null
                                    }
                                    className="relative w-24 h-24 bg-white rounded-full flex justify-center items-center sm:w-28 sm:h-28 xsm:h-16 xsm:w-16"
                                  />
                                ) : (
                                  <img
                                    src={defaultImage}
                                    className="relative w-24 h-24 bg-white rounded-full flex justify-center items-center sm:w-28 sm:h-28 xsm:h-16 xsm:w-16"
                                  />
                                )}
                              </span>
                              <div className="relative w-48 h-[1.7rem] text-black border bg-primary-700 cursor-pointer hover:bg-[#F8F8F8] focus:ring-4 focus:ring-primary-300 font-semithin rounded-full inline-flex justify-center items-center">
                                <input
                                  type="file"
                                  id="image-upload"
                                  className="hidden"
                                  accept="image/*"
                                  onChange={(e) => fetchImage(e)}
                                />
                                <label
                                  htmlFor="image-upload"
                                  className="absolute cursor-pointer"
                                >
                                  <p className="text-slate-400 text-clamp-xs">
                                    {image.length
                                      ? "Replace"
                                      : "Update Profile Picture"}
                                  </p>
                                </label>
                              </div>

                              <p className="mt-5 mx-6 mb-0 text-[#5b5c61] text-clamp-xs leading-relaxed text-left xsm:mx-2">
                                Generate Account Settings:
                              </p>
                            </div>

                            <div className="relative overflow-hidden py-2">
                              <table className="w-full mx-6 text-clamp-xs text-left  rtl:text-right text-gray-500 sm:mx-2">
                                <tbody>
                                  <tr className="bg-white">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Name:
                                    </th>
                                    <td className="px-6 py-2">
                                      <input
                                        type="text"
                                        name="companyName"
                                        id="companyName"
                                        className=" w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                        {...register("companyName")}
                                      />
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Username:
                                    </th>
                                    <td className="px-6 py-2">
                                      <input
                                        type="text"
                                        name="username"
                                        id="username"
                                        className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                        {...register("username")}
                                      />
                                    </td>
                                  </tr>
                                  <tr className="bg-white ">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Password:
                                    </th>
                                    <td className="px-6 py-2">
                                      <input
                                        type={inputType}
                                        name="password"
                                        id="password"
                                        className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                        {...register("password")}
                                        onMouseOut={() =>
                                          setInputType("password")
                                        }
                                        onMouseEnter={() =>
                                          setInputType("text")
                                        }
                                      />
                                    </td>
                                  </tr>
                                  <tr className="bg-white ">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Email:
                                    </th>
                                    <td className="px-6 py-2">
                                      <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                        defaultValue={user[0].email}
                                        {...register("email")}
                                      />
                                    </td>
                                  </tr>
                                  <tr className="bg-white ">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Org Type:
                                    </th>
                                    <td className="px-6 py-2">
                                      <input
                                        type="text"
                                        name="organizationType"
                                        id="organizationType"
                                        className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                        {...register("organizationType")}
                                        disabled
                                      />
                                    </td>
                                  </tr>
                                  <tr className="bg-white">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      Province:
                                    </th>
                                    <td className="px-6 py-2">
                                      <select
                                        id="province"
                                        className="bg-gray-50 border w-44 border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                        {...register("province", {
                                          onChange: (e) =>
                                            handleOnChangeProvince(e),
                                          required: "Please select a province",
                                        })}
                                      >
                                        {mindanaoPlaces.map(
                                          (province, index) => (
                                            <option
                                              key={index}
                                              value={province.name}
                                            >
                                              {province.name}
                                            </option>
                                          )
                                        )}
                                      </select>
                                    </td>
                                  </tr>
                                  <tr className="bg-white ">
                                    <th
                                      scope="row"
                                      className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                                    >
                                      City/Municipality:
                                    </th>
                                    <td className="px-6 py-2">
                                      <select
                                        id="cityMunicipality"
                                        className="bg-gray-50 border border-gray-300 w-44 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                        {...register("cityMunicipality", {
                                          required:
                                            "Please select a city or municipality",
                                        })}
                                      >
                                        {places?.map((place, index) => (
                                          <option key={index} value={place}>
                                            {place}
                                          </option>
                                        ))}
                                      </select>
                                    </td>
                                  </tr>
                                </tbody>
                              </table>
                            </div>

                            <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b md:p-2">
                              <button
                                className="text-red-500 background-transparent font-bold uppercase px-6 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                                type="button"
                                onClick={onCloseModal}
                              >
                                Close
                              </button>
                              <button
                                className="bg-[#31572C] text-white active:bg-[#2e4d29] font-bold uppercase text-sm px-6 py-2 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                                type="submit"
                              >
                                Update Profile
                              </button>
                            </div>
                          </div>
                        </form>
                      </div>
                    </div>
                    <div className="opacity-25 fixed inset-0 z-40 bg-black" />
                  </>
                ) : null}
              </div>
            </div>
          </div>
          <Listing myWaste={user[0].wastes} />
        </>
      )}
    </div>
  );
};

export default Profile;
