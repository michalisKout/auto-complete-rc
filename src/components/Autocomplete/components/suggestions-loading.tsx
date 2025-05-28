type Props = {
  loadingText: string;
};

export const SuggestionsLoading = ({ loadingText }: Props) => {
  return (
    <div className="autocomplete__loading">
      <div className="autocomplete__spinner" />
      {loadingText}
    </div>
  );
};
