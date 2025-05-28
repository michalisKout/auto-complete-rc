type Props = {
  message: string;
};

export const SuggestionsNoResults = ({ message }: Props) => {
  return (
    <div className="autocomplete__no-results">
      <span className="autocomplete__no-results-icon">🔍</span>
      {message}
    </div>
  );
};
