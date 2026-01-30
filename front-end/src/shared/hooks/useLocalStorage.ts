import { useEffect, useState } from 'react';

export const useLocalStorage = (key: string, initialValue: string) => {
  const [value, setValue] = useState(() => {
    if (typeof window === 'undefined') return initialValue;
    const stored = window.localStorage.getItem(key);
    return stored ?? initialValue;
  });

  useEffect(() => {
    window.localStorage.setItem(key, value);
  }, [key, value]);

  return [value, setValue] as const;
};
