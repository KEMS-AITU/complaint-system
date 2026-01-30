import { createContext, ReactNode, useContext, useEffect } from 'react';
import { useLocalStorage } from '../hooks/useLocalStorage';

type Theme = 'light' | 'dark';

type ThemeContextValue = {
  theme: Theme;
  setTheme: (theme: Theme) => void;
  toggleTheme: () => void;
};

const ThemeContext = createContext<ThemeContextValue | undefined>(undefined);

export const ThemeProvider = ({ children }: { children: ReactNode }) => {
  const [theme, setTheme] = useLocalStorage('app-theme', 'light');

  useEffect(() => {
    if (typeof document === 'undefined') return;

    if (theme === 'dark') {
      document.documentElement.setAttribute('data-theme', 'dark');
      document.documentElement.style.colorScheme = 'dark';
    } else {
      document.documentElement.removeAttribute('data-theme');
      document.documentElement.style.colorScheme = 'light';
    }
  }, [theme]);

  const handleSetTheme = (next: Theme) => {
    setTheme(next);
  };

  const toggleTheme = () => {
    handleSetTheme((theme === 'dark' ? 'light' : 'dark') as Theme);
  };

  return (
    <ThemeContext.Provider
      value={{
        theme: theme as Theme,
        setTheme: handleSetTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};

export const useTheme = () => {
  const ctx = useContext(ThemeContext);
  if (!ctx) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return ctx;
};

