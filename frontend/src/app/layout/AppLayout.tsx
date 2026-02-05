import { NavLink, Outlet } from 'react-router-dom';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { useTranslation } from '../../shared/lang/translations';
import { TopBar } from '../../shared/layout/TopBar';

export const AppLayout = () => {
  const { token, isAdmin, userIdentifier, userName, userEmail, userId, clearToken } = useAuth();
  const { t } = useTranslation();

  const displayIdentifier = userName || userEmail || userIdentifier || userId;

  const navItems = token
    ? [
        // Home видна только обычным пользователям
        ...(!isAdmin ? [{ to: '/', label: t('nav.home') }] : []),
        ...(!isAdmin ? [{ to: '/my-complaints', label: t('nav.myComplaints') }] : []),
        // New complaint hidden for admin users
        ...(!isAdmin ? [{ to: '/create', label: t('nav.newComplaint') }] : []),
        // Track и Feedback только для админов, Feedback скрыт
        ...(isAdmin
          ? [{ to: '/track', label: t('nav.trackComplaint') }]
          : []),
      ]
    : [{ to: '/auth', label: t('nav.signIn') }];

  return (
    <div className="app">
      <div className="app-shell">
        <div className="header-shell">
          <div className="header-inner">
            <TopBar />
          </div>
        </div>
        <div className="shell">
          <aside className="sidebar">
            <div className="brand">
              <div className="brand-mark">CH</div>
              <div>
                <p className="brand-title">{t('app.name')}</p>
                <p className="brand-subtitle">{t('app.subtitle')}</p>
              </div>
            </div>
            <nav className="nav">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  className={({ isActive }) =>
                    `nav-link${isActive ? ' nav-link-active' : ''}`
                  }
                >
                  {item.label}
                </NavLink>
              ))}
            </nav>
            <div className="token-panel">
              <p className="panel-label">{t('session.label')}</p>
              <div style={{ display: 'flex', justifyContent: 'flex-start' }}>
                <span className={token ? 'pill pill-good' : 'pill pill-warn'}>
                  {token
                    ? displayIdentifier
                      ? `${t('session.signedInAs')} ${displayIdentifier}`
                      : t('session.signedIn')
                    : t('session.signedOut')}
                </span>
              </div>
              {token ? (
                <Button variant="ghost" onClick={clearToken}>
                  {t('session.switchAccount')}
                </Button>
              ) : (
                <p className="panel-note">{t('session.note')}</p>
              )}
            </div>
          </aside>
          <main className="content">
            <div className="content-inner">
              <div className="page">
                <Outlet />
              </div>
            </div>
          </main>
        </div>
      </div>
    </div>
  );
};
