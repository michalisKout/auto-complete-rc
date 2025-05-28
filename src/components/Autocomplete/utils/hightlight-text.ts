type HighlightedText = {
  beforeMatch?: string;
  match: string;
  afterMatch?: string;
};

/**
 * This is made only for simple highlighting. Advanced highlighting requires different strategies based on the particular use cases.
 * @param text the whole text to search in
 * @param query text to highlight
 * @returns highlighted text object with beforeMatch, match, and afterMatch properties or pass through text if no match
 */
export const highlightMatch = (text: string, query: string): HighlightedText | string => {
  if (!query) {
    return text;
  }

  const lowerText = text.toLowerCase().trim();
  const lowerQuery = query.toLowerCase().trim();
  const matchIndex = lowerText.indexOf(lowerQuery);

  if (matchIndex === -1) {
    return text;
  }

  const beforeMatch = text.substring(0, matchIndex);
  const match = text.substring(matchIndex, matchIndex + query.length);
  const afterMatch = text.substring(matchIndex + query.length);

  return {
    beforeMatch,
    match,
    afterMatch,
  };
};
