import React, { useMemo } from "react";

import PresentationList from "./PresentationList";
import FileUploadButton from "./FileUploadModal";
import SearchInput from "./SearchInput";
import { useSearchParams } from "next/navigation";
import { useQueryClient } from "@tanstack/react-query";

function PresentationGallery() {
  const queryClient = useQueryClient();

  const searchParams = useSearchParams();
  const title = searchParams.get("title") || "";

  const queryKey = useMemo(() => ["Presentations", title], [title]);

  const reFetchNewData = () => {
    queryClient.refetchQueries(queryKey);
  };
  return (
    <>
      <section className="my-6 flex flex-wrap gap-4 justify-between items-center ">
        {/* Search Input */}
        <SearchInput />

        {/* Sort By Select and File Upload */}
        <div className="relative w-full sm:w-auto flex gap-4 items-center justify-center mx-auto">
          {/* File Upload Button */}
          <div className="w-auto">
            <FileUploadButton updatePresentations={reFetchNewData} />
          </div>
        </div>
      </section>

      <PresentationList />
    </>
  );
}

export default PresentationGallery;
