const sortByFields = ["Latest to Oldest", "Oldest to Latest"];

const SortByCard = ({ handleSortBy }) => {
  return (
    <div
      className={`z-50 max-w-sm absolute border border-violet-800"
      } border h-42 overflow-y-hidden text-base w-[18rem] list-none bg-white divide-y divide-gray-100 rounded-lg shadow-lg`}
      id="sortby-dropdown"
    >
      <div className="block px-4 py-2 text-clamp-base font-medium text-center text-gray-700 bg-gray-50 ">
        Sort by
      </div>
      <div>
        <div className="w-full rounded-full">
          {sortByFields.map((field, index) => (
            <div
              key={index}
              onClick={(e) => handleSortBy(e)}
              className="text-gray-500 flex justify-center py-3 font-normal text-clamp-xs hover:bg-gray-100 cursor-pointer"
            >
              {field}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default SortByCard;
