import { Link } from "react-router-dom";

import { transformText } from "../../../utils/plasticColors";
import defaultImage from "../../../assets/images/waste-default-image.webp";

const ListingCard = ({ waste }) => {
  const url = window.location.href;
  const isProfile = url.split("/").includes("profile");

  const { image, post, user, wasteCategory } = waste;
  const transformedTexts = transformText(wasteCategory);

  return !isProfile ? (
    <Link to={`/profile/${user?._id}`}>
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl my-2 md:my-4">
        <div className="h-80 flex items-center justify-between lg:justify-evenly sm:h-40 2xsm:h-28">
          <div className="w-screen border rounded-t-3xl">
            <img
              src={image?.url ? image?.url : defaultImage}
              className="object-cover w-full h-80 rounded-t-3xl sm:h-40 2xsm:h-32"
            />
          </div>
        </div>
        <article className="p-6">
          <p className="text-gray-900 text-left  xsm:text-[0.7rem]">{post}</p>
          <div className="flex flex-wrap mt-3">
            <p
              className={`text-black text-left py-1 text-[0.7rem] rounded-full ${transformedTexts} m-1 p-3`}
            >
              {wasteCategory || "undefined"}
            </p>
          </div>
        </article>
      </div>
    </Link>
  ) : (
    <div className="bg-white border border-gray-200 shadow-sm rounded-3xl my-2 md:my-4">
      <div className="h-80 flex items-center justify-between lg:justify-evenly sm:h-40 2xsm:h-28">
        <div className="w-screen border rounded-t-3xl">
          <img
            src={image?.url ? image?.url : defaultImage}
            className="object-cover w-full h-80 rounded-t-3xl sm:h-40 2xsm:h-32"
          />
        </div>
      </div>
      <article className="p-6">
        <p className="text-gray-900 text-left  xsm:text-[0.7rem]">{post}</p>
        <div className="flex flex-wrap mt-3">
          <p
            className={`text-black text-left py-1 text-[0.7rem] rounded-full ${transformedTexts} m-1 p-3`}
          >
            {wasteCategory || "undefined"}
          </p>
        </div>
      </article>
    </div>
  );
};

export default ListingCard;
