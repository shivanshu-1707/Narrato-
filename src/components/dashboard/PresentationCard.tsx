"use client";
import React, { useMemo, useRef, useState } from "react";
import { Card, CardContent } from "../ui/card";
import Image from "next/image";
import Link from "next/link";
import { Ellipsis, ExternalLink, Trash } from "lucide-react";
import { PresentationDisplayType } from "@/app/types/presentation";
import { getFileIcon } from "@/app/helper/fileToIcon";
import { DropdownMenu, DropdownMenuTrigger } from "../ui/dropdown-menu";
import {
  DropdownMenuContent,
  DropdownMenuItem,
} from "@radix-ui/react-dropdown-menu";
import toast from "react-hot-toast";
import { Skeleton } from "../ui/skeleton";
import clsx from "clsx";

type Props = {
  presentation: PresentationDisplayType;
  highlight: string;
  deletePresentation: (id: string) => void;
};

export const getHighlightedText = (text: string, highlight: string) => {
  if (!highlight) return text;
  const regex = new RegExp(`(${highlight})`, "gi");
  const parts = text.split(regex);
  return parts.map((part, index) =>
    regex.test(part) ? (
      <span key={index} className="bg-primary/50 font-bold">
        {part}
      </span>
    ) : (
      part
    )
  );
};

const PresentationCard = ({
  presentation,
  highlight,
  deletePresentation,
}: Props) => {
  const [isImageLoading, setIsImageLoading] = useState<boolean>(true);

  const linkRef = useRef<HTMLAnchorElement>(null);
  const imageLink = useMemo(() => {
    const tempLink = presentation.link.split("/upload/");
    const temp2 = tempLink[0]+"/upload/"+"f_webp,q_auto,w_500,h_500,c_fit/"+tempLink[1];
    const modifiedLink = temp2.replace(".pdf", ".png");
    console.log(modifiedLink);
    return modifiedLink;
  }, [presentation]);
  const handleParentClick = (
    event: React.MouseEvent<HTMLDivElement, MouseEvent>
  ) => {
    event.stopPropagation();
    if (linkRef.current && linkRef.current !== event.target) {
      linkRef.current.click();
    }
  };

  

  const deleteHandler = async () => {
    try {
      const response = await fetch("api/file/delete", {
        method: "DELETE",
        body: JSON.stringify({ pid: presentation.id }),
        headers: {
          "Content-Type": "application/json",
        },
      });
      if (response.ok) {
        deletePresentation(presentation.id);
        toast.success("Deleted");
      } else {
        throw new Error("Couldn't delete the file");
      }
    } catch (error) {
      if (error instanceof Error) {
        toast.error(error.message);
      } else {
        toast.error("unknown error occured");
      }
    }
  };

  return (
    <Card
      className="w-full h-full min-w-52 max-w-96 bg-muted hover:shadow-lg dark:bg-card focus:focus-within:outline-none focus:ring ring-ring focus-whitin:ring focus-within:ring-ring  cursor-pointer group/container transition-all"
      aria-label="Presentation"
      tabIndex={0}
      onClick={handleParentClick}
    >
      <CardContent className="h-full overflow-hidden rounded-lg flex-col items-center p-2  transition-all">
        <div className="w-full border border-border relative h-44  rounded-lg overflow-hidden ">
          <Skeleton
            className={clsx(
              isImageLoading ? "w-full h-full bg-gray-300" : "hidden"
            )}
          />
          <Image
            src={imageLink || getFileIcon(presentation.type)}
            className={clsx(
              isImageLoading
                ? "w-auto h-auto mx-auto object-cover group-hover/container:scale-105opacity-0 transition-all"
                : "w-auto h-auto mx-auto object-cover group-hover/container:scale-105 transition-all "
            )}
            alt="Presentation thumbnail"
            draggable="false"
            fill={true}
            onLoad={() => setIsImageLoading(false)}
            sizes="(max-width:200px) 70vw,(max-width:1200px) 30vw"
          />
          <div className="-z-20 group-hover/container:z-10 focus-within:z-10 relative w-full h-full transition-all  bg-slate-900/20 ">
            <DropdownMenu modal={true} >
              <DropdownMenuTrigger
                className="absolute top-1 right-10 focus:outline-none p-1 rounded-full hover:bg-primary-foreground group/menu focus:bg-primary-foreground"
              >
                <Ellipsis className="rounded-lg border stroke-2  border-primary hover:border-primary stroke-primary hover:stroke-primary group-focus/menu:primary group-focus/menu:border-primary" />
              </DropdownMenuTrigger>
              <DropdownMenuContent align="center" side="bottom" className="bg-secondary rounded-lg p-1 my-2">
                <DropdownMenuItem
                  className="text-center p-2 rounded-lg align-middle flex gap-2 items-center hover:bg-primary/25 outline-none hover:outline-none"
                  onClick={(e) => {
                    e.stopPropagation();
                    deleteHandler();
                  }}
                >
                  <Trash className="block size-4" />
                  <span className="block">Delete</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            <Link
              href={`/dashboard/${presentation.id}`}
              aria-label="Open the presentation"
              className="absolute top-1 right-1 focus:outline-none p-1 rounded-full hover:bg-primary-foreground/70 group/external focus:bg-primary-foreground/70"
              tabIndex={0}
              ref={linkRef}
            >
              <span className="rounded-full border border-primary  block p-1 group-hover/external:border-primary group-focus/external:border-primary">
                <ExternalLink className="stroke-primary stroke-2 size-4 group-hover/external:stroke-primary group-focus/external:stroke-600 "></ExternalLink>
              </span>
            </Link>
          </div>
        </div>
        <h2 className="presentation-title text-lg font-medium my-2 px-2 text-foreground  group-hover/container:text-primary group-focus/container:text-primary group-focus-within/container:text-primary">
          {getHighlightedText(presentation.title, highlight)}
        </h2>
      </CardContent>
    </Card>
  );
};

export default PresentationCard;
