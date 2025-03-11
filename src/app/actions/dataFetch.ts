// for infinite scroll
import qs from "query-string";
import toast from "react-hot-toast";
export const fetchPresentations = async ({
  pageParam,
  title,
  sortBy = "desc",
}: {
  pageParam: number;
  title: string;
  sortBy?: string;
}) => {
  try {
    const query = {
      title: title,
      sortBy: sortBy,
      pageNumber: pageParam,
    };
    const url = qs.stringifyUrl({
      url: "/api/presentation",
      query,
    });

    const response = await fetch(url, {
      method: "GET",
    });
    const result = await response.json();
    return {
      data: result.data,
      currentPage: pageParam,
      nextPage: 12 > result.data.length ? null : pageParam + 1,
    };
  } catch{
    console.log("error agya bhai");
    toast.error("Error fetching data",{id:"PRESENTATION_FETCHING"});
  }
};
