import { useCallback, useState } from "react";
import "./Autocomplete.css";
import { useAutocomplete } from "./hooks/useAutocomplete";
import type { AutocompleteItem, AutocompleteProps } from "./types";

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
}) => {
  const [inputValue, setInputValue] = useState("");
  const [isOpen, setIsOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState<AutocompleteItem | null>(null);

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      setIsOpen(value.length > 0);
      onInputChange?.(value);
    },
    [onInputChange],
  );

  // TODO: Handle loading and error states
  const { filteredItems, isLoading, error } = useAutocomplete(inputValue, filterItems, {
    defaultItems,
  });

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

  const isSelected = useCallback(
    (itemId: number | string) => selectedItem?.id === itemId,
    [selectedItem],
  );

  const inputId = `autocomplete-input-${testId}`;
  const dropdownId = `autocomplete-dropdown-${testId}`;

  return (
    <div className={`autocomplete ${className}`}>
      <input
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
          {filteredItems?.map((item, index) => (
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
        </div>
      )}
    </div>
  );
};
