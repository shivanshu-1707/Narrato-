"use client";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { MinusSquare, PlusSquareIcon } from "lucide-react";
import { useState, useRef } from "react";
import { pdfjs, Document, Page } from "react-pdf";
// import "react-pdf/dist/esm/Page/AnnotationLayer.css";
// import "react-pdf/dist/esm/Page/TextLayer.css";
import DocumentLoader from "../DocumentLoader";
import DocumentLoadError from "../DocumentLoadError";
// import 'react-pdf/dist/Page/AnnotationLayer.css';
// import 'react-pdf/dist/Page/TextLayer.css';
import { Card } from "@/components/ui/card";

pdfjs.GlobalWorkerOptions.workerSrc = `//unpkg.com/pdfjs-dist@${pdfjs.version}/build/pdf.worker.min.mjs`;

const maxWidth = 800;

type Props = {
  url: string;
  width: number;
};

export default function PdfViewer({ url }: Props) {
  const [numPages, setNumPages] = useState<number>(0);
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [zoom, setZoom] = useState<number>(1);
  const pageRefs = useRef<(HTMLDivElement | null)[]>([]);
  const containerRef = useRef<HTMLDivElement | null>(null);

  const scrollToPage = (page: number) => {
    if (pageRefs.current[page - 1] && containerRef.current) {
      pageRefs.current[page - 1]?.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };
  const handleNextPage = () => {
    setCurrentPage((prev) => {
      const nextPage = Math.min(prev + 1, numPages);
      scrollToPage(nextPage);
      return nextPage;
    });
  };

  const handleScroll = () => {
    if (containerRef.current) {
      const scrollTop = containerRef.current.scrollTop;
      const pageHeight =
        pageRefs.current[0]?.getBoundingClientRect().height ?? 0;
      const currentPage = Math.floor(scrollTop / pageHeight) + 1;
      setCurrentPage(currentPage);
    }
  };

  const handlePrevPage = () => {
    setCurrentPage((prev) => {
      const prevPage = Math.max(prev - 1, 1);
      scrollToPage(prevPage);
      return prevPage;
    });
  };

  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const zoomIn = () => {
    setZoom((prev) => {
      if (prev != 1.5) {
        return prev + 0.25;
      } else {
        return prev;
      }
    });
  };

  const zoomOut = () => {
    setZoom((prev) => {
      if (prev != 0.5) {
        return prev - 0.25;
      } else {
        return prev;
      }
    });
  };
  return (
    <>
      <div className="relative group flex-col items-center ">
        <div
          ref={containerRef}
          className="overflow-scroll h-[550px] rounded-md flex-col items-stretch scroll-smooth"
          onScroll={handleScroll}
        >
          <Document
            file={url}
            onLoadSuccess={onDocumentLoadSuccess}
            loading={<DocumentLoader />}
            error={<DocumentLoadError message="Error Loading Pdf File" />}
          >
            {Array.from(new Array(numPages), (_el, index) => (
              <Card
                className="my-2 rounded-lg overflow-hidden bg-card"
                key={`page_${index + 1}`}
                ref={(el: HTMLDivElement | null) => {
                  pageRefs.current[index] = el;
                }}
              >
                <Page
                  scale={zoom}
                  pageNumber={index + 1}
                  width={maxWidth}
                  loading={<DocumentLoader />}
                  renderAnnotationLayer={false}
                  renderTextLayer={false}
                  className={"flex justify-center "}
                  canvasBackground="transparent"
                />
              </Card>
            ))}
          </Document>
        </div>
        <div className="w-full flex justify-center absolute  bottom-20 z-30 opacity-0 group-hover:opacity-100 transition-opacity ">
          <div className="w-auto flex justify-stretch gap-2 items-center bg-primary/80 backdrop-blur-sm hover:bg-primary/85 rounded-md ">
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer hover:bg-muted/35 transition-all"
              onClick={zoomOut}
            >
              <MinusSquare className="text-slate-800" />
            </Button>
            <span className="block text-white font-semibold">
              {Math.floor(zoom * 100)}%
            </span>
            <Button
              variant={"ghost"}
              size={"icon"}
              className="cursor-pointer hover:bg-muted/35 transition-all"
              onClick={zoomIn}
            >
              <PlusSquareIcon className="text-slate-800" />
            </Button>
          </div>
        </div>
        <div className="navigation w-auto mt-2 flex gap-2 justify-center items-center">
          <Button
            onClick={handlePrevPage}
            disabled={currentPage <= 1}
            variant={"default"}
          >
            Previous
          </Button>
          <div>
            <span className="font-semibold">
              Page &nbsp;
              <Input
                value={currentPage}
                type="number"
                onChange={(e) => {
                  const val: number = parseInt(e.target.value, 10);
                  scrollToPage(val);
                  setCurrentPage(val);
                }}
                min={0}
                max={numPages}
                className="max-w-max text-center p-1 inline outline-gray-50 h-7 "
                size={numPages.toString().length}
              />
              &nbsp;of {numPages}
            </span>
          </div>

          <Button onClick={handleNextPage} disabled={currentPage >= numPages}>
            Next
          </Button>
        </div>
      </div>
    </>
  );
}
