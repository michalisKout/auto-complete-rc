import type { ANY } from "../autocomplete.types";

export const debounce = <R>(func: (...args: ANY[]) => R, delay: number) => {
  let timeoutId: number;
  return (...args: ANY[]) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(null, args), delay);
  };
};
