import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

export const LoginForm = () => {
  const { setToken } = useAuth();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const result = await apiRequest<{ token: string }>('auth/login/', {
      method: 'POST',
      body: { username, password },
    });

    if (result.ok && result.data?.token) {
      setToken(result.data.token);
      setStatus('success');
      setMessage('Signed in successfully.');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Login failed.');
  };

  return (
    <Card>
      <h3>Login</h3>
      <p className="muted">Welcome back. Sign in to continue.</p>
      <form onSubmit={handleSubmit} className="form">
        <Field label="Username">
          <Input value={username} onChange={(e) => setUsername(e.target.value)} />
        </Field>
        <Field label="Password">
          <Input
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={status === 'loading'}>
          {status === 'loading' ? 'Signing in...' : 'Sign in'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
    </Card>
  );
};
