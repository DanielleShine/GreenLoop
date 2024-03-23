import { Link } from "react-router-dom";

import { transformText } from "../../../utils/plasticColors";

const PostCard = ({ props, defaultImage, wasteDefaultImage }) => {
  const { post, image, wasteCategory, user } = props;
  const transformedTexts = transformText(wasteCategory);

  return (
    <>
      <div className="bg-white border border-gray-200 shadow-sm rounded-3xl my-2">
        <article className="p-6">
          <footer className="flex items-left">
            <div className="flex items-left mb-5">
              <p className="inline-flex items-center mr-3 text-sm font-semibold text-black">
                <Link to={`profile/${user?._id}`}>
                  <img
                    className="w-11 h-11 mr-5 rounded-full cursor-pointer hover:opacity-80 xsm:w-9 xsm:h-9 xsm:mr-3"
                    src={user?.image ? image?.url : defaultImage}
                    alt={user?.companyName}
                  />
                </Link>
                <Link
                  className="hover:underline cursor-pointer xsm:text-[0.8rem]"
                  to={`profile/${user?._id}`}
                >
                  {user?.companyName ? user.companyName : "User"}
                </Link>
              </p>
            </div>
          </footer>
          <p className="text-gray-900 text-left xsm:text-[0.7rem]">{post}</p>
          <div className="flex flex-wrap mt-3">
            <p
              className={`text-black text-left py-1 text-[0.7rem] rounded-full border ${transformedTexts} p-3 xsm:text-[0.6rem]`}
            >
              {wasteCategory}
            </p>
          </div>
        </article>
        <div className="h-[18rem] flex items-center justify-between lg:justify-evenly xsm:h-[10rem] 2xsm:h-[8rem]">
          <div className="w-screen border rounded-b-3xl">
            <img
              src={image?.url ? image.url : wasteDefaultImage}
              className="object-cover w-full h-[18rem] rounded-b-3xl xsm:h-[10rem] 2xsm:h-[8rem]"
            />
          </div>
        </div>
      </div>
    </>
  );
};

export default PostCard;
