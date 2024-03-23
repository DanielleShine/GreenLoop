import { TbCaretRightFilled, TbCaretLeftFilled } from "react-icons/tb";

const PAGE_SIZE = 6;
const POST_PER_PAGE = 6;

const Pagination = ({
  origWaste,
  paginatePage,
  setSearchParams,
  currentPage,
}) => {
  // Calculate actual number of pages
  const pageCount = Math.ceil(origWaste?.length / PAGE_SIZE);

  function nextPage() {
    const next = currentPage === pageCount ? currentPage : currentPage + 1;

    paginatePage.set("page", next);
    setSearchParams(paginatePage);
  }

  function prevPage() {
    const prev = currentPage === 1 ? currentPage : currentPage - 1;

    paginatePage.set("page", prev);
    setSearchParams(paginatePage);
  }

  const paginate = (pageNumber) => {
    paginatePage.set("page", pageNumber);
    setSearchParams(paginatePage);
  };

  const pageNumbers = [];
  for (let i = 1; i <= Math.ceil(origWaste.length / POST_PER_PAGE); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav className="flex row-span-1">
      <TbCaretLeftFilled
        onClick={prevPage}
        disabled={currentPage === 1}
        className={`hover:bg-primary-800 focus:ring-primary-300 h-12 w-12 cursor-pointer items-center justify-center text-center text-lg font-normal text-[#698c4e] ${
          currentPage === 1 && "cursor-no-drop"
        }`}
      />
      <ul className="pagination flex justify-center items-center">
        {pageNumbers.map((number) => (
          <li key={number} className="page-item cursor-pointer">
            <span
              onClick={() => paginate(number)}
              className="page-link px-4 py-3 mx-1 bg-[#698c4e] rounded-lg text-white hover:bg-[#31572C]"
            >
              {number}
            </span>
          </li>
        ))}
      </ul>
      <TbCaretRightFilled
        onClick={nextPage}
        disabled={currentPage === pageCount}
        className={`hover:bg-primary-800 focus:ring-primary-300 h-12 w-12 cursor-pointer items-center justify-center text-center text-lg font-normal text-[#698c4e] ${
          currentPage === pageCount && "cursor-no-drop"
        }`}
      />
    </nav>
  );
};

export default Pagination;
