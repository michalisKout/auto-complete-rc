import { useEffect, useMemo, useState } from "react";
import type {
  AutocompleteItem,
  FilterItemsOperator,
  UseAutocompleteOptions,
  UseAutocompleteReturn,
} from "../types";

const DEFAULT_MIN_CHARS = 2;

export const useAutocomplete = (
  query: string,
  filterItems: FilterItemsOperator,
  options: UseAutocompleteOptions,
): UseAutocompleteReturn => {
  const [filteredItems, setFilteredItems] = useState<AutocompleteItem[]>(
    options?.defaultItems || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    setError(null);

    const getFilteredItems = async (query: string) => {
      try {
        setIsLoading(true);
        const results = await filterItems(query);
        setFilteredItems(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    };

    if (query.length >= (options?.minChars || DEFAULT_MIN_CHARS)) getFilteredItems(query);
  }, [query, filterItems, options?.minChars]);

  return useMemo(() => ({ filteredItems, isLoading, error }), [filteredItems, isLoading, error]);
};
