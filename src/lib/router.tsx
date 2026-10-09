import React, { useState, useEffect } from 'react';
import { RouterContext } from './routerContext';

export const RouterProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const getPath = () => {
    if (typeof window === 'undefined') return '/';
    const path = window.location.pathname;
    const hash = window.location.hash;
    if (path === '/scan' || hash === '#/scan' || hash === '#scan') {
      return '/scan';
    }
    return '/';
  };

  const [currentPath, setCurrentPath] = useState<string>(getPath);

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(getPath());
    };

    window.addEventListener('popstate', handlePopState);
    window.addEventListener('hashchange', handlePopState);

    return () => {
      window.removeEventListener('popstate', handlePopState);
      window.removeEventListener('hashchange', handlePopState);
    };
  }, []);

  const navigate = (to: string) => {
    if (typeof window !== 'undefined') {
      window.history.pushState({}, '', to);
      setCurrentPath(to);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };

  return (
    <RouterContext.Provider value={{ currentPath, navigate }}>
      {children}
    </RouterContext.Provider>
  );
};
