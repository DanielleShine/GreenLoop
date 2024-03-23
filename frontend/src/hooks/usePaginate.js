import { useSearchParams } from "react-router-dom";

export const usePaginate = (origWaste, POST_PER_PAGE = 6) => {
  const [searchParams, setSearchParams] = useSearchParams();

  const currentPage = !searchParams.get("page")
    ? 1
    : Number(searchParams.get("page"));

  const indexOfLastPost = currentPage * POST_PER_PAGE;
  const indexOfFirstPost = indexOfLastPost - POST_PER_PAGE;

  const currentPosts =
    origWaste?.length && origWaste?.slice(indexOfFirstPost, indexOfLastPost);

  return {
    searchParams,
    setSearchParams,
    currentPage,
    currentPosts,
  };
};
