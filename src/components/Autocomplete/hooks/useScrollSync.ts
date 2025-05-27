import { useEffect } from "react";

interface UseScrollSyncProps {
  focusedIndex: number;
  dropdownId: string;
  isOpen: boolean;
}

export const useScrollSync = ({ focusedIndex, dropdownId, isOpen }: UseScrollSyncProps) => {
  useEffect(() => {
    if (!isOpen || focusedIndex < 0) return;

    const selectedItemId = `${dropdownId}-item-${focusedIndex}`;
    const selectedItem = document.getElementById(selectedItemId);

    if (selectedItem) {
      selectedItem.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [dropdownId, focusedIndex, isOpen]);

  return null;
};
