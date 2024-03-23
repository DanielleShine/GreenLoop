import { useState } from "react";
import { useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";

import { IoAddSharp } from "react-icons/io5";
import ButtonOutline from "../../components/Common/ButtonOutline";

import { useUploadImage } from "../../hooks/useUploadImage";
import ErrorMessage from "../../components/Common/Message/ErrorMessage";
import { uploadPost } from "../../api/waste";
import { wasteCategories } from "../../constants/wasteCategories";

const Post = () => {
  document.title = "Green Loop | Post";

  const user = JSON.parse(localStorage.getItem("user:detail"));

  const [errors, setErrors] = useState({});
  const { image, imagePreview, fetchImage, setImagePreview, setImage } =
    useUploadImage();

  const { register, handleSubmit, reset } = useForm();

  const queryClient = useQueryClient();

  const { mutate: createWaste, isLoading: isCreating } = useMutation({
    mutationFn: (formData) => uploadPost(formData),
    onSuccess: () => {
      alert("Post uploaded successfully");
      queryClient.invalidateQueries({ queryKey: ["userWastes"] });
      reset();
      setImagePreview("");
      setImage([]);
    },
    onError: (error) => {
      console.log("errors: ", error);
      setErrors(error?.response.data.errors);
    },
  });

  const onSubmit = (data) => {
    const formData = { ...data, image, user: user?.id };
    createWaste(formData);
  };

  return (
    <div
      className="bg-[#F8F8F8] w-screen h-screen pt-[7rem] pb-11 md:pt-[7rem] md:pb-7"
      id="post"
    >
      <div className="w-screen px-[15rem] flex flex-col text-center justify-center xl:px-[12rem] lg:px-[9rem] md:px-[5rem] sm:px-[2rem] ">
        <form onSubmit={handleSubmit(onSubmit)} encType="multipart/form-data">
          <div className="bg-white border w-[60%] justify-center items-center mx-auto border-gray-200 px-12 shadow-sm rounded-3xl xl:w-[80%] lg:w-[90%] md:w-full md:px-4 ">
            <article className="p-4">
              <footer className="flex justify-center items-center">
                <div className="flex items-center mb-5">
                  <p className="inline-flex items-center text-3xl font-[500] text-[#4F772D]">
                    Post a Waste
                  </p>
                </div>
              </footer>
              <hr className="py-3" />
              {errors?.post && <ErrorMessage error={errors?.post.message} />}

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
                  <ErrorMessage error={errors?.wasteCategory.message} />
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
                  src={imagePreview ? URL.createObjectURL(imagePreview) : null}
                  alt={imagePreview ? imagePreview.name : null}
                  className="relative w-full h-[20rem] border-2 bg-white rounded-lg flex justify-center items-center mb-5"
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
                <div className="relative w-full h-[20rem] border-dashed border-[#e9e4e4] border-2 bg-white rounded-lg flex justify-center items-center mb-5 md:h-[12rem] xsm:mb-0 xsm:h-[6rem]">
                  <input
                    type="file"
                    id="image-upload"
                    className="hidden"
                    accept="image/*"
                    onChange={fetchImage}
                  />
                  <label
                    htmlFor="image-upload"
                    className="absolute cursor-pointer"
                  >
                    <IoAddSharp className="w-14 h-14 bg-[#F1F1F1] text-slate-400 rounded-lg m-2" />
                    <p className="text-slate-400 text-clamp-base">Add Image</p>
                  </label>
                </div>
                {errors["image.url"] && (
                  <ErrorMessage error={errors["image.url"].message} />
                )}
              </>
            )}

            <ButtonOutline
              disabled={isCreating}
              className="w-full my-10 sm:text-clamp-xs sm:py-2"
              type="submit"
            >
              Upload
            </ButtonOutline>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Post;
