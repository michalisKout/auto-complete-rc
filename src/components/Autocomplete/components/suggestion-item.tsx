import type { AutocompleteItem } from "../autocomplete.types";
import { HighlightedText } from "./highlighted-text";

type Props = {
  dropdownId: string;
  item: AutocompleteItem;
  index: number;
  isSelected: boolean;
  isFocused: boolean;
  handleItemSelect: (item: AutocompleteItem) => void;
};

export const SuggestionItem = ({
  dropdownId,
  item,
  index,
  handleItemSelect,
  isSelected,
  isFocused,
}: Props) => {
  return (
    <div
      key={item.id}
      id={`${dropdownId}-item-${index}`}
      data-testid={`${dropdownId}-item-${index}`}
      className={`autocomplete__item ${isSelected ? "autocomplete__item--selected" : ""}`}
      aria-selected={isFocused}
      onClick={() => handleItemSelect(item)}
    >
      <HighlightedText text={item.label} />
    </div>
  );
};
