import "./autocomplete.css";
import type { AutocompleteInputProps } from "./autocomplete.types";
import { AutocompleteInput } from "./components";
import { QueryProvider } from "./context/search-query-context";

/**
 * Autocomplete component for searching and selecting items
 *
 * @param {AutocompleteProps} props - Component properties
 * @returns {JSX.Element} Rendered Autocomplete component
 */
export const Autocomplete: React.FC<AutocompleteInputProps> = (props) => {
  return (
    <QueryProvider>
      <AutocompleteInput {...props} />
    </QueryProvider>
  );
};
