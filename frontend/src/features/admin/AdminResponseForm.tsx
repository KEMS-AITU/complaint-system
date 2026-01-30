import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { TextArea } from '../../shared/ui/TextArea';

export const AdminResponseForm = () => {
  const { token } = useAuth();
  const [complaintId, setComplaintId] = useState('');
  const [responseText, setResponseText] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const result = await apiRequest('admin/response/', {
      method: 'POST',
      body: {
        complaint: Number(complaintId),
        response_text: responseText,
      },
      token,
    });

    if (result.ok) {
      setStatus('success');
      setMessage('Response recorded.');
      setComplaintId('');
      setResponseText('');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Failed to submit response.');
  };

  return (
    <Card>
      <h3>Official response</h3>
      <p className="muted">Send an official response to the user.</p>
      {!token ? <Notice tone="warning">Staff login required.</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <Field label="Complaint ID">
          <Input
            type="number"
            min="1"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
          />
        </Field>
        <Field label="Response text">
          <TextArea
            rows={4}
            value={responseText}
            onChange={(e) => setResponseText(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={!token || status === 'loading' || !complaintId}>
          {status === 'loading' ? 'Sending...' : 'Send response'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
    </Card>
  );
};
