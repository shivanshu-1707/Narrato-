"use client";
import React, { useMemo } from "react";
type Props = {
  url: string;
};

function PPTViewer({ url }: Props) {
  const encodedUrl = useMemo(() => encodeURIComponent(url),[url]);
  return (
    <div className="w-full h-[550px]">
      <iframe
        src={`https://view.officeapps.live.com/op/embed.aspx?src=${encodedUrl}`}
        className="w-full h-full"
      ></iframe>
    </div>
  );
}

export default PPTViewer;
