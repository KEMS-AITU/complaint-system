import { useState } from 'react';
import { apiRequest } from '../../shared/api/http';
import { useAuth } from '../../shared/auth/AuthContext';
import { ComplaintStatus } from '../../shared/types';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { Select } from '../../shared/ui/Select';

const statuses: ComplaintStatus[] = ['NEW', 'IN_PROGRESS', 'RESOLVED', 'CLOSED'];

export const ComplaintStatusForm = () => {
  const { token } = useAuth();
  const [complaintId, setComplaintId] = useState('');
  const [statusValue, setStatusValue] = useState<ComplaintStatus>('IN_PROGRESS');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    setStatus('loading');
    setMessage('');

    const result = await apiRequest(`admin/complaints/${complaintId}/status/`, {
      method: 'PATCH',
      body: { status: statusValue },
      token,
    });

    if (result.ok) {
      setStatus('success');
      setMessage('Status updated.');
      return;
    }

    setStatus('error');
    setMessage(result.error ?? 'Failed to update status.');
  };

  return (
    <Card>
      <h3>Update status</h3>
      <p className="muted">Change the status for a complaint.</p>
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
        <Field label="Status">
          <Select value={statusValue} onChange={(e) => setStatusValue(e.target.value as ComplaintStatus)}>
            {statuses.map((statusOption) => (
              <option key={statusOption} value={statusOption}>
                {statusOption}
              </option>
            ))}
          </Select>
        </Field>
        <Button type="submit" disabled={!token || status === 'loading' || !complaintId}>
          {status === 'loading' ? 'Updating...' : 'Update status'}
        </Button>
        {message ? (
          <Notice tone={status === 'success' ? 'success' : 'warning'}>{message}</Notice>
        ) : null}
      </form>
    </Card>
  );
};
