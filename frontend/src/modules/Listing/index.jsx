import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";

import {
  IoFilter,
  IoSwapVerticalSharp,
  IoTrashBinSharp,
} from "react-icons/io5";
import { TbArrowBarLeft } from "react-icons/tb";

import Pagination from "../../components/Common/Pagination";
import ListingCard from "../../components/Common/ListingCard";
import SortByCard from "../../components/Common/SortByCard";
import mindanaoPlaces from "../../constants/mindanaoPlaces";

import { useWastes } from "../../hooks/useWaste";
import { usePaginate } from "../../hooks/usePaginate";

const categories = [
  "Plastic",
  "Plastic Bottle",
  "Glass",
  "Scrap Metal",
  "E-waste",
  "Textile",
  "Food waste",
  "Biodegradable waste",
];

const Listing = ({ myWaste }) => {
  document.title = "Green Loop | Listing";

  const [searchParams, setSearchParams] = useSearchParams();

  const searchQuery = searchParams.get("search") || "";
  const province = searchParams.get("province") || "";
  const cityMunicipality = searchParams.get("cityMunicipality") || "";
  const category = searchParams.get("category") || "";

  const { wastes, isLoading } = useWastes();

  let wasteItems;
  if (searchQuery) {
    wasteItems = wastes?.filter((waste) => waste.post.includes(searchQuery));
  } else {
    wasteItems = wastes;
  }

  const [currentCategories, setCategoryQuery] = useState([]);

  const [open, setOpen] = useState(true);
  const [isSortBy, setIsSortBy] = useState(false);
  const [places, setPlaces] = useState([]);
  const [filteredWaste, setFilteredWaste] = useState({});

  const wasteToDisplay = myWaste ? myWaste : wasteItems;
  const origWaste =
    province.length > 0 || category?.length > 0
      ? filteredWaste
      : wasteToDisplay;

  const {
    searchParams: paginatePage,
    setSearchParams: setPaginatePage,
    currentPage,
    currentPosts,
  } = usePaginate(origWaste);

  const handleOnChangeProvince = (e) => {
    let params = {};
    searchParams.delete("category");
    setSearchParams(searchParams);

    setCategoryQuery([]);

    if (
      e.target.id == "provinces" &&
      province &&
      e.target.value == "Select a Province"
    ) {
      searchParams.delete("province");
      searchParams.delete("cityMunicipality");
      setSearchParams(searchParams);

      setPlaces([]);
      setFilteredWaste({});
    } else {
      const filteredMunicipalities = mindanaoPlaces.filter((province) =>
        province.name.includes(e.target.value)
      );

      const wastesProvince = wasteToDisplay.filter((waste) =>
        waste.user.province.includes(e.target.value)
      );

      setFilteredWaste(wastesProvince);

      setPlaces(filteredMunicipalities[0].places);
      categories.map((category) => {
        document.getElementById(category).checked = false;
      });

      // if (searchParams.has("category")) {
      searchParams.delete("category");
      setSearchParams(searchParams);
      // }

      const items = e.target.value.split(" ");
      if (items.length > 3) {
        params["province"] = items.slice(0, 3).join();
        // params["cityMunicipality"] = filteredMunicipalities[0].places[0];

        document.getElementById("municipalities").value =
          filteredMunicipalities[0].places[0];

        setSearchParams(params);
      } else {
        params["province"] = e.target.value;
        // params["cityMunicipality"] = filteredMunicipalities[0].places[0];

        document.getElementById("municipalities").value =
          filteredMunicipalities[0].places[0];
        setSearchParams(params);
      }
    }
  };

  const handleOnChangeCityMunicipality = (e) => {
    let params = {};
    if (!e.target.value.includes("Select a City/Municipality")) {
      // Get the current category from the URL
      category && (params["category"] = category);

      // Get the current province from the URL
      params["province"] = province;
      params["cityMunicipality"] = e.target.value;

      setSearchParams(params);
      if (province && cityMunicipality && category) {
        console.log("CityMunicipality: True ehere");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            waste.user.cityMunicipality.includes(cityMunicipality)
          )
          .filter((waste) =>
            categories.some((category) => waste.wasteCategory == category)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && !cityMunicipality && categories) {
        console.log("CityMunicipality: True ehere - 1");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            categories.some((category) => waste.wasteCategory == category)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && cityMunicipality && !categories) {
        console.log("CityMunicipality: True ehere - 2");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            waste.user.cityMunicipality.includes(cityMunicipality)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && !cityMunicipality && !categories) {
        console.log("CityMunicipality: True ehere - 3");
        const wastesProvince = wasteToDisplay.filter((waste) =>
          waste.user.province.includes(province)
        );
        setFilteredWaste(wastesProvince);
      } else {
        console.log("CityMunicipality: True ehere reay - 4");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            waste.user.cityMunicipality.includes(cityMunicipality)
          );
        setFilteredWaste(wastesCategory);
      }
    }
  };
  const handleOnChangeCategory = (e) => {
    if (e.target.checked) {
      var categories = [...currentCategories, e.target.value];

      setCategoryQuery((prev) => [...prev, e.target.value]);
      searchParams.set("category", categories.join(","));

      if (province && cityMunicipality && categories) {
        console.log("True Category:");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            waste.user.cityMunicipality.includes(cityMunicipality)
          )
          .filter((waste) =>
            categories.some((category) => waste.wasteCategory == category)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && !cityMunicipality && categories) {
        console.log("True Category: - 1");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            categories.some((category) => waste.wasteCategory == category)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && cityMunicipality && !categories) {
        console.log("True Category: - 2");
        const wastesCategory = wasteToDisplay
          .filter((waste) => waste.user.province.includes(province))
          .filter((waste) =>
            waste.user.cityMunicipality.includes(cityMunicipality)
          );
        setFilteredWaste(wastesCategory);
      } else if (province && !cityMunicipality && !categories) {
        console.log("True Category: - 3");
        const wastesProvince = wasteToDisplay.filter((waste) =>
          waste.user.province.includes(province)
        );
        setFilteredWaste(wastesProvince);
      } else {
        console.log("True Category: - 4");
        const wastesCategory = wasteToDisplay.filter((waste) =>
          categories.some((category) => waste.wasteCategory == category)
        );
        setFilteredWaste(wastesCategory);
      }

      searchParams.get("province");
      searchParams.get("cityMunicipality");
      setSearchParams(searchParams);
    } else {
      setCategoryQuery((prev) =>
        prev.filter((category) => category !== e.target.value)
      );

      const categoryItems = category.split(",");
      const popCategory = categoryItems.indexOf(e.target.value);
      categoryItems.splice(popCategory, 1);
      if (categoryItems.length == 0) {
        if (province && cityMunicipality) {
          console.log("Remove: -1");
          const wastesCategory = wasteToDisplay
            .filter((waste) => waste.user.province.includes(province))
            .filter((waste) =>
              waste.user.cityMunicipality.includes(cityMunicipality)
            );

          setFilteredWaste(wastesCategory);
        } else {
          console.log("Remove: -2");
          const wastesCategory = wasteToDisplay.filter((waste) =>
            waste.user.province.includes(province)
          );
          setFilteredWaste(wastesCategory);
        }

        searchParams.delete("category");
        setSearchParams(searchParams);
      } else {
        if (province && cityMunicipality && categoryItems) {
          console.log("Else Category: - 1");
          const wastesCategory = wasteToDisplay
            .filter((waste) => waste.user.province.includes(province))
            .filter((waste) =>
              waste.user.cityMunicipality.includes(cityMunicipality)
            )
            .filter((waste) =>
              categoryItems.some((category) => waste.wasteCategory == category)
            );
          setFilteredWaste(wastesCategory);
        } else if (province && !cityMunicipality && categoryItems) {
          console.log("Else Category: - 2");
          const wastesCategory = wasteToDisplay
            .filter((waste) => waste.user.province.includes(province))
            .filter((waste) =>
              categoryItems.some((category) => waste.wasteCategory == category)
            );
          setFilteredWaste(wastesCategory);
        } else if (province && !cityMunicipality && !categoryItems) {
          console.log("Else Category: - 3");
          const wastesCategory = wasteToDisplay.filter((waste) =>
            waste.user.province.includes(province)
          );
          setFilteredWaste(wastesCategory);
        } else {
          const wastesCategory = wasteToDisplay.filter((waste) =>
            categoryItems.some((category) => waste.wasteCategory == category)
          );
          setFilteredWaste(wastesCategory);
        }

        searchParams.set("category", categoryItems.join(","));
        searchParams.get("province");
        searchParams.get("cityMunicipality");

        setSearchParams(searchParams);
      }
    }
  };

  const handleSortBy = (e) => {
    if (e.target.textContent == "Latest to Oldest") {
      origWaste?.sort((a, b) => new Date(a.createdAt) - new Date(b.createdAt));
    } else {
      origWaste.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
    }
    setIsSortBy(false);
  };

  const handleClearFilter = () => {
    document.getElementById("provinces").value = mindanaoPlaces[0].name;
    categories.map((category) => {
      document.getElementById(category).checked = false;
    });

    setPlaces([]);
    setCategoryQuery([]);

    searchParams.delete("category");
    searchParams.delete("province");
    searchParams.delete("cityMunicipality");

    setSearchParams(searchParams);
  };

  useEffect(() => {
    searchParams.delete("category");
    searchParams.delete("province");
    searchParams.delete("cityMunicipality");
    setSearchParams(searchParams);
  }, []);

  if (isLoading) return;

  return (
    <div
      className={`grid overflow-hidden w-full h-full ${
        myWaste
          ? "bg-[#F3F4F6] py-0"
          : !currentPosts?.length
          ? "bg-[#F8F8F8]"
          : "bg-white py-6"
      }`}
      id="listing"
    >
      <div
        className={`flex text-left justify-start items-center lg:h-[11rem] md:h-[10rem] sm:h-[9rem] xsm:h-[8rem] ${
          myWaste
            ? " pt-0 h-20 bg-[#F3F4F6] w-4/5"
            : " bg-[#4F772D] h-48 pt-12 shadow-sm"
        }`}
      >
        <p
          className={`w-screen font-normal lg:pl-20 lg:text-[2.5rem] md:pl-16 md:text-[2rem] md:justify-center sm:text-left sm:pl-14 sm:text-[2rem] xsm:text-[1.3rem] xsm:pl-11 2xsm:text-[1.2rem] ${
            myWaste ? "text-3xl pl-32 text-black" : "text-5xl pl-24 text-white"
          }`}
        >
          {myWaste ? "My Waste" : "WASTE LISTING"}
        </p>
      </div>
      <div className="w-screen px-32 grid md:px-0">
        <div className="flex items-center justify-between">
          <div className="flex md:ml-3" />

          <div className="flex items-center">
            {!myWaste && (
              <>
                {province || cityMunicipality || category ? (
                  <span
                    className="text-clamp-base hover:underline font-semibold cursor-pointer"
                    onClick={handleClearFilter}
                  >
                    Remove Filter
                  </span>
                ) : null}
                <button
                  className="p-2 m-4 rounded-lg bg-[#31572C] cursor-pointer"
                  onClick={() => setIsSortBy((sortby) => !sortby)}
                >
                  <IoSwapVerticalSharp className="text-white" />
                </button>
              </>
            )}
          </div>
        </div>

        {isSortBy && (
          <div className="absolute z-10 right-[26rem] top-[18rem] border border-green-500 md:top-[15rem] md:right-[21rem] sm:right-[20rem] sm:top-[14rem] xsm:top-[13rem]">
            <SortByCard handleSortBy={handleSortBy} />
          </div>
        )}
      </div>

      <div className="flex">
        {!myWaste && (
          <div
            className={`z-50  ${open ? "w-80" : "w-0"} ${
              currentPosts?.length ? "bg-white" : "bg-[#F8F8F8]"
            } pt-8 relative duration-300`}
          >
            <TbArrowBarLeft
              className={`absolute h-6 w-6 cursor-pointer -right-8 top-9 border-dark-purple
           border-2 ${!open && "rotate-180"}`}
              onClick={() => setOpen(!open)}
            />
            <div className="flex px-4 items-center">
              <IoFilter
                className={`cursor-pointer duration-500 ${
                  open && "rotate-[360deg]"
                }`}
              />
              <h1
                className={`origin-left px-4 font-medium text-xl duration-200 ${
                  !open && "scale-0"
                }`}
              >
                Filter
              </h1>
            </div>
            <ul className="absolute -right-0 px-6">
              <label
                htmlFor="provinces"
                className="block mb-2 text-sm font-medium text-gray-900 mt-5"
              >
                Select a Province
              </label>
              <select
                id="provinces"
                className="border border-gray-300 text-sm rounded-lg block w-full p-2.5 "
                onChange={(e) => handleOnChangeProvince(e)}
              >
                {mindanaoPlaces.map((province, index) => (
                  <option key={index} value={province.name}>
                    {province.name}
                  </option>
                ))}
              </select>
              <label
                htmlFor="municipalities"
                className="block mb-2 text-sm font-medium text-gray-900 mt-5"
              >
                Select a City or Municipality
              </label>
              <select
                id="municipalities"
                className="border text-sm rounded-lg w-full p-2.5 "
                onChange={(e) => handleOnChangeCityMunicipality(e)}
              >
                {places?.map((place, index) => (
                  <option key={index} value={place}>
                    {place}
                  </option>
                ))}
              </select>
              <label
                htmlFor="category"
                className="block mb-2 text-sm rounded-lg w-full mt-5"
              >
                Category
              </label>
              {categories.map((category, index) => (
                <div
                  id="category"
                  key={index}
                  className="mb-[0.125rem] block min-h-[1.5rem] pl-[1.5rem]"
                >
                  <input
                    id={category}
                    className="relative float-left -ml-[1.5rem] mt-1.5"
                    type="checkbox"
                    value={category}
                    onChange={(e) => handleOnChangeCategory(e)}
                  />
                  <label
                    className="inline-block pl-[0.15rem] hover:cursor-pointer"
                    htmlFor={category}
                  >
                    {category}
                  </label>
                </div>
              ))}
            </ul>
          </div>
        )}

        <div
          className={`w-full mt-7 grid gap-10 px-32 ${
            currentPosts?.length ? "grid-cols-3" : "h-108"
          } lg:grid-cols-2 lg:px-16 lg:gap-10 md:mt-4 md:gap-2 md:grid-cols-1 md:px-24 sm:px-16 xsm:px-4`}
        >
          {currentPosts?.length ? (
            currentPosts?.map((waste, index) => (
              <ListingCard key={index} waste={waste} />
            ))
          ) : (
            <span className="flex grid-cols-2 w-full text-3xl font-semibold justify-center items-center">
              <p className="flex items-center mt-24">
                <IoTrashBinSharp className="mr-2" /> No Waste Found
              </p>
            </span>
          )}
        </div>
      </div>
      {origWaste?.length > 2 && (
        <div className="flex justify-center px-6 mb-4 mt-10 lg:mb-16 sm:px-0 sm:pb-0 ">
          <Pagination
            origWaste={origWaste}
            paginatePage={paginatePage}
            setSearchParams={setPaginatePage}
            currentPage={currentPage}
          />
        </div>
      )}
    </div>
  );
};

export default Listing;
