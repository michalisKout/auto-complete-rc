import type { AutocompleteItem } from "../autocomplete.types";

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
      className={`autocomplete__item ${isSelected ? "autocomplete__item--selected" : ""}`}
      aria-selected={isFocused}
      onClick={() => handleItemSelect(item)}
    >
      {item.label}
    </div>
  );
};
