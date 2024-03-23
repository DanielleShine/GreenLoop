const Info = ({ handleSubmit, onCloseModal, user }) => {
  return (
    <>
      <div className="justify-center items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
        <div className="relative w-auto my-6 mx-auto max-w-2xl">
          <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
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
                        imagePreview ? URL.createObjectURL(imagePreview) : null
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
                      {image.length ? "Replace" : "Update Profile Picture"}
                    </p>
                  </label>
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
                          defaultValue={user[0].companyName}
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
                          defaultValue={user[0].username}
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
                          defaultValue={user[0].password}
                          {...register("password")}
                          onMouseOut={() => setInputType("password")}
                          onMouseEnter={() => setInputType("text")}
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
                          defaultValue={user[0].organizationType}
                          disabled
                        />
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
                        <input
                          type="text"
                          name="cityMunicipality"
                          id="cityMunicipality"
                          className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                          defaultValue={user[0].cityMunicipality}
                          {...register("cityMunicipality")}
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
                        <input
                          type="text"
                          name="province"
                          id="province"
                          className="w-4/5 rounded-md text-[#5b5c61] border-none focus:ring-transparent focus:border-transparent focus:text-black md:w-24"
                          defaultValue={user[0].province}
                          {...register("province")}
                        />
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
  );
};

export default Info;
