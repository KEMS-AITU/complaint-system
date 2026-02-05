import { useState } from 'react';
import { Link, Navigate, useLocation } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { login } from '../../features/auth/authApi';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { useTranslation } from '../../shared/lang/translations';

const validateIdentifier = (value: string, t: (key: string) => string) => {
  if (!value.trim()) return t('auth.login.identifier.error');
  return '';
};

const validatePassword = (value: string, t: (key: string) => string) => {
  if (!value) return t('auth.login.password.error');
  return '';
};

export const LoginPage = () => {
  const { token, setToken, setUserIdentifier } = useAuth();
  const location = useLocation();
  const from = (location.state as { from?: { pathname: string } })?.from?.pathname ?? '/';
  const { t } = useTranslation();

  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({ identifier: false, password: false });

  if (token) {
    return <Navigate to={from} replace />;
  }

  const identifierError = validateIdentifier(identifier, t);
  const passwordError = validatePassword(password, t);
  const canSubmit = !identifierError && !passwordError;
  const isLoading = status === 'loading';

  const showIdentifierError = touched.identifier && identifierError;
  const showPasswordError = touched.password && passwordError;

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const result = await login({ username: identifier.trim(), password });

    if (result.ok && result.data?.token) {
      setToken(result.data.token);
      setUserIdentifier(identifier.trim());
      return;
    }

    if (result.status === 429) {
      setFormError(t('auth.login.error.tooMany'));
    } else if (result.status === 401 || result.status === 403) {
      setFormError(t('auth.login.error.invalid'));
    } else {
      setFormError(t('auth.login.error.generic'));
    }

    setStatus('idle');
  };

  return (
    <AuthCard title={t('auth.login.title')} subtitle={t('auth.login.subtitle')}>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label={t('auth.login.identifier.label')}>
          <>
            <Input
              value={identifier}
              onChange={(event) => setIdentifier(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, identifier: true }))}
              aria-invalid={showIdentifierError ? true : undefined}
              aria-describedby={showIdentifierError ? 'login-identifier-error' : undefined}
              disabled={isLoading}
            />
            {showIdentifierError ? (
              <span id="login-identifier-error" className="field-error">
                {identifierError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label={t('auth.login.password.label')}>
          <>
            <div className="input-row">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={showPasswordError ? true : undefined}
                aria-describedby={showPasswordError ? 'login-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('auth.login.password.label') : t('auth.login.password.label')}
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {showPasswordError ? (
              <span id="login-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <div className="auth-row">
          <label className="checkbox-row">
            <input
              type="checkbox"
              checked={remember}
              onChange={(event) => setRemember(event.target.checked)}
              disabled={isLoading}
            />
            <span>{t('auth.login.rememberMe')}</span>
          </label>
          <Link to="/forgot-password">{t('auth.login.forgotPassword')}</Link>
        </div>
        <Button type="submit" disabled={!canSubmit || isLoading} className="auth-login-button">
          {isLoading ? t('auth.login.submit.loading') : t('auth.login.submit.idle')}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        <p className="muted">
          {t('auth.login.footer.text')}{' '}
          <Link to="/register">{t('auth.login.footer.link')}</Link>
        </p>
      </form>
    </AuthCard>
  );
};
