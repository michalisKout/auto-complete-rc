import { useCallback, useState } from "react";
import "./Autocomplete.css";
import type { AutocompleteProps } from "./types";

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
}) => {
  const [inputValue, setInputValue] = useState("");

  const handleInputChange = useCallback(
    (event: React.ChangeEvent<HTMLInputElement>) => {
      const value = event.target.value;
      setInputValue(value);
      onInputChange?.(value);
    },
    [onInputChange],
  );

  const inputId = `autocomplete-input-${testId}`;

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
    </div>
  );
};
