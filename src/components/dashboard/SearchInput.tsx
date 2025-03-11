"use client";
import qs from "query-string";
import { Search } from "lucide-react";
import React, { ChangeEventHandler, useEffect, useState } from "react";
import { Input } from "../ui/input";
import { useRouter, useSearchParams } from "next/navigation";
import { useDebounce } from "@/app/hooks/useDebounce";

function SearchInput() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const title = searchParams.get("title");
  const [titleVal, setTitleVal] = useState(title || "");

  const debouncedValue = useDebounce<string>(titleVal, 500);

  const onChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    setTitleVal(e.target.value);
  };

  useEffect(() => {
    const query = {
      title: debouncedValue,
    };
    const currentUrl = window.location.href;
    const newUrl = qs.stringifyUrl(
      {
        url: window.location.href,
        query,
      },
      { skipEmptyString: true, skipNull: true }
    );
    if (currentUrl !== newUrl) {
      router.push(newUrl);
    }
  }, [debouncedValue, router]);
  return (
    <div className="relative w-full sm:w-1/2 lg:w-1/3 flex-shrink flex-grow">
      <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
      <Input
        value={titleVal}
        onChange={onChange}
        type="text"
        className="text-slate-600 border-gray-400 rounded-sm p-3 pl-10 font-medium placeholder-gray-400 focus:ring-gray-600 focus:border-gray-600 w-full"
        placeholder="Search presentations..."
        id="file-search-query"
      />
    </div>
  );
}

export default SearchInput;
