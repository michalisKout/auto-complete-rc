import { type HTMLAttributes, useCallback, useState } from "react";
import type { AutocompleteItem } from "../autocomplete.types";

export const FOCUS_INDEX_ENTRY_POINT = -1;

export const useAccessibility = ({
  isOpen,
  testId,
  filteredItems,
  onEnter,
  onReset,
}: {
  isOpen: boolean;
  testId?: string;
  filteredItems: AutocompleteItem[];
  onEnter?: (item: AutocompleteItem) => void;
  onReset?: () => void;
}): {
  handleKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
  focusedIndex: number;
  setFocusedIndex: (index: number) => void;
  accessibilityProps: HTMLAttributes<HTMLInputElement>;
} => {
  const [focusedIndex, setFocusedIndex] = useState(FOCUS_INDEX_ENTRY_POINT);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      let updatedIndex = FOCUS_INDEX_ENTRY_POINT;

      if (event.key === "ArrowDown")
        updatedIndex =
          focusedIndex < filteredItems.length - 1 ? focusedIndex + 1 : FOCUS_INDEX_ENTRY_POINT;

      if (event.key === "ArrowUp")
        updatedIndex =
          focusedIndex > FOCUS_INDEX_ENTRY_POINT ? focusedIndex - 1 : filteredItems.length - 1;

      if (
        event.key === "Enter" &&
        focusedIndex >= FOCUS_INDEX_ENTRY_POINT &&
        filteredItems[focusedIndex]
      )
        onEnter?.(filteredItems[focusedIndex]);

      if (event.key === "Escape" || event.key === "Tab") onReset?.();

      if (updatedIndex > FOCUS_INDEX_ENTRY_POINT) {
        setFocusedIndex(updatedIndex);
      } else if (updatedIndex && updatedIndex >= filteredItems.length)
        updatedIndex = FOCUS_INDEX_ENTRY_POINT;
    },
    [isOpen, focusedIndex, filteredItems, onEnter, onReset, setFocusedIndex],
  );

  return {
    handleKeyDown,
    focusedIndex,
    setFocusedIndex,
    accessibilityProps: {
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox",
      "aria-controls": isOpen ? testId : undefined,
      "aria-activedescendant":
        focusedIndex >= FOCUS_INDEX_ENTRY_POINT ? `${testId}-item-${focusedIndex}` : undefined,
      role: "combobox",
    },
  };
};
