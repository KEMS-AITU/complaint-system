import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { getComplaint } from '../shared/api/complaints';
import type { Complaint } from '../shared/types';
import { useAuth } from '../shared/auth/AuthContext';
import { Badge } from '../shared/ui/Badge';
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

export const ComplaintDetailPage = () => {
  const { token } = useAuth();
  const { id } = useParams();
  const [complaint, setComplaint] = useState<Complaint | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const loadComplaint = async () => {
      if (!token || !id) return;
      setLoading(true);
      setError('');
      const result = await getComplaint(id, token);

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

    loadComplaint();
  }, [id, token]);

  return (
    <div className="stack">
      <Section title="Complaint details" description="Track the status and details below.">
        <div className="stack">
          <Link className="muted" to="/complaints">
            Back to my complaints
          </Link>
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
                <ul className="list list-stack">
                  <li>Current status: {statusLabel(complaint.status)}</li>
                </ul>
              </Card>
            </>
          ) : null}
        </div>
      </Section>
    </div>
  );
};
