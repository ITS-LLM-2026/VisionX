import { createContext } from 'react';

export interface RouterContextType {
  currentPath: string;
  navigate: (to: string) => void;
}

export const RouterContext = createContext<RouterContextType>({
  currentPath: '/',
  navigate: () => {},
});
