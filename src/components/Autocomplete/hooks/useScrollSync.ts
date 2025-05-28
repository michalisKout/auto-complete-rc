import { useEffect } from "react";
import { FOCUS_INDEX_ENTRY_POINT } from "./useAccessibility";

interface UseScrollSyncProps {
  focusedIndex: number;
  dropdownId: string;
  isOpen: boolean;
}

export const useScrollSync = ({ focusedIndex, dropdownId, isOpen }: UseScrollSyncProps) => {
  useEffect(() => {
    if (!isOpen || focusedIndex < FOCUS_INDEX_ENTRY_POINT) return;

    console;
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
