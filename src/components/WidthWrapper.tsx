import React from "react";

function WidthWrapper({ children }: { children: React.ReactNode }) {
  return <div className="sm:w-11/12 w-full mx-auto ">{children}</div>;
}

export default WidthWrapper;
