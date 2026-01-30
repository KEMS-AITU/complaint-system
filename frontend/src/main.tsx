import React from 'react';
import ReactDOM from 'react-dom/client';
import { RouterProvider } from 'react-router-dom';
import { router } from './app/router';
import { AuthProvider } from './shared/auth/AuthContext';
import { LanguageProvider, useLanguage } from './shared/lang/LanguageContext';
import { ThemeProvider, useTheme } from './shared/theme/ThemeContext';
import './styles/global.css';

const floatingButtonStyle: React.CSSProperties = {
  padding: '8px 14px',
  borderRadius: 999,
  border: 'none',
  backgroundColor: '#111827',
  color: '#ffffff',
  fontSize: 14,
  cursor: 'pointer',
  boxShadow: '0 4px 10px rgba(0, 0, 0, 0.15)',
};

const LanguageSwitcher = () => {
  const { language, toggleLanguage } = useLanguage();

  return (
    <button
      type="button"
      onClick={toggleLanguage}
      style={{
        ...floatingButtonStyle,
      }}
    >
      {language === 'en' ? 'EN' : 'RU'}
    </button>
  );
};

const ThemeSwitcher = () => {
  const { theme, toggleTheme } = useTheme();
  const isDarkTheme = theme === 'dark';
  const title = isDarkTheme ? 'Тёмная тема' : 'Светлая тема';

  return (
    <button
      type="button"
      onClick={toggleTheme}
      title={title}
      aria-label={title}
      style={{
        ...floatingButtonStyle,
        backgroundColor: '#374151',
        padding: 10,
        width: 40,
        height: 40,
        display: 'inline-flex',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      {isDarkTheme ? (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M21 14.078A8.5 8.5 0 0 1 9.922 3a7 7 0 1 0 11.078 11.078Z"
            fill="currentColor"
          />
        </svg>
      ) : (
        <svg
          width="18"
          height="18"
          viewBox="0 0 24 24"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
          aria-hidden="true"
        >
          <path
            d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-14a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM4 13H3a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm18 0h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM5.636 6.636a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414Zm14.849 14.85a1 1 0 0 1-1.414 0l-.707-.708a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.415ZM18.364 6.636a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0ZM4.515 21.485a1 1 0 0 1 0-1.415l.707-.707a1 1 0 0 1 1.414 1.414l-.707.708a1 1 0 0 1-1.414 0Z"
            fill="currentColor"
          />
        </svg>
      )}
    </button>
  );
};

const FloatingControls = () => {
  return (
    <div
      style={{
        position: 'fixed',
        bottom: 16,
        right: 16,
        zIndex: 1000,
        display: 'flex',
        gap: 10,
        alignItems: 'center',
      }}
    >
      <ThemeSwitcher />
      <LanguageSwitcher />
    </div>
  );
};

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <ThemeProvider>
      <AuthProvider>
        <LanguageProvider>
          <>
            <RouterProvider router={router} />
            <FloatingControls />
          </>
        </LanguageProvider>
      </AuthProvider>
    </ThemeProvider>
  </React.StrictMode>
);
