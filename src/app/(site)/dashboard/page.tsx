"use client";
import PresentationGallery from "@/components/dashboard/PresentationGallery";
import React from "react";

const Page = () => {
  return (
    <>
      <div className="w-full px-4 my-1">
        <main className="w-full  mx-auto ">
          <section className="flex items-center justify-between min-w-max my-4">
            <h1 className="block text-lg sm:text-2xl font-medium min-w-max">
              Your Presentation
            </h1>
          </section>

          <PresentationGallery />
        </main>
      </div>
    </>
  );
};

export default Page;
