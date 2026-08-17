import { RefObject, useEffect } from "react";

type Options = {
  locked: boolean;
  activateClickOutside?: boolean;
  setLocked?: (lock: boolean) => void;
  clickOutsideRef?: RefObject<HTMLElement | null>;
};

export function useScrollLock({
  locked,
  activateClickOutside = false,
  clickOutsideRef,
  setLocked,
}: Options) {
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        clickOutsideRef?.current &&
        !clickOutsideRef?.current.contains(event.target as Node)
      ) {
        setLocked!(false);
      }
    };

    const scrollbarWidth =
      window.innerWidth - document.documentElement.clientWidth;

    if (locked) {
      if (activateClickOutside) {
        document.addEventListener("mousedown", handleClickOutside);
      }
      document.body.style.overflow = "hidden";
      document.body.style.paddingRight = `${scrollbarWidth}px`;
    } else {
      if (activateClickOutside) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    }

    return () => {
      if (activateClickOutside) {
        document.removeEventListener("mousedown", handleClickOutside);
      }
      document.body.style.overflow = "";
      document.body.style.paddingRight = "";
    };
  }, [activateClickOutside, clickOutsideRef, locked, setLocked]);
}
