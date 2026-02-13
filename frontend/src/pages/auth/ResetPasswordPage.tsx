import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { resetPassword } from '../../features/auth/authApi';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { useTranslation } from '../../shared/lang/translations';

export const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token')?.trim() ?? '';

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({ password: false, confirmPassword: false });

  if (!token) {
    return (
      <AuthCard title={t('auth.reset.invalid.title')}>
        <p className="muted">{t('auth.reset.invalid.body')}</p>
        <Link className="btn btn-primary" to="/forgot-password">
          {t('auth.reset.invalid.cta')}
        </Link>
      </AuthCard>
    );
  }

  const passwordError = (() => {
    if (!password) return t('auth.reset.password.error.required');
    if (password.length < 8) return t('auth.reset.password.error.length');
    if (!/[A-Za-z]/.test(password) || !/[0-9]/.test(password)) {
      return t('auth.reset.password.error.complexity');
    }
    return '';
  })();

  const confirmPasswordError = (() => {
    if (!confirmPassword) return t('auth.reset.confirmPassword.error.required');
    if (password !== confirmPassword) return t('auth.reset.confirmPassword.error.mismatch');
    return '';
  })();
  const canSubmit = !passwordError && !confirmPasswordError;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const result = await resetPassword(token, password);

    if (result.ok) {
      setStatus('success');
      return;
    }

    setStatus('idle');
    setFormError(t('auth.reset.error.generic'));
  };

  if (status === 'success') {
    return (
      <AuthCard title={t('auth.reset.success.title')}>
        <p className="muted">{t('auth.reset.success.body')}</p>
        <Link className="btn btn-primary" to="/login">
          {t('auth.reset.success.back')}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('auth.reset.title')}
      subtitle={t('auth.reset.subtitle')}
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label={t('auth.reset.password.label')}>
          <>
            <div className="input-row">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={touched.password && passwordError ? true : undefined}
                aria-describedby={touched.password && passwordError ? 'reset-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={
                  showPassword
                    ? t('auth.reset.toggle.aria.hide')
                    : t('auth.reset.toggle.aria.show')
                }
                disabled={isLoading}
              >
                {showPassword ? t('auth.reset.toggle.hide') : t('auth.reset.toggle.show')}
              </button>
            </div>
            {touched.password && passwordError ? (
              <span id="reset-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label={t('auth.reset.confirmPassword.label')}>
          <>
            <div className="input-row">
              <Input
                type={showConfirmPassword ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(event) => setConfirmPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, confirmPassword: true }))}
                aria-invalid={touched.confirmPassword && confirmPasswordError ? true : undefined}
                aria-describedby={
                  touched.confirmPassword && confirmPasswordError
                    ? 'reset-confirm-password-error'
                    : undefined
                }
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowConfirmPassword((prev) => !prev)}
                aria-label={
                  showConfirmPassword
                    ? t('auth.reset.toggle.aria.hide')
                    : t('auth.reset.toggle.aria.show')
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? t('auth.reset.toggle.hide') : t('auth.reset.toggle.show')}
              </button>
            </div>
            {touched.confirmPassword && confirmPasswordError ? (
              <span id="reset-confirm-password-error" className="field-error">
                {confirmPasswordError}
              </span>
            ) : null}
          </>
        </Field>
        <Button type="submit" disabled={!canSubmit || isLoading}>
          {isLoading ? t('auth.reset.submit.loading') : t('auth.reset.submit.idle')}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
      </form>
    </AuthCard>
  );
};
