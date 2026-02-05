import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../auth/AuthContext';
import { useLanguage } from '../lang/LanguageContext';
import { useTheme } from '../theme/ThemeContext';
import logo from '../../assets/Leeft.svg';

const getInitials = (value: string) => {
  const trimmed = value.trim();
  if (!trimmed) return 'U';
  const parts = trimmed.split(/\s+/);
  const first = parts[0]?.[0] ?? '';
  const second = parts[1]?.[0] ?? '';
  return (first + second).toUpperCase() || trimmed.slice(0, 2).toUpperCase();
};

export const TopBar = () => {
  const { token, userIdentifier, clearToken } = useAuth();
  const { language, setLanguage } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = userIdentifier || (token ? 'Signed in' : 'Guest');
  const initials = useMemo(() => getInitials(displayName), [displayName]);
  const isDarkTheme = theme === 'dark';

  return (
    <header className="dashboard-header">
      <div className="header-left">
        <Link to="/" className="header-logo-link" aria-label="Home">
          <img src={logo} alt="SEMKi logo" className="header-logo" />
        </Link>
        <div className="header-title">
          <div className="topbar-title">SEMKi</div>
          <div className="topbar-subtitle">Complaint Management System</div>
        </div>
      </div>
      <div className="header-right">
        <div className="topbar-lang">
          <button
            type="button"
            className={`topbar-pill${language === 'en' ? ' topbar-pill-active' : ''}`}
            onClick={() => setLanguage('en')}
          >
            EN
          </button>
          <button
            type="button"
            className={`topbar-pill${language === 'ru' ? ' topbar-pill-active' : ''}`}
            onClick={() => setLanguage('ru')}
          >
            RU
          </button>
        </div>
        <button type="button" className="icon-button" aria-label="Toggle theme" onClick={toggleTheme}>
          {isDarkTheme ? (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M21 14.078A8.5 8.5 0 0 1 9.922 3a7 7 0 1 0 11.078 11.078Z"
                fill="currentColor"
              />
            </svg>
          ) : (
            <svg viewBox="0 0 24 24" aria-hidden="true">
              <path
                d="M12 18a6 6 0 1 1 0-12 6 6 0 0 1 0 12Zm0-14a1 1 0 0 1-1-1V2a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1Zm0 20a1 1 0 0 1-1-1v-1a1 1 0 1 1 2 0v1a1 1 0 0 1-1 1ZM4 13H3a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2Zm18 0h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM5.636 6.636a1 1 0 0 1-1.414 0l-.707-.707a1 1 0 1 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.414Zm14.849 14.85a1 1 0 0 1-1.414 0l-.707-.708a1 1 0 0 1 1.414-1.414l.707.707a1 1 0 0 1 0 1.415ZM18.364 6.636a1 1 0 0 1 0-1.414l.707-.707a1 1 0 1 1 1.414 1.414l-.707.707a1 1 0 0 1-1.414 0ZM4.515 21.485a1 1 0 0 1 0-1.415l.707-.707a1 1 0 0 1 1.414 1.414l-.707.708a1 1 0 0 1-1.414 0Z"
                fill="currentColor"
              />
            </svg>
          )}
        </button>
        <div className="user-menu">
          <button
            type="button"
            className="user-button"
            onClick={() => setMenuOpen((prev) => !prev)}
            aria-haspopup="menu"
            aria-expanded={menuOpen}
          >
            <span className="user-initials">{initials}</span>
            <span className="user-name">{displayName}</span>
            <span className="user-chevron" aria-hidden="true">
              <svg viewBox="0 0 24 24">
                <path d="m6 9 6 6 6-6" fill="none" stroke="currentColor" strokeWidth="2" />
              </svg>
            </span>
          </button>
          {menuOpen ? (
            <div className="user-dropdown" role="menu">
              <Link to="/account" className="user-item" onClick={() => setMenuOpen(false)}>
                Account
              </Link>
              <button
                type="button"
                className="user-item"
                onClick={() => {
                  setMenuOpen(false);
                  clearToken();
                }}
              >
                Sign out
              </button>
            </div>
          ) : null}
        </div>
      </div>
    </header>
  );
};
