import React, { useEffect } from "react";

interface OutsideClickHandlerPros {
  ref: React.RefObject<HTMLElement>;
  handler: () => void;
}

export default function useOutsideClick({
  ref,
  handler,
}: OutsideClickHandlerPros) {
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (ref.current && !ref.current.contains(event.target as Node)) {
        handler();
      }
    }

    // add an mouse click event listener to page when hook is first rendered
    document.addEventListener("mousedown", handleClickOutside);

    // remove the mouse click event listener when hook is no longer rendered
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [ref, handler]);
}
