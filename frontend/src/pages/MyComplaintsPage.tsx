import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { listComplaints } from '../shared/api/complaints';
import type { Complaint } from '../shared/types';
import { useAuth } from '../shared/auth/AuthContext';
import { useTranslation } from '../shared/lang/translations';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Field } from '../shared/ui/Field';
import { Input } from '../shared/ui/Input';
import { Notice } from '../shared/ui/Notice';
import { Section } from '../shared/ui/Section';
import { Select } from '../shared/ui/Select';

const STATUS_OPTIONS = [
  { value: 'all', label: 'All' },
  { value: 'SUBMITTED', label: 'Submitted' },
  { value: 'IN_REVIEW', label: 'In review' },
  { value: 'IN_PROGRESS', label: 'In progress' },
  { value: 'RESOLVED', label: 'Resolved' },
  { value: 'REJECTED', label: 'Rejected' },
];

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

const getUpdatedAt = (complaint: Complaint) => {
  return complaint.updated_at ?? complaint.created_at;
};

export const MyComplaintsPage = () => {
  const { token, isAdmin } = useAuth();
  const { t } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const flashMessage = (location.state as { flash?: string } | undefined)?.flash ?? '';

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('all');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComplaints = async (nextPage: number, reset: boolean) => {
    if (!token) return;
    setLoading(true);
    setError('');
    const result = await listComplaints({ search, status, page: nextPage }, token);

    if (!result.ok) {
      if (result.status === 401 || result.status === 403) {
        setError('You need to sign in again.');
      } else {
        setError('Unable to load complaints. Please try again.');
      }
      setLoading(false);
      return;
    }

    const data = result.data ?? [];
    const nextComplaints = Array.isArray(data) ? data : data.results ?? [];
    const merged = reset ? nextComplaints : [...complaints, ...nextComplaints];

    setComplaints(merged);
    setHasMore(!Array.isArray(data) && Boolean(data.next));
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints(1, true);
  }, [search, status, token]);

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();
    return complaints
      .filter((complaint) => {
        if (status !== 'all' && statusLabel(complaint.status) !== statusLabel(status)) {
          return false;
        }
        if (!term) return true;
        const categoryValue = complaint.category?.toString() ?? 'general';
        return (
          complaint.id.toString().includes(term) ||
          categoryValue.includes(term) ||
          complaint.text.toLowerCase().includes(term)
        );
      })
      .sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
  }, [complaints, search, status]);

  const handleClear = () => {
    setSearch('');
    setStatus('all');
  };

  const isEmpty = !loading && complaints.length === 0 && !error;
  const hasNoResults =
    !loading && complaints.length > 0 && filteredComplaints.length === 0 && !error;

  return (
    <div className="stack">
      <Section
        title="My complaints"
        description="Track the status of your submitted complaints."
      >
        <div className="stack">
          {flashMessage ? <Notice tone="success">{flashMessage}</Notice> : null}
          <Card>
            <div className="filters">
              <Field label="Search">
                <Input
                  placeholder="Search by ID, category, or text"
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </Field>
              <Field label="Status">
                <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {STATUS_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="filters-actions">
                <Button type="button" variant="secondary" onClick={handleClear}>
                  Clear filters
                </Button>
              </div>
            </div>
          </Card>

          {error ? <Notice tone="warning">{error}</Notice> : null}

          {isEmpty ? (
            <Card>
              <h3>No complaints yet</h3>
              <p className="muted">Create your first complaint to start tracking it here.</p>
              {!isAdmin ? (
                <Link className="btn btn-secondary" to="/create">
                  {t('create.card.title')}
                </Link>
              ) : null}
            </Card>
          ) : null}

          {hasNoResults ? (
            <Notice tone="info">No complaints match your filters.</Notice>
          ) : null}

          {filteredComplaints.length ? (
            <Card>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>Created</th>
                      <th>Category</th>
                      <th>Status</th>
                      <th>Last update</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className={
                          highlightId && Number(highlightId) === complaint.id
                            ? 'row-highlight'
                            : undefined
                        }
                      >
                        <td>
                          <Link to={`/complaints/${complaint.id}`}>#{complaint.id}</Link>
                        </td>
                        <td>{new Date(complaint.created_at).toLocaleDateString()}</td>
                        <td>{complaint.category ?? 'General'}</td>
                        <td>
                          <Badge variant={statusVariant(complaint.status)}>
                            {statusLabel(complaint.status)}
                          </Badge>
                        </td>
                        <td>{new Date(getUpdatedAt(complaint)).toLocaleDateString()}</td>
                        <td className="table-actions">
                          <Link className="btn btn-secondary" to={`/complaints/${complaint.id}`}>
                            View
                          </Link>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
              {hasMore ? (
                <Button
                  type="button"
                  variant="secondary"
                  disabled={loading}
                  onClick={() => fetchComplaints(page + 1, false)}
                >
                  {loading ? 'Loading...' : 'Load more'}
                </Button>
              ) : null}
            </Card>
          ) : null}

          {loading ? <Notice tone="info">Loading complaints...</Notice> : null}
        </div>
      </Section>
    </div>
  );
};
