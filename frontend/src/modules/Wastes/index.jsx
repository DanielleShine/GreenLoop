import { useMemo, useState } from "react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { useForm } from "react-hook-form";

import Table from "../../components/Common/Table";
import WasteList from "../../components/Management/WasteList";
import ErrorMessage from "../../components/Common/Message/ErrorMessage";
import { useUploadImage } from "../../hooks/useUploadImage";
import { useWastes } from "../../hooks/useWaste";
import { deleteWaste, updateWaste } from "../../api/waste";
import { wasteHeader } from "../../constants/wasteHeader";

import { wasteCategories } from "../../constants/wasteCategories";

export default function Wastes() {
  document.title = "Green Loop | Dashboard";
  const queryClient = useQueryClient();
  const [wasteData, setWasteData] = useState({});
  const [showModal, setShowModal] = useState(false);
  const [errors, setErrors] = useState({});

  const { wastes } = useWastes();
  const { image, fetchImage, imagePreview, setImage, setImagePreview } =
    useUploadImage();

  const { register, handleSubmit, reset } = useForm();

  const getWasteData = (wasteId) => {
    setShowModal(true);
    const wasteRecord = wastes.filter((waste) => waste.id == wasteId);
    console.log("wasteRecord: ", wasteRecord[0]);
    setWasteData(wasteRecord[0]);
  };

  const { mutate: handleUpdateWaste } = useMutation({
    mutationFn: (waste) => updateWaste(waste.wasteId, waste.formData),
    onSuccess: () => {
      alert("Waste updated successfully");
      queryClient.invalidateQueries({ queryKey: ["userWastes"] });
      reset();
      setShowModal(false);
      setWasteData({});
      setImagePreview("");
      setImage("");
    },
    onError: (error) => {
      setErrors(error?.response.data.errors);
    },
  });

  const { mutate: deleteWasteAction } = useMutation({
    mutationFn: (wasteId) => deleteWaste(wasteId),
    onSuccess: () => {
      alert("Waste has been deleted");
      queryClient.invalidateQueries({ queryKey: ["userWastes"] });
    },
    onError: (error) => {
      console.log("error: ", error);
    },
  });

  const onSubmit = (data) => {
    const formData = { ...data, image };
    handleUpdateWaste({ wasteId: wasteData.id, formData: formData });
  };

  const onClose = () => {
    setShowModal(false);
    setWasteData({});
    setImagePreview("");
    setImage("");
  };

  useMemo(() => {
    reset(wasteData);
  }, [wasteData, reset]);

  return (
    <>
      <div className="overflow-x-scroll shadow rounded-lg">
        <Table>
          <Table.Header
            data={wasteHeader}
            render={(header) => <Table.Column key={header} header={header} />}
          />
          <Table.Body>
            {wastes?.map((waste, i) => (
              <WasteList
                key={i}
                props={waste}
                getWasteData={getWasteData}
                deleteWasteAction={deleteWasteAction}
              />
            ))}
          </Table.Body>
        </Table>
        {showModal && (
          <>
            <div className="justify-center w-full items-center flex overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
              <div className="px-4 py-4 rounded-lg bg-white text-center justify-center">
                <form
                  onSubmit={handleSubmit(onSubmit)}
                  encType="multipart/form-data"
                  className="w-96 h-full"
                >
                  <div className="flex items-center w-full justify-end border-solid">
                    <div className="bg-white border-0 justify-center items-center mx-auto border-gray-200 w-full shadow-sm rounded-3xl">
                      <article className="p-4">
                        <footer className="flex justify-center items-center">
                          <div className="flex items-center mb-5">
                            <p className="inline-flex items-center text-3xl font-[500] text-[#4F772D]">
                              Waste Details
                            </p>
                          </div>
                        </footer>
                        <hr className="py-3" />
                        {errors?.post && (
                          <ErrorMessage error={errors?.post.message} />
                        )}

                        <textarea
                          id="post"
                          name="post"
                          rows="4"
                          className="text-gray-900 text-left w-full overflow-y-hidden mb-3 focus:outline-none focus: border-0"
                          placeholder="Say something about the waste"
                          {...register("post")}
                        />
                        <div className="grid">
                          {errors?.wasteCategory && (
                            <ErrorMessage
                              error={errors?.wasteCategory.message}
                            />
                          )}
                          <select
                            id="wasteCategory"
                            className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-primary-500 focus:border-primary-500 block w-2/5 p-2.5 md:w-[10rem]"
                            {...register("wasteCategory")}
                          >
                            <option value="">Select an option</option>
                            {wasteCategories.map((category) => (
                              <option key={category} value={category}>
                                {category}
                              </option>
                            ))}
                          </select>
                        </div>
                      </article>

                      {imagePreview ? (
                        <>
                          <img
                            src={
                              imagePreview
                                ? URL.createObjectURL(imagePreview)
                                : null
                            }
                            alt={wasteData?.post || null}
                            className="relative w-full h-48 border-2 bg-white rounded-lg flex justify-center items-center mb-5"
                          />
                          <label
                            htmlFor="image-upload"
                            className="w-full px-7 py-1 cursor-pointer mb-0 border rounded-full bg-[#F8F8F8]"
                          >
                            Replace
                          </label>
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={fetchImage}
                          />
                        </>
                      ) : (
                        <>
                          <div className="relative w-full h-48 border-dashed border-[#e9e4e4] border-2 bg-white rounded-lg flex justify-center items-center mb-5 md:h-[12rem] xsm:mb-0 xsm:h-[6rem]">
                            <img
                              src={wasteData?.image?.url}
                              className="relative w-full h-48 border-2 rounded-lg flex justify-center items-center"
                            />
                          </div>
                          <label
                            htmlFor="image-upload"
                            className="w-full px-7 py-1 cursor-pointer mb-0 border rounded-full bg-[#F8F8F8]"
                          >
                            Replace
                          </label>
                          <input
                            type="file"
                            id="image-upload"
                            className="hidden"
                            accept="image/*"
                            onChange={fetchImage}
                          />

                          {errors["image.url"] && (
                            <ErrorMessage error={errors["image.url"].message} />
                          )}
                        </>
                      )}
                      <div className="w-full text-right mt-10">
                        <hr className="py-3" />
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
                          Update Waste
                        </button>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
            <div className="opacity-25 fixed inset-0 z-40 bg-black" />
          </>
        )}
      </div>
    </>
  );
}
