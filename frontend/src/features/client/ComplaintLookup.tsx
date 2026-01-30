import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { Complaint } from '../../shared/types';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';

export const ComplaintLookup = () => {
  const { token } = useAuth();
  const [complaintId, setComplaintId] = useState('');
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');
    setComplaint(null);

    const result = await apiRequest<Complaint>(`complaints/${complaintId}/`, {
      token,
    });

    if (result.ok && result.data) {
      setStatus('success');
      setComplaint(result.data);
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Complaint not found.');
  };

  return (
    <Card>
      <h3>Check complaint status</h3>
      <p className="muted">Looks up a complaint by ID.</p>
      {!token ? <Notice tone="warning">Sign in required to view complaint details.</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <Field label="Complaint ID">
          <Input
            type="number"
            min="1"
            value={complaintId}
            onChange={(e) => setComplaintId(e.target.value)}
          />
        </Field>
        <Button type="submit" disabled={!token || status === 'loading' || !complaintId}>
          {status === 'loading' ? 'Fetching...' : 'Fetch complaint'}
        </Button>
        {message ? <Notice tone="warning">{message}</Notice> : null}
      </form>
      {complaint ? (
        <div className="result">
          <div className="result-row">
            <strong>Text:</strong>
            <span>{complaint.text}</span>
          </div>
          <div className="result-row">
            <strong>Status:</strong>
            <Badge variant="info">{complaint.status}</Badge>
          </div>
          <div className="result-row">
            <strong>Category:</strong>
            <span>{complaint.category ?? 'None'}</span>
          </div>
          <div className="muted">Created at {new Date(complaint.created_at).toLocaleString()}</div>
        </div>
      ) : null}
    </Card>
  );
};
