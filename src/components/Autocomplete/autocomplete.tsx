import { useCallback, useState } from "react";
import "./Autocomplete.css";
import { useAccessibility } from "./hooks/useAccessibility";
import { useAutocomplete } from "./hooks/useAutocomplete";
import { useClickOutside } from "./hooks/useClickOutside";
import { useScrollSync } from "./hooks/useScrollSync";
import type { AutocompleteItem, AutocompleteProps } from "./types";
import { debounce } from "./utils/debounce";

/**
 * Autocomplete component for searching and selecting items
 *
 * @param {AutocompleteProps} props - Component properties
 * @returns {JSX.Element} Rendered Autocomplete component
 */
export const Autocomplete: React.FC<AutocompleteProps> = ({
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
  const [inputValue, setInputValue] = useState("");
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
      setInputValue(item.label);
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
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleItemSelect = useCallback(
    (item: AutocompleteItem) => {
      setInputValue(item.label);
      onInputChange?.(item.label);
      setSelectedItem(item);
      setIsOpen(false);
      setFocusedIndex(-1);
      onSelect?.(item);
    },
    [onSelect, onInputChange, setFocusedIndex],
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(inputValue.length >= minChars);
  }, [inputValue.length, minChars]);

  const isSelected = useCallback(
    (itemId: number | string) => selectedItem?.id === itemId,
    [selectedItem],
  );

  const noResults = filteredItems.length === 0 && !isLoading && inputValue.length > 0;
  const hasError = !isLoading && error;
  const shouldShowItems = !isLoading && !noResults && !error;

  return (
    <div className={`autocomplete ${className}`} ref={ref}>
      <input
        {...accessibilityProps}
        onFocus={handleInputFocus}
        data-testid={inputId}
        type="text"
        className={`autocomplete__input ${error ? "autocomplete__input--error" : ""}`}
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
        onKeyDown={handleKeyDown}
      />

      {isOpen && (
        <div
          data-testid={dropdownId}
          aria-expanded={true}
          className="autocomplete__dropdown"
          role="listbox"
          aria-label="Search results"
          tabIndex={-1}
        >
          {hasError && <div className="autocomplete__error">{error}</div>}
          {isLoading && (
            <div className="autocomplete__loading">
              <div className="autocomplete__spinner" />
              {loadingText}
            </div>
          )}
          {shouldShowItems &&
            filteredItems?.map((item, index) => (
              <div
                key={item.id}
                id={`${dropdownId}-item-${index}`}
                className={`autocomplete__item ${isSelected(item.id) ? "autocomplete__item--selected" : ""}`}
                aria-selected={index === focusedIndex}
                onClick={() => handleItemSelect(item)}
              >
                {item.label}
              </div>
            ))}

          {noResults && !error && <div className="autocomplete__no-results">{noResultsText}</div>}
        </div>
      )}
    </div>
  );
};
