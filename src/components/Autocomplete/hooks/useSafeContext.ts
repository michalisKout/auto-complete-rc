import type {Context} from 'react';
import {useContext} from 'react';

export function useSafeContext<T>(Context: Context<T>, hookName: string) {
  const context = useContext(Context);

  if (context === undefined) {
    throw new Error(`value for ${hookName} was not initialized. Make sure the Provider is set up.`);
  }

  return context;
}
