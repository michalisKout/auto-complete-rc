export interface AutocompleteProps {
  onInputChange?: (value: string) => void;
  onSelect?: (item: AutocompleteItem) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
  defaultItems: AutocompleteItem[];
  disabled?: boolean;
  filterItems: FilterItemsOperator;
}

export type FilterItemsOperator = (
  searchQuery: string,
) => Promise<AutocompleteItem[]> | AutocompleteItem[];
export interface AutocompleteItem {
  id: string | number;
  label: string;
  value: string;
}

export interface UseAutocompleteOptions {
  defaultItems?: AutocompleteItem[];
  minChars?: number;
  maxResults?: number;
  debounceMs?: number;
}

export interface UseAutocompleteReturn {
  filteredItems: AutocompleteItem[];
  isLoading: boolean;
  error: string | null;
}
