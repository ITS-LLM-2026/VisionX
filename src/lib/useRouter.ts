import { useContext } from 'react';
import { RouterContext } from './routerContext';

export const useRouter = () => useContext(RouterContext);
