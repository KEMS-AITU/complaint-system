import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { requestPasswordReset } from '../../features/auth/authApi';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { useTranslation } from '../../shared/lang/translations';

const ALLOWED_EMAIL_DOMAINS = ['astanait.edu.kz'];

const normalizeEmail = (value: string) => value.trim().toLowerCase();

export const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = (() => {
    const normalized = normalizeEmail(email);
    if (!normalized) return t('auth.forgot.email.error.required');
    if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(normalized)) {
      return t('auth.forgot.email.error.invalid');
    }
    const domain = normalized.split('@')[1];
    if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
      return t('auth.forgot.email.error.domain');
    }
    return '';
  })();
  const canSubmit = !emailError;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const result = await requestPasswordReset(normalizeEmail(email));

    if (result.ok) {
      setStatus('success');
      return;
    }

    setStatus('idle');
    setFormError(t('auth.forgot.error.generic'));
  };

  if (status === 'success') {
    return (
      <AuthCard title={t('auth.forgot.success.title')}>
        <p className="muted">{t('auth.forgot.success.body')}</p>
        <Link className="btn btn-primary" to="/login">
          {t('auth.forgot.success.back')}
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title={t('auth.forgot.title')}
      subtitle={t('auth.forgot.subtitle')}
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label={t('auth.forgot.email.label')}>
          <>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched(true)}
              aria-invalid={touched && emailError ? true : undefined}
              aria-describedby={touched && emailError ? 'forgot-email-error' : undefined}
              disabled={isLoading}
            />
            {touched && emailError ? (
              <span id="forgot-email-error" className="field-error">
                {emailError}
              </span>
            ) : null}
          </>
        </Field>
        <Button type="submit" disabled={!canSubmit || isLoading}>
          {isLoading ? t('auth.forgot.submit.loading') : t('auth.forgot.submit.idle')}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        <p className="muted">
          {t('auth.forgot.footer.remembered')}{' '}
          <Link to="/login">{t('auth.forgot.footer.link')}</Link>
        </p>
      </form>
    </AuthCard>
  );
};
