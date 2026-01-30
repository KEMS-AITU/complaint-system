import { useState } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { AuthCard } from '../../features/auth/AuthCard';
import { resetPassword } from '../../features/auth/authApi';
import { Button } from '../../shared/ui/Button';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

const validatePassword = (value: string) => {
  if (!value) return 'Password is required.';
  if (value.length < 8) return 'Password must be at least 8 characters.';
  if (!/[A-Za-z]/.test(value) || !/[0-9]/.test(value)) {
    return 'Password must include at least one letter and one number.';
  }
  return '';
};

const validateConfirmPassword = (password: string, confirm: string) => {
  if (!confirm) return 'Confirm your password.';
  if (password !== confirm) return 'Passwords do not match.';
  return '';
};

export const ResetPasswordPage = () => {
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
      <AuthCard title="Invalid or expired link.">
        <p className="muted">Please request a new password reset email.</p>
        <Link className="btn btn-primary" to="/forgot-password">
          Request a new link
        </Link>
      </AuthCard>
    );
  }

  const passwordError = validatePassword(password);
  const confirmPasswordError = validateConfirmPassword(password, confirmPassword);
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
    setFormError('Unable to reset password. Please try again.');
  };

  if (status === 'success') {
    return (
      <AuthCard title="Password updated">
        <p className="muted">Your password has been updated. You can sign in now.</p>
        <Link className="btn btn-primary" to="/login">
          Back to sign in
        </Link>
      </AuthCard>
    );
  }

  return (
    <AuthCard
      title="Set a new password"
      subtitle="Choose a strong password you haven't used before"
    >
      <form onSubmit={handleSubmit} className="form" noValidate>
        <Field label="New password">
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
                aria-label={showPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showPassword ? 'Hide' : 'Show'}
              </button>
            </div>
            {touched.password && passwordError ? (
              <span id="reset-password-error" className="field-error">
                {passwordError}
              </span>
            ) : null}
          </>
        </Field>
        <Field label="Confirm new password">
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
                aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
                disabled={isLoading}
              >
                {showConfirmPassword ? 'Hide' : 'Show'}
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
          {isLoading ? 'Updating...' : 'Update password'}
        </Button>
        {formError ? <Notice tone="warning">{formError}</Notice> : null}
      </form>
    </AuthCard>
  );
};
