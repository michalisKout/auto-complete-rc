import { useCallback, useState } from "react";
import "./Autocomplete.css";
import { useAutocomplete } from "./hooks/useAutocomplete";
import { useClickOutside } from "./hooks/useClickOutside";
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
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem | null>(null);
  const { filteredItems, isLoading, asyncSearch, setIsLoading, error } = useAutocomplete(
    filterItems,
    {
      defaultItems,
      minChars,
    },
  );

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
    setIsLoading(true);
    setInputValue(value);
    debouncedSearch(value);
  };

  const handleItemSelect = useCallback(
    (item: AutocompleteItem) => {
      setInputValue(item.label);
      onInputChange?.(item.label);
      setSelectedItem(item);
      setIsOpen(false);
      onSelect?.(item);
    },
    [onSelect, onInputChange],
  );

  const handleInputFocus = useCallback(() => {
    setIsOpen(inputValue.length >= minChars);
  }, [inputValue.length, minChars]);

  const isSelected = useCallback(
    (itemId: number | string) => selectedItem?.id === itemId,
    [selectedItem],
  );

  const inputId = `autocomplete-input-${testId}`;
  const dropdownId = `autocomplete-dropdown-${testId}`;
  const noResults = filteredItems.length === 0 && !isLoading && inputValue.length > 0;
  const hasError = !isLoading && error;
  const shouldShowItems = !isLoading && !noResults && !error;

  return (
    <div className={`autocomplete ${className}`} ref={ref}>
      <input
        onFocus={handleInputFocus}
        data-testid={inputId}
        type="text"
        className="autocomplete__input"
        value={inputValue}
        onChange={handleInputChange}
        placeholder={placeholder}
        disabled={disabled}
        autoComplete="off"
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
                aria-selected={selectedItem?.id === item.id}
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
