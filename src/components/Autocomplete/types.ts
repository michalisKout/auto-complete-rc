export interface AutocompleteProps {
  onInputChange?: (value: string) => void;
  onSelect?: (item: AutocompleteItem) => void;
  placeholder?: string;
  className?: string;
  testId?: string;
  defaultItems: AutocompleteItem[];
  disabled?: boolean;
  filterItems: FilterItemsOperator;
  minChars?: number;
  noResultsText?: string;
  loadingText?: string;
  debounceMs?: number;
}

export type FilterItemsOperator = (
  searchQuery: string,
  abortSignal?: AbortSignal,
) => Promise<AutocompleteItem[]> | AutocompleteItem[];
export interface AutocompleteItem {
  id: string | number;
  label: string;
  value: string;
}

export interface UseAutocompleteOptions {
  defaultItems?: AutocompleteItem[];
  minChars?: number;
}

export type ANY = any;
