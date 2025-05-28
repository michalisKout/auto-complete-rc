import type { ReactNode } from "react";
import type { AutocompleteItem } from "../autocomplete.types";
import { SuggestionItem } from "./suggestion-item";
import { SuggestionsNoResults } from "./suggestions-no-results";

type Props = {
  dropdownId: string;
  noResultsText: string;
  filteredItems: AutocompleteItem[];
  focusedIndex: number;
  loadingContent: ReactNode;
  errorContent: ReactNode;
  shouldShowSuggestions: boolean;
  shouldShowNoResults: boolean;
  isSelected: (itemId: number | string) => boolean;
  handleItemSelect: (item: AutocompleteItem) => void;
};

export const SuggestionsDropdown = ({
  dropdownId,
  filteredItems,
  focusedIndex,
  isSelected,
  handleItemSelect,
  shouldShowSuggestions,
  loadingContent,
  errorContent,
  noResultsText,
  shouldShowNoResults,
}: Props) => {
  return (
    <div
      data-testid={dropdownId}
      className="autocomplete__dropdown"
      role="listbox"
      aria-label="Search results"
      tabIndex={-1}
    >
      {errorContent}
      {loadingContent}
      {shouldShowSuggestions &&
        filteredItems.map((item, index) => (
          <SuggestionItem
            key={item.id}
            dropdownId={dropdownId}
            item={item}
            index={index}
            isFocused={index === focusedIndex}
            isSelected={isSelected(item.id)}
            handleItemSelect={handleItemSelect}
          />
        ))}
      {shouldShowNoResults && <SuggestionsNoResults message={noResultsText} />}
    </div>
  );
};
