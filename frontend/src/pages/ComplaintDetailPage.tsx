import { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { getComplaint, getComplaintHistory } from '../shared/api/complaints';
import type { Complaint, ComplaintHistory } from '../shared/types';
import { useAuth } from '../shared/auth/AuthContext';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Notice } from '../shared/ui/Notice';
import { Section } from '../shared/ui/Section';

const statusLabel = (status: string) => {
  switch (status) {
    case 'NEW':
    case 'SUBMITTED':
      return 'Submitted';
    case 'IN_REVIEW':
      return 'In review';
    case 'IN_PROGRESS':
      return 'In progress';
    case 'RESOLVED':
      return 'Resolved';
    case 'CLOSED':
    case 'REJECTED':
      return 'Rejected';
    default:
      return status;
  }
};

const statusVariant = (status: string) => {
  switch (statusLabel(status)) {
    case 'Resolved':
      return 'success';
    case 'Rejected':
      return 'warning';
    case 'In review':
    case 'In progress':
      return 'info';
    default:
      return 'default';
  }
};

const actionLabel = (action: ComplaintHistory['action']) => {
  switch (action) {
    case 'CREATED':
      return 'Complaint submitted';
    case 'STATUS_CHANGED':
      return 'Status updated';
    case 'ADMIN_RESPONSE':
      return 'Admin response';
    case 'FEEDBACK':
      return 'Client feedback';
    default:
      return action;
  }
};

export const ComplaintDetailPage = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const navigate = useNavigate();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [history, setHistory] = useState<ComplaintHistory[]>([]);
  const [loading, setLoading] = useState(false);
  const [historyLoading, setHistoryLoading] = useState(false);
  const [error, setError] = useState('');
  const [historyError, setHistoryError] = useState('');

  useEffect(() => {
    if (!token || !id) return;
    let active = true;

    const loadComplaint = async () => {
      setLoading(true);
      setError('');
      const result = await getComplaint(id, token);

      if (!active) return;
      if (!result.ok) {
        if (result.status === 401 || result.status === 403) {
          setError('You need to sign in again.');
        } else if (result.status === 404) {
          setError('Complaint not found.');
        } else {
          setError('Unable to load complaint details.');
        }
        setLoading(false);
        return;
      }

      setComplaint(result.data ?? null);
      setLoading(false);
    };

    const loadHistory = async () => {
      setHistoryLoading(true);
      setHistoryError('');
      const result = await getComplaintHistory(id, token);

      if (!active) return;
      if (result.ok && result.data) {
        setHistory(result.data);
        setHistoryLoading(false);
        return;
      }

      setHistoryError(result.error ?? 'Unable to load complaint history.');
      setHistoryLoading(false);
    };

    loadComplaint();
    loadHistory();

    return () => {
      active = false;
    };
  }, [id, token]);

  return (
    <div className="stack">
      <Section title="Complaint details" description="Track the status and details below.">
        <div className="stack">
          <Button type="button" onClick={() => navigate('/my-complaints')}>
            Back to my complaints
          </Button>
          {loading ? <Notice tone="info">Loading complaint...</Notice> : null}
          {error ? <Notice tone="warning">{error}</Notice> : null}
          {complaint ? (
            <>
              <Card>
                <div className="card-head">
                  <div>
                    <h3>Complaint #{complaint.id}</h3>
                    <p className="muted">Created {new Date(complaint.created_at).toLocaleString()}</p>
                  </div>
                  <Badge variant={statusVariant(complaint.status)}>
                    {statusLabel(complaint.status)}
                  </Badge>
                </div>
                <div className="result">
                  <div>
                    <strong>Category:</strong> {complaint.category ?? 'General'}
                  </div>
                  <div>
                    <strong>Last update:</strong>{' '}
                    {new Date(complaint.updated_at ?? complaint.created_at).toLocaleString()}
                  </div>
                </div>
              </Card>
              <Card>
                <h3>Complaint text</h3>
                <p>{complaint.text}</p>
              </Card>
              <Card>
                <h3>Status history</h3>
                {historyLoading ? <Notice tone="info">Loading history...</Notice> : null}
                {historyError ? <Notice tone="warning">{historyError}</Notice> : null}
                <ul className="list list-stack">
                  <li>Current status: {statusLabel(complaint.status)}</li>
                  {history.length === 0 && !historyLoading ? <li>No updates yet.</li> : null}
                  {history.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{actionLabel(item.action)}</strong> —{' '}
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                      {item.old_status && item.new_status ? (
                        <div>
                          {statusLabel(item.old_status)} → {statusLabel(item.new_status)}
                        </div>
                      ) : null}
                      {item.comment ? <div>{item.comment}</div> : null}
                    </li>
                  ))}
                </ul>
              </Card>
            </>
          ) : null}
        </div>
      </Section>
    </div>
  );
};
