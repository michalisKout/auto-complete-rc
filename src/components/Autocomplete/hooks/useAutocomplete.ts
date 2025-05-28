import { useCallback, useEffect, useRef, useState } from "react";
import type {
  AutocompleteItem,
  FilterItemsOperator,
  UseAutocompleteOptions,
} from "../autocomplete.types";

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

      setIsLoading(true);

      // throttle requests if a previous request is still in progress
      if (refController.current) refController.current.abort();

      // create a AbortController instance for the current request
      refController.current = new AbortController();
      const currentController = refController.current;

      try {
        const results = await filterItems(query, currentController.signal);
        if (!currentController.signal.aborted) setFilteredItems(results);
      } catch (err) {
        const error = err as Error;
        const shouldIgnoreError = currentController.signal.aborted || error.name === "AbortError";
        if (shouldIgnoreError) return;

        setError(err instanceof Error ? err.message : "An error occurred");
        setFilteredItems([]);
      } finally {
        // only set loading to false if the request was not aborted
        if (!currentController.signal.aborted) setIsLoading(false);
      }
    },
    [filterItems, options?.minChars],
  );

  return { asyncSearch, filteredItems, isLoading, error, setIsLoading };
};
