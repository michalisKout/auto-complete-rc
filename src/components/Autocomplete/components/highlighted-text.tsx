import { useMemo } from "react";
import { useSearchQuery } from "../context/search-query-context";
import { highlightMatch } from "../utils/hightlight-text";

export const HighlightedText = ({ text }: { text: string }) => {
  const { searchQuery } = useSearchQuery();
  const highlightedText = useMemo(() => highlightMatch(text, searchQuery), [text, searchQuery]);

  const noHighlightIncluded = typeof highlightedText === "string";

  if (noHighlightIncluded) return <span>{text}</span>;

  return (
    <span>
      {highlightedText.beforeMatch && <span>{highlightedText.beforeMatch}</span>}
      <span className="autocomplete__highlighted">{highlightedText.match}</span>
      {highlightedText.afterMatch && <span>{highlightedText.afterMatch}</span>}
    </span>
  );
};
