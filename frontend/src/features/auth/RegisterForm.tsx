import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { Select } from '../../shared/ui/Select';

export const RegisterForm = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [email, setEmail] = useState('');
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [role, setRole] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const payload: Record<string, string> = {
      username,
      password,
    };
    if (email) payload.email = email;
    if (firstName) payload.first_name = firstName;
    if (lastName) payload.last_name = lastName;
    if (role) payload.role = role;

    const result = await apiRequest('auth/register/', {
      method: 'POST',
      body: payload,
    });

    if (result.ok) {
      setStatus('success');
      setMessage('Account created. You can sign in now.');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Registration failed.');
  };

  return (
    <Card>
      <h3>Register</h3>
      <p className="muted">Create your account to start submitting complaints.</p>
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
        <Field label="Email (optional)">
          <Input type="email" value={email} onChange={(e) => setEmail(e.target.value)} />
        </Field>
        <div className="grid grid-2">
          <Field label="First name (optional)">
            <Input value={firstName} onChange={(e) => setFirstName(e.target.value)} />
          </Field>
          <Field label="Last name (optional)">
            <Input value={lastName} onChange={(e) => setLastName(e.target.value)} />
          </Field>
        </div>
        <Field label="Role (optional)">
          <Select value={role} onChange={(e) => setRole(e.target.value)}>
            <option value="">Default (CLIENT)</option>
            <option value="CLIENT">Client</option>
            <option value="ADMIN">Admin</option>
          </Select>
        </Field>
        <Button type="submit" variant="secondary" disabled={status === 'loading'}>
          {status === 'loading' ? 'Creating...' : 'Create account'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
    </Card>
  );
};
