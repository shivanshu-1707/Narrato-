import clsx from "clsx";
import React, { useRef } from "react";

type ModalProps = {
  children: React.ReactNode;
  isOpen?: boolean;
  handleClose: () => void;
};

function Modal({ children, isOpen, handleClose }: ModalProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const handleClick = (e: React.MouseEvent<HTMLElement, MouseEvent>) => {
    e.stopPropagation();
    if (containerRef.current && containerRef.current === e.target) {
      handleClose();
    }
  };
  return (
    <>
      {
        <div
          className={clsx(
            "transition-opacity  overflow-hidden fixed w-screen min-w-max h-screen",
            {
              "opacity-100  bg-black/50 z-30 left-0 top-0 ": isOpen,
              " bg-black/50 opacity-0 inset-0 -z-50": !isOpen,
            }
          )}
        >
          <div
            className="h-full w-full flex flex-col items-center justify-center transition-all"
            onClick={handleClick}
            ref={containerRef}
          >
            {children}
          </div>
        </div>
      }
    </>
  );
}

export default Modal;
