import { useCallback, useEffect, useRef, useState } from "react";
import type { AutocompleteItem, FilterItemsOperator, UseAutocompleteOptions } from "../types";

const DEFAULT_MIN_CHARS = 1;

export const useAutocomplete = (
  filterItems: FilterItemsOperator,
  options: UseAutocompleteOptions,
) => {
  const refController = useRef<AbortController | null>(null);
  const [filteredItems, setFilteredItems] = useState<AutocompleteItem[]>(
    options?.defaultItems || [],
  );
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    refController.current = new AbortController();
    return () => {
      if (refController.current) {
        refController.current.abort();
        refController.current = null;
      }
    };
  }, []);

  const asyncSearch = useCallback(
    async (query: string) => {
      setError(null);
      if (query.length < (options?.minChars || DEFAULT_MIN_CHARS)) return;

      try {
        const results = await filterItems(query, refController.current?.signal);
        setFilteredItems(results);
      } catch (err) {
        setError(err instanceof Error ? err.message : "An error occurred");
        setFilteredItems([]);
      } finally {
        setIsLoading(false);
      }
    },
    [filterItems, options?.minChars],
  );

  return { asyncSearch, filteredItems, isLoading, error, setIsLoading };
};
