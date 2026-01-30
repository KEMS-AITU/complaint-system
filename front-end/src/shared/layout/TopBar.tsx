import { useMemo, useState } from 'react';
import { useAuth } from '../auth/AuthContext';

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
  const [menuOpen, setMenuOpen] = useState(false);

  const displayName = userIdentifier || (token ? 'Signed in' : 'Guest');
  const initials = useMemo(() => getInitials(displayName), [displayName]);

  return (
    <header className="app-topbar">
      <div className="topbar-brand">
        <div className="topbar-title">SEMKi</div>
        <div className="topbar-subtitle">Student &amp; Staff Support Desk</div>
      </div>
      <div className="topbar-actions">
        <div className="topbar-lang">
          <button type="button" className="topbar-pill topbar-pill-active">
            EN
          </button>
          <button type="button" className="topbar-pill">
            RU
          </button>
          <button type="button" className="topbar-pill" aria-label="Toggle theme">
            🌙
          </button>
        </div>
        <button type="button" className="icon-button" aria-label="Toggle theme">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M21 14.5a8 8 0 0 1-10.5-10 8.5 8.5 0 1 0 10.5 10Z"
              fill="currentColor"
            />
          </svg>
        </button>
        <button type="button" className="icon-button" aria-label="Notifications">
          <svg viewBox="0 0 24 24" aria-hidden="true">
            <path
              d="M12 22a2.5 2.5 0 0 0 2.45-2h-4.9A2.5 2.5 0 0 0 12 22Zm7-6v-5a7 7 0 1 0-14 0v5l-2 2h18l-2-2Z"
              fill="currentColor"
            />
          </svg>
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
              <button type="button" className="user-item" disabled>
                Profile
              </button>
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
