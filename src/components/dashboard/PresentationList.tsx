import React, { useCallback, useEffect, useMemo } from "react";
import PresentationCard from "./PresentationCard";
import { useSearchParams } from "next/navigation";
import {
  InfiniteData,
  useInfiniteQuery,
  useQueryClient,
} from "@tanstack/react-query";
import { fetchPresentations } from "@/app/actions/dataFetch";
import { Presentation } from "@prisma/client";
import Loader from "../custom/Loader";

type InfinitePresentationsData = InfiniteData<
  | {
      data: Presentation[];
      currentPage: number;
      nextPage: number | null;
    }
  | undefined
>;

function PresentationList() {
  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";
  const sortBy = searchParams.get("sortBy") || "desc";
  const queryClient = useQueryClient();
  const queryKey = useMemo(() => ["Presentations", title], [title]);

  const { data, isFetching, fetchNextPage, hasNextPage } = useInfiniteQuery({
    queryKey: queryKey,
    queryFn: ({ pageParam = 1 }) =>
      fetchPresentations({ pageParam, title, sortBy }),
    getNextPageParam: (lastPage) => {
      return lastPage?.nextPage;
    },
    refetchOnWindowFocus: false,
    refetchOnMount:true,
    refetchOnReconnect:true,
  });

  const handleScroll = useCallback(() => {
    const bottom =
      window.innerHeight + window.scrollY >=
      document.documentElement.scrollHeight - 1;
    if (bottom && hasNextPage) {
      fetchNextPage();
    }
  }, [hasNextPage, fetchNextPage]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [handleScroll]);

  const deletePresentation = (id: string) => {
    queryClient.setQueryData<InfinitePresentationsData>(queryKey, (oldData) => {
      if (!oldData) return oldData;
      return {
        ...oldData,
        pages: oldData.pages.map((page) => {
          if (!page) return page;

          return {
            ...page,
            data: page.data.filter(
              (presentation: Presentation) => presentation.id !== id
            ),
          };
        }),
        pageParams: oldData.pageParams,
      };
    });
  };

  return (
    <>
      <section
        aria-live="polite"
        aria-atomic="true"
        className="my-4 grid justify-items-center lg:grid-cols-4 gap-8 grid-cols-auto-fit-52 transition-all"
      >
        {data?.pages?.map((page, index) => {
          return (
            <React.Fragment key={index}>
              {page?.data?.map((presentation: Presentation) => {
                return (
                  <PresentationCard
                    presentation={presentation}
                    key={presentation.id}
                    highlight={title}
                    deletePresentation={deletePresentation}
                  ></PresentationCard>
                );
              })}
            </React.Fragment>
          );
        })}
      </section>

      {isFetching && <Loader />}
    </>
  );
}

export default PresentationList;
