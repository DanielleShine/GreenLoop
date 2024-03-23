import { useState } from "react";

export const useUploadImage = () => {
  const [image, setImage] = useState([]);
  const [imagePreview, setImagePreview] = useState("");

  const fetchImage = (e) => {
    const file = e.target.files[0];
    setImagePreview(file);

    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => {
      setImage(reader.result);
    };
  };
  return { image, fetchImage, imagePreview, setImage, setImagePreview };
};
