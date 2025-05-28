export type AutocompleteInputProps = {
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
};

export type FilterItemsOperator = (
  searchQuery: string,
  abortSignal?: AbortSignal,
) => Promise<AutocompleteItem[]> | AutocompleteItem[];

export type AutocompleteItem = {
  id: string | number;
  label: string;
  value: string;
};

export type UseAutocompleteOptions = {
  defaultItems?: AutocompleteItem[];
  minChars?: number;
};

export type ANY = any;
