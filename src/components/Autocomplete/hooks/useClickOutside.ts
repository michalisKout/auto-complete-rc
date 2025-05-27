import { useEffect, useRef } from "react";

export const useClickOutside = <E extends HTMLElement>({
  isOpen,
  handleClick,
}: { isOpen: boolean; handleClick: () => void }) => {
  const ref = useRef<E>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;

      if (!isOpen || !ref.current) return;
      if (ref.current.contains(target)) return;

      handleClick();
    };

    document.addEventListener("click", handleClickOutside);

    return () => document.removeEventListener("click", handleClickOutside);
  }, [isOpen, handleClick]);

  return { ref };
};
