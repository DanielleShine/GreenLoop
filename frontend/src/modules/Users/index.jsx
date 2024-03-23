import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Table from "../../components/Common/Table";
import UserList from "../../components/Management/UserList";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useUsers } from "../../hooks/useUser";
import { createUser, deleteUser, updateUser } from "../../api/user";
import { userHeader } from "../../constants/userHeader";

import defaultImage from "../../assets/images/default-image.jpg";
import { cityMunicipality } from "../../constants/cityMunicipality";
import { provinces } from "../../constants/provinces";
import { organizationType } from "../../constants/organizationType";

export default function Users() {
  document.title = "Green Loop | Dashboard";
  const queryClient = useQueryClient();
  const [userData, setUserData] = useState({});
  const [showModal, setShowModal] = useState(false);

  const { allUsers, error } = useUsers();
  const { image, fetchImage, imagePreview, setImage, setImagePreview } =
    useUploadImage();
  const { register, handleSubmit, reset } = useForm({
    defaultValues: { isAdmin: userData?.isAdmin },
  });

  const getUserData = (userId) => {
    const userRecord = allUsers.filter((user) => user.id == userId);
    setUserData(userRecord[0]);
    setShowModal(true);
  };

  const { mutate: handleCreateUser } = useMutation({
    mutationFn: (data) => createUser(data),
    onSuccess: () => {
      alert("User created successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setShowModal(false);
      setUserData({});
      setImagePreview("");
      setImage("");
    },
  });

  const { mutate: handleUpdateUser } = useMutation({
    mutationFn: (data) => updateUser(data.userId, data.formData),
    onSuccess: () => {
      alert("User updated successfully");
      queryClient.invalidateQueries({ queryKey: ["users"] });
      reset();
      setUserData({});
      setImagePreview("");
      setImage([]);
      setShowModal(false);
    },
    onError: (error) => {
      alert(error.response?.data);
      console.log("error: ", error);
    },
  });

  const { mutate: handleDeleteUser } = useMutation({
    mutationFn: (userId) => deleteUser(userId),
    onSuccess: () => {
      alert("User has been deleted");
      queryClient.invalidateQueries({ queryKey: ["users"] });
    },
  });

  const onSubmit = (data) => {
    const formData = { ...data, image };
    userData?.id
      ? handleUpdateUser({ userId: userData.id, formData: formData })
      : handleCreateUser({ ...data, onAdmin: true, image });
  };

  const onClose = () => {
    setShowModal(false);
    setUserData({});
    setImagePreview("");
    setImage("");
  };

  useMemo(() => {
    reset(userData);
  }, [userData, reset]);

  console.log("userData: ".userData);
  return (
    <div className="overflow-x-scroll">
      <div className="px-4 justify-start mb-5">
        <button
          onClick={() => setShowModal(true)}
          className="bg-[#31572C] text-white text-clamp-base p-2 px-4 rounded-full hover:bg-[#3c6137] ease-linear transition-all duration-150 "
        >
          Create User
        </button>
      </div>

      <div className="inline-block min-w-full align-middle">
        <div className="shadow rounded-lg">
          <Table>
            <Table.Header
              data={userHeader}
              render={(header) => <Table.Column key={header} header={header} />}
            />
            <Table.Body>
              {allUsers?.map((user, i) => (
                <UserList
                  key={i}
                  id={user.id}
                  image={user?.image}
                  companyName={user.companyName}
                  email={user.email}
                  organizationType={user.organizationType}
                  password={user.password}
                  province={user.province}
                  cityMunicipality={user.cityMunicipality}
                  username={user.username}
                  userId={user.id}
                  getUserData={getUserData}
                  handleDeleteUser={handleDeleteUser}
                />
              ))}
            </Table.Body>
          </Table>
          {showModal && (
            <>
              <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
                <div className="relative w-auto my-6 mx-auto max-w-2xl">
                  <form
                    onSubmit={handleSubmit(onSubmit)}
                    encType="multipart/form-data"
                  >
                    <div className="border-0 rounded-lg shadow-lg relative flex flex-col w-108 bg-white outline-none focus:outline-none xsm:h-3/4 xsm:w-80">
                      <div className="flex items-center justify-center p-4 border-solid mx-auto border-blueGray-200 rounded-t md:p-2">
                        <h3 className="text-2xl font-semibold md:text-clamp">
                          {userData.id ? "Edit Profile" : "Create User"}
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
                              alt={imagePreview ? imagePreview.name : null}
                              className="relative w-24 h-24 bg-white rounded-full flex justify-center items-center sm:w-28 sm:h-28 xsm:h-16 xsm:w-16"
                            />
                          ) : (
                            <img
                              src={defaultImage}
                              className="relative w-24 h-24 bg-white rounded-full flex justify-center items-center sm:w-28 sm:h-28 xsm:h-16 xsm:w-16"
                            />
                          )}
                        </span>
                        <div className="w-full text-center">
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
                        </div>

                        <p className="mt-5 mx-6 mb-0 text-[#5b5c61] text-clamp-xs leading-relaxed text-left xsm:mx-2">
                          Generate Account Settings:
                        </p>
                      </div>

                      <div className="relative overflow-hidden py-5">
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
                                  type="password"
                                  name="password"
                                  id="password"
                                  className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                                  {...register("password")}
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
                                <select
                                  id="organization-type"
                                  name="organizationType"
                                  className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                  {...register("organizationType", {
                                    required: "Please select organization type",
                                  })}
                                >
                                  {organizationType.map((item, index) => (
                                    <option
                                      id={index}
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                            <tr className="bg-white">
                              <th
                                scope="row"
                                className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                              >
                                City/Municipality:
                              </th>
                              <td className="px-6 py-2">
                                <select
                                  id="cityMunicipality"
                                  name="cityMunicipality"
                                  className="bg-gray-50 w-48 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                  {...register("cityMunicipality", {
                                    required: "Please select organization type",
                                  })}
                                >
                                  {cityMunicipality.map((item, index) => (
                                    <option
                                      id={index}
                                      key={item.valuye}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
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
                                  name="province"
                                  className="bg-gray-50 w-48 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block p-1.5"
                                  {...register("province", {
                                    required: "Please select a province",
                                  })}
                                >
                                  {provinces.map((item, index) => (
                                    <option
                                      id={index}
                                      key={item.value}
                                      value={item.value}
                                    >
                                      {item.label}
                                    </option>
                                  ))}
                                </select>
                              </td>
                            </tr>
                            <tr className="bg-white">
                              <th
                                scope="row"
                                className="px-6 py-2 font-medium text-gray-900 whitespace-nowrap"
                              >
                                Is Admin?
                              </th>
                              <td className="px-6 py-2">
                                <label className="inline-flex items-center cursor-pointer">
                                  <input
                                    type="checkbox"
                                    {...register("isAdmin")}
                                  />
                                </label>
                              </td>
                            </tr>
                          </tbody>
                        </table>
                      </div>

                      <div className="flex items-center justify-end p-3 border-t border-solid border-blueGray-200 rounded-b md:p-2">
                        <button
                          className="text-red-500 background-transparent font-bold uppercase px-3 py-2 text-sm outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                          type="button"
                          onClick={onClose}
                        >
                          Close
                        </button>
                        <button
                          className="bg-[#31572C] text-white active:bg-[#2e4d29] font-bold uppercase text-xs px-6 py-3 rounded-full shadow hover:shadow-lg outline-none focus:outline-none mr-1 mb-1 ease-linear transition-all duration-150 md:text-clamp-button md:px-3 md:py-1"
                          type="submit"
                        >
                          {userData?.id ? "Update Profile" : "Create User"}
                        </button>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
              <div className="opacity-25 fixed inset-0 z-40 bg-black" />
            </>
          )}
        </div>
      </div>
    </div>
  );
}
