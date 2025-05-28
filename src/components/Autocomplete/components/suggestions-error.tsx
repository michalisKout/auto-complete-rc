type Props = {
  message: string;
};

export const SuggestionsError = ({ message }: Props) => {
  return (
    <div className="autocomplete__error">
      <span className="autocomplete__error-icon">⚠️</span>
      {message}
    </div>
  );
};
