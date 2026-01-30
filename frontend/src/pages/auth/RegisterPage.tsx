import { useState } from 'react';
import { Link, Navigate } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { register } from '../../features/auth/authApi';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { Modal } from '../../shared/ui/Modal';
import { useTranslation } from '../../shared/lang/translations';

const ALLOWED_EMAIL_DOMAINS = ['astanait.edu.kz'];
const IS_SSO_ONLY = false;

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const validateFullName = (value: string, t: (key: string) => string) => {
  if (!value.trim()) return t('auth.register.fullName.error.required');
  return '';
};

const validateUniversityEmail = (value: string, t: (key: string) => string) => {
  const email = normalizeEmail(value);
  if (!email) return t('auth.register.email.error.required');
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return t('auth.register.email.error.invalid');
  const domain = email.split('@')[1];
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return t('auth.register.email.error.domain');
  }
  return '';
};

const validatePassword = (value: string, t: (key: string) => string) => {
  if (!value) return t('auth.register.password.error.required');
  if (value.length < 8) return t('auth.register.password.error.length');
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return t('auth.register.password.error.complexity');
  }
  return '';
};

const validateConfirmPassword = (password: string, confirm: string, t: (key: string) => string) => {
  if (!confirm) return t('auth.register.confirmPassword.error.required');
  if (password !== confirm) return t('auth.register.confirmPassword.error.mismatch');
  return '';
};

const splitName = (fullName: string) => {
  const parts = fullName.trim().split(/\s+/);
  const [first, ...rest] = parts;
  return {
    firstName: first ?? '',
    lastName: rest.join(' '),
  };
};

export const RegisterPage = () => {
  const { token } = useAuth();
  const { t } = useTranslation();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [studentId, setStudentId] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [agreed, setAgreed] = useState(false);
  const [termsOpen, setTermsOpen] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false,
    agreement: false,
  });

  if (token) {
    return <Navigate to="/" replace />;
  }

  if (IS_SSO_ONLY) {
    return (
      <AuthCard title="Create your account" subtitle="Use your university email to register">
        <p className="muted">
          Registration is handled through your university single sign-on. Continue with
          SSO to create your account.
        </p>
        <Link className="btn btn-primary" to="/login">
          Go to sign in
        </Link>
      </AuthCard>
    );
  }

  const fullNameError = validateFullName(fullName, t);
  const emailError = validateUniversityEmail(email, t);
  const passwordError = validatePassword(password, t);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword, t);
  const agreementError = agreed ? '' : t('auth.register.agreement.error');

  const canSubmit =
    !fullNameError &&
    !emailError &&
    !passwordError &&
    !confirmPasswordError &&
    agreed;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!canSubmit || isLoading) return;

    setStatus('loading');
    setFormError('');

    const { firstName, lastName } = splitName(fullName);
    const result = await register({
      username: studentId.trim() || normalizeEmail(email),
      password,
      email: normalizeEmail(email),
      first_name: firstName || undefined,
      last_name: lastName || undefined,
    });

    if (result.ok) {
      setStatus('success');
      return;
    }

    if (result.status === 429) {
      setFormError(t('auth.register.error.tooMany'));
    } else {
      setFormError(t('auth.register.error.generic'));
    }

    setStatus('idle');
  };

  return (
    <AuthCard title={t('auth.register.title')} subtitle={t('auth.register.subtitle')}>
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label={t('auth.register.fullName.label')}>
          <>
            <Input
              value={fullName}
              onChange={(event) => setFullName(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, fullName: true }))}
              aria-invalid={touched.fullName && fullNameError ? true : undefined}
              aria-describedby={touched.fullName && fullNameError ? 'register-name-error' : undefined}
              disabled={isLoading}
            />
            {touched.fullName && fullNameError ? (
              <span id="register-name-error" className="field-error">
                {fullNameError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label={t('auth.register.email.label')}>
          <>
            <Input
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, email: true }))}
              aria-invalid={touched.email && emailError ? true : undefined}
              aria-describedby={touched.email && emailError ? 'register-email-error' : undefined}
              disabled={isLoading}
            />
            {touched.email && emailError ? (
              <span id="register-email-error" className="field-error">
                {emailError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label={t('auth.register.studentId.label')}>
          <Input
            value={studentId}
            onChange={(event) => setStudentId(event.target.value)}
            disabled={isLoading}
          />
        </Field>
        <Field label={t('auth.register.password.label')}>
          <>
            <div className="input-row">
              <Input
                type={showPassword ? 'text' : 'password'}
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                onBlur={() => setTouched((prev) => ({ ...prev, password: true }))}
                aria-invalid={touched.password && passwordError ? true : undefined}
                aria-describedby={touched.password && passwordError ? 'register-password-error' : undefined}
                disabled={isLoading}
              />
              <button
                type="button"
                className="toggle-button"
                onClick={() => setShowPassword((prev) => !prev)}
                aria-label={showPassword ? t('auth.register.password.label') : t('auth.register.password.label')}
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.password && passwordError ? (
              <span id="register-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label={t('auth.register.confirmPassword.label')}>
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
                    ? 'register-confirm-password-error'
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
                    ? t('auth.register.confirmPassword.label')
                    : t('auth.register.confirmPassword.label')
                }
                disabled={isLoading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.confirmPassword && confirmPasswordError ? (
              <span id="register-confirm-password-error" className="field-error">
                {confirmPasswordError}
              </span>
            ) : null}
          </>
        </Field>
        <label className="checkbox-row">
          <input
            type="checkbox"
            checked={agreed}
            onChange={(event) => setAgreed(event.target.checked)}
            onBlur={() => setTouched((prev) => ({ ...prev, agreement: true }))}
            disabled={isLoading}
          />
          <span
            role="button"
            tabIndex={0}
            onClick={() => setTermsOpen(true)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                setTermsOpen(true);
              }
            }}
          >
            {t('auth.register.terms.link')}
          </span>
        </label>
        {touched.agreement && agreementError ? (
          <span className="field-error">{agreementError}</span>
        ) : null}
        <Button type="submit" disabled={!canSubmit || isLoading}>
          {isLoading ? t('auth.register.submit.loading') : t('auth.register.submit.idle')}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        {status === 'success' ? (
          <Notice tone="success">{t('auth.register.success')}</Notice>
        ) : null}
        <p className="muted">
          {t('auth.register.footer.text')}{' '}
          <Link to="/login">{t('auth.register.footer.link')}</Link>
        </p>
      </form>
      <Modal
        open={termsOpen}
        title={t('auth.register.terms.title')}
        onClose={() => setTermsOpen(false)}
      >
        <p>{t('auth.register.terms.body')}</p>
        <div style={{ display: 'flex', gap: 8, marginTop: 12 }}>
          <Button
            type="button"
            onClick={() => {
              setAgreed(true);
              setTouched((prev) => ({ ...prev, agreement: true }));
              setTermsOpen(false);
            }}
          >
            {t('auth.register.terms.accept')}
          </Button>
          <Button type="button" onClick={() => setTermsOpen(false)}>
            {t('auth.register.terms.close')}
          </Button>
        </div>
      </Modal>
    </AuthCard>
  );
};
