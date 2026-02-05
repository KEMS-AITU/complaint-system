import { useState } from 'react';
import { Link } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { requestPasswordReset } from '../../features/auth/authApi';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

const ALLOWED_EMAIL_DOMAINS = ['astanait.edu.kz'];

const normalizeEmail = (value: string) => value.trim().toLowerCase();

const validateUniversityEmail = (value: string) => {
  const email = normalizeEmail(value);
  if (!email) return 'Email is required.';
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(email)) return 'Enter a valid email.';
  const domain = email.split('@')[1];
  if (!ALLOWED_EMAIL_DOMAINS.includes(domain)) {
    return `Use your university email (e.g., name@${ALLOWED_EMAIL_DOMAINS[0]}).`;
  }
  return '';
};

export const ForgotPasswordPage = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');
  const [formError, setFormError] = useState('');
  const [touched, setTouched] = useState(false);

  const emailError = validateUniversityEmail(email);
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
    setFormError('Unable to send reset email. Please try again.');
  };

  if (status === 'success') {
    return (
      <AuthCard title="Check your email">
        <p className="muted">
          If an account exists for that email, we sent a password reset link.
        </p>
        <Link className="btn btn-primary" to="/login">
          Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Forgot your password?"
      subtitle="Enter your email and well send a reset link"
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label="Email">
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
          {isLoading ? 'Sending...' : 'Send reset link'}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
        <p className="muted">
          Remembered your password? <Link to="/login">Sign in</Link>
        </p>
      </form>
    </AuthCard>
  );
};
