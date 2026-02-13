import { useEffect, useMemo, useState } from 'react';
import { Link, useLocation, useSearchParams } from 'react-router-dom';
import { listComplaints } from '../shared/api/complaints';
import type { Complaint as ApiComplaint } from '../shared/types';
import { useAuth } from '../shared/auth/AuthContext';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Field } from '../shared/ui/Field';
import { Input } from '../shared/ui/Input';
import { Notice } from '../shared/ui/Notice';
import { Section } from '../shared/ui/Section';
import { Select } from '../shared/ui/Select';
import { useTranslation } from '../shared/lang/translations';

type ComplaintStatus = 'Submitted' | 'In review' | 'Resolved' | 'Accepted' | 'Rejected' | 'Draft' | string;

interface Complaint {
  id: number | string;
  createdAt: string;
  updatedAt?: string;
  category?: string;
  status: ComplaintStatus;
  title?: string;
}

const toStatusLabel = (status: string) => {
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
    case 'ACCEPTED':
      return 'Accepted';
    case 'CLOSED':
      return 'Closed';
    case 'REJECTED':
      return 'Rejected';
    case 'DRAFT':
      return 'Draft';
    default:
      return status;
  }
};

const normalizeComplaint = (complaint: ApiComplaint): Complaint => ({
  id: complaint.id,
  createdAt: complaint.created_at,
  updatedAt: complaint.updated_at,
  category: complaint.category ? complaint.category.toString() : undefined,
  status: toStatusLabel(complaint.status),
  title: complaint.text,
});

const getStatusBadgeStyle = (status: string) => {
  const normalized = status.toLowerCase();
  if (normalized.includes('resolved') || normalized.includes('completed')) {
    return { color: '#12B886', backgroundColor: 'rgba(18, 184, 134, 0.10)' };
  }
  if (normalized.includes('accepted')) {
    return { color: '#12B886', backgroundColor: 'rgba(18, 184, 134, 0.10)' };
  }
  if (normalized.includes('rejected')) {
    return { color: '#FA5252', backgroundColor: 'rgba(250, 82, 82, 0.10)' };
  }
  if (
    normalized.includes('pending') ||
    normalized.includes('waiting') ||
    normalized.includes('progress')
  ) {
    return { color: '#FAB005', backgroundColor: 'rgba(250, 176, 5, 0.10)' };
  }
  return { color: '#006FFF', backgroundColor: 'rgba(0, 111, 255, 0.10)' };
};

export const MyComplaintsPage = () => {
  const { token, isAdmin } = useAuth();
  const { t, language } = useTranslation();
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const highlightId = searchParams.get('highlight');
  const created = (location.state as { created?: boolean } | undefined)?.created;
  const flashMessage = (location.state as { flash?: string } | undefined)?.flash ?? '';
  const successMessage = created ? t('create.flash.success') : flashMessage;
  const statusOptions = [
    { value: 'All', label: t('my.status.all') },
    { value: 'Submitted', label: t('my.status.submitted') },
    { value: 'In review', label: t('my.status.inReview') },
    { value: 'In progress', label: t('my.status.inProgress') },
    { value: 'Resolved', label: t('my.status.resolved') },
    { value: 'Accepted', label: t('my.status.accepted') },
    { value: 'Closed', label: t('my.status.closed') },
    { value: 'Rejected', label: t('my.status.rejected') },
  ];

  const getStatusLabel = (value: string) => {
    switch (value) {
      case 'Submitted':
        return t('my.status.submitted');
      case 'In review':
        return t('my.status.inReview');
      case 'In progress':
        return t('my.status.inProgress');
      case 'Resolved':
        return t('my.status.resolved');
      case 'Accepted':
        return t('my.status.accepted');
      case 'Closed':
        return t('my.status.closed');
      case 'Rejected':
        return t('my.status.rejected');
      case 'Draft':
        return t('my.status.draft');
      default:
        return value;
    }
  };

  const formatDate = (value: string) =>
    new Date(value).toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US');

  const [search, setSearch] = useState('');
  const [status, setStatus] = useState('All');
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [page, setPage] = useState(1);
  const [hasMore, setHasMore] = useState(false);

  const fetchComplaints = async (nextPage: number, reset: boolean) => {
    if (!token) return;
    setLoading(true);
    setError('');
    const result = await listComplaints({ page: nextPage }, token);

    if (!result.ok) {
      if (result.status === 401 || result.status === 403) {
        setError(t('create.error.signInAgain'));
      } else {
        setError(t('my.error.load'));
      }
      setLoading(false);
      return;
    }

    const data = result.data ?? [];
    const nextComplaints = Array.isArray(data) ? data : data.results ?? [];
    const normalized = nextComplaints.map(normalizeComplaint);

    setComplaints((prev) => (reset ? normalized : [...prev, ...normalized]));
    setHasMore(!Array.isArray(data) && Boolean(data.next));
    setPage(nextPage);
    setLoading(false);
  };

  useEffect(() => {
    fetchComplaints(1, true);
  }, [token]);

  const filteredComplaints = useMemo(() => {
    const term = search.trim().toLowerCase();
    return complaints
      .filter((complaint) => {
        if (status !== 'All' && complaint.status !== status) {
          return false;
        }
        if (!term) return true;
        const categoryValue = (complaint.category ?? t('my.category.general')).toLowerCase();
        const titleValue = (complaint.title ?? '').toLowerCase();
        return (
          complaint.id.toString().toLowerCase().includes(term) ||
          categoryValue.includes(term) ||
          titleValue.includes(term)
        );
      })
      .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
  }, [complaints, search, status, t]);

  const handleClear = () => {
    setSearch('');
    setStatus('All');
  };

  const isEmpty = !loading && complaints.length === 0 && !error;
  const hasNoResults =
    !loading && complaints.length > 0 && filteredComplaints.length === 0 && !error;

  return (
    <div className="stack">
      <Section title={t('my.page.title')} description={t('my.page.description')}>
        <div className="stack">
          {successMessage ? <Notice tone="success">{successMessage}</Notice> : null}
          <Card>
            <div className="filters">
              <Field label={t('my.filters.search.label')}>
                <Input
                  placeholder={t('my.filters.search.placeholder')}
                  value={search}
                  onChange={(event) => setSearch(event.target.value)}
                />
              </Field>
              <Field label={t('my.filters.status.label')}>
                <Select value={status} onChange={(event) => setStatus(event.target.value)}>
                  {statusOptions.map((option) => (
                    <option key={option.value} value={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Select>
              </Field>
              <div className="filters-actions">
                <Button type="button" variant="secondary" onClick={handleClear}>
                  {t('my.filters.clear')}
                </Button>
              </div>
            </div>
          </Card>

          {error ? <Notice tone="warning">{error}</Notice> : null}

          {isEmpty ? (
            <Card>
              <h3>{t('my.empty.title')}</h3>
              <p className="muted">{t('my.empty.description')}</p>
              {!isAdmin ? (
                <Link className="btn btn-primary" to="/create">
                  {t('my.empty.cta')}
                </Link>
              ) : null}
            </Card>
          ) : null}

          {hasNoResults ? (
            <Notice tone="info">{t('my.empty.filtered')}</Notice>
          ) : null}

          {loading && complaints.length === 0 ? (
            <Card>
              <Notice tone="info">{t('my.loading')}</Notice>
            </Card>
          ) : null}

          {filteredComplaints.length ? (
            <Card>
              <div className="table-wrap">
                <table className="table">
                  <thead>
                    <tr>
                      <th>ID</th>
                      <th>{t('my.table.created')}</th>
                      <th>{t('my.table.category')}</th>
                      <th>{t('my.table.status')}</th>
                      <th>{t('my.table.lastUpdate')}</th>
                      <th></th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredComplaints.map((complaint) => (
                      <tr
                        key={complaint.id}
                        className={
                          highlightId && highlightId === complaint.id.toString()
                            ? 'row-highlight'
                            : undefined
                        }
                      >
                        <td>
                          <Link className="link-accent" to={`/complaints/${complaint.id}`}>
                            #{complaint.id}
                          </Link>
                        </td>
                        <td>{formatDate(complaint.createdAt)}</td>
                        <td>{complaint.category ?? t('my.category.general')}</td>
                        <td>
                          <span
                            className="status-pill"
                            style={getStatusBadgeStyle(complaint.status)}
                          >
                            {getStatusLabel(complaint.status)}
                          </span>
                        </td>
                        <td>
                          {formatDate(complaint.updatedAt ?? complaint.createdAt)}
                        </td>
                        <td className="table-actions">
                          <Link className="btn btn-secondary btn-sm" to={`/complaints/${complaint.id}`}>
                            {t('my.table.view')}
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
                  {loading ? t('my.loading') : t('my.loadMore')}
                </Button>
              ) : null}
            </Card>
          ) : null}
        </div>
      </Section>
    </div>
  );
};
