import { useEffect, useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { Select } from '../../shared/ui/Select';
import { TextArea } from '../../shared/ui/TextArea';

type FeedbackFormProps = {
  presetComplaintId?: number | null;
  lockComplaintId?: boolean;
};

export const FeedbackForm = ({ presetComplaintId, lockComplaintId = false }: FeedbackFormProps) => {
  const { token } = useAuth();
  const [complaintId, setComplaintId] = useState(
    presetComplaintId ? String(presetComplaintId) : ''
  );
  const [comment, setComment] = useState('');
  const [isAccepted, setIsAccepted] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  useEffect(() => {
    if (presetComplaintId !== undefined && presetComplaintId !== null) {
      setComplaintId(String(presetComplaintId));
    }
  }, [presetComplaintId]);

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const payload: Record<string, unknown> = {
      complaint: Number(complaintId),
      comment,
    };
    if (isAccepted) {
      payload.is_accepted = isAccepted === 'true';
    }

    const result = await apiRequest('feedback/', {
      method: 'POST',
      body: payload,
      token,
    });

    if (result.ok) {
      setStatus('success');
      setMessage('Feedback sent.');
      setComplaintId('');
      setComment('');
      setIsAccepted('');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Failed to send feedback.');
  };

  return (
    <Card>
      <h3>Send feedback</h3>
      <p className="muted">Tell us how the resolution went.</p>
      {!token ? <Notice tone="warning">Sign in required to send feedback.</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <div className="grid grid-2">
          <Field label="Complaint ID">
            <Input
              type="number"
              min="1"
              value={complaintId}
              onChange={(e) => setComplaintId(e.target.value)}
              disabled={lockComplaintId && Boolean(presetComplaintId)}
            />
          </Field>
          <Field label="Acceptance (optional)">
            <Select value={isAccepted} onChange={(e) => setIsAccepted(e.target.value)}>
              <option value="">Not set</option>
              <option value="true">Accepted</option>
              <option value="false">Rejected</option>
            </Select>
          </Field>
        </div>
        <Field label="Comment">
          <TextArea
            rows={4}
            value={comment}
            onChange={(e) => setComment(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={!token || status === 'loading' || !complaintId}>
          {status === 'loading' ? 'Sending...' : 'Send feedback'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
    </Card>
  );
};
