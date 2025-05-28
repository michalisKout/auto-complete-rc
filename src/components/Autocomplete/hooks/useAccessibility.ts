import { type HTMLAttributes, useCallback, useState } from "react";
import type { AutocompleteItem } from "../autocomplete.types";

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
  const [focusedIndex, setFocusedIndex] = useState(-1);

  const handleKeyDown = useCallback(
    (event: React.KeyboardEvent<HTMLInputElement>) => {
      let updatedIndex = -1;

      if (event.key === "ArrowDown")
        updatedIndex = focusedIndex < filteredItems.length - 1 ? focusedIndex + 1 : -1;

      if (event.key === "ArrowUp")
        updatedIndex = focusedIndex > -1 ? focusedIndex - 1 : filteredItems.length - 1;

      if (event.key === "Enter" && focusedIndex >= -1 && filteredItems[focusedIndex])
        onEnter?.(filteredItems[focusedIndex]);

      if (event.key === "Escape" || event.key === "Tab") onReset?.();

      if (updatedIndex > -1) {
        setFocusedIndex(updatedIndex);
      } else if (updatedIndex && updatedIndex >= filteredItems.length) updatedIndex = -1;
    },
    [isOpen, focusedIndex, filteredItems, onEnter, onReset],
  );

  return {
    handleKeyDown,
    focusedIndex,
    setFocusedIndex,
    accessibilityProps: {
      "aria-expanded": isOpen,
      "aria-haspopup": "listbox",
      "aria-controls": isOpen ? testId : undefined,
      "aria-activedescendant": focusedIndex >= -1 ? `${testId}-item-${focusedIndex}` : undefined,
      role: "combobox",
    },
  };
};
