import { useCallback, useState } from "react";
import { SuggestionsDropdown, SuggestionsError, SuggestionsLoading } from ".";
import type { AutocompleteInputProps, AutocompleteItem } from "../autocomplete.types";
import { useSearchQuery } from "../context/search-query-context";
import { useAccessibility } from "../hooks/useAccessibility";
import { useAutocomplete } from "../hooks/useAutocomplete";
import { useClickOutside } from "../hooks/useClickOutside";
import { useScrollSync } from "../hooks/useScrollSync";
import { debounce } from "../utils/debounce";

/**
 * Autocomplete component for searching and selecting items
 *
 * @param {AutocompleteInputProps} props - Component properties
 * @returns {JSX.Element} Rendered Autocomplete component
 */
export const AutocompleteInput: React.FC<AutocompleteInputProps> = ({
  onInputChange,
  placeholder = "Search...",
  className = "",
  disabled = false,
  testId = "test-id",
  defaultItems = [],
  onSelect,
  filterItems,
  debounceMs = 500,
  minChars = 1,
  noResultsText = "No results found",
  loadingText = "Searching...",
}) => {
  const inputId = `autocomplete-input-${testId}`;
  const dropdownId = `autocomplete-dropdown-${testId}`;
  const { searchQuery, setSearchQuery } = useSearchQuery();
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem | null>(null);
  const { filteredItems, isLoading, asyncSearch, error } = useAutocomplete(filterItems, {
    defaultItems,
    minChars,
  });

  const { accessibilityProps, setFocusedIndex, focusedIndex, handleKeyDown } = useAccessibility({
    isOpen,
    testId: dropdownId,
    filteredItems,
    onEnter: (item) => {
      setSelectedItem(item);
      setSearchQuery(item.label);
      onInputChange?.(item.label);
      setIsOpen(false);
    },
    onReset: () => {
      setIsOpen(false);
    },
  });

  useScrollSync({
    focusedIndex,
    dropdownId,
    isOpen,
  });

  const { ref } = useClickOutside<HTMLDivElement>({
    handleClick: () => {
      setIsOpen(false);
    },
    isOpen,
  });

  const handleSearch = useCallback(
    async (value: string) => {
      setIsOpen(value.length >= minChars && !disabled);
      onInputChange?.(value);
      await asyncSearch(value);
    },
    [onInputChange, disabled, asyncSearch, minChars],
  );

  const debouncedSearch = useCallback(debounce(handleSearch, debounceMs), []);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const value = event.target.value;
    setSearchQuery(value);
    debouncedSearch(value);
  };

  const handleItemSelect = useCallback(
    (item: AutocompleteItem) => {
      setSearchQuery(item.label);
      onInputChange?.(item.label);
      setSelectedItem(item);
      setIsOpen(false);
      setFocusedIndex(-1);
      onSelect?.(item);
    },
    [onSelect, onInputChange, setFocusedIndex, setSearchQuery],
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(searchQuery.length >= minChars);
  }, [searchQuery.length, minChars]);

  const handleSelectedState = useCallback(
    (itemId: number | string) => selectedItem?.id === itemId,
    [selectedItem],
  );

  const noResults = filteredItems.length === 0 && !isLoading && searchQuery.length > 0;
  const hasError = !isLoading && error;

  return (
    <div className={`autocomplete ${className}`} ref={ref}>
      <input
        {...accessibilityProps}
        onFocus={handleInputFocus}
        data-testid={inputId}
        type="text"
        className={`autocomplete__input ${error ? "autocomplete__input--error" : ""}`}
        value={searchQuery}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <SuggestionsDropdown
          dropdownId={dropdownId}
          filteredItems={filteredItems}
          focusedIndex={focusedIndex}
          loadingContent={isLoading && <SuggestionsLoading loadingText={loadingText} />}
          errorContent={hasError && <SuggestionsError message={error} />}
          shouldShowSuggestions={!isLoading && !noResults && !error}
          isSelected={handleSelectedState}
          handleItemSelect={handleItemSelect}
          noResultsText={noResultsText}
          shouldShowNoResults={noResults && !error}
        />
      )}
    </div>
  );
};
