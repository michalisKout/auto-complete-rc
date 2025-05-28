import type React from "react";
import { type ReactNode, createContext, useState } from "react";
import { useSafeContext } from "../hooks/useSafeContext";

interface SearchQueryContextType {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
}

const SearchQueryContext = createContext<SearchQueryContextType | undefined>(undefined);

interface QueryProviderProps {
  children: ReactNode;
}

export const QueryProvider: React.FC<QueryProviderProps> = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState<string>("");

  return (
    <SearchQueryContext.Provider value={{ searchQuery, setSearchQuery }}>
      {children}
    </SearchQueryContext.Provider>
  );
};

export const useSearchQuery = (): SearchQueryContextType => {
  return useSafeContext(SearchQueryContext, "QueryContext");
};
