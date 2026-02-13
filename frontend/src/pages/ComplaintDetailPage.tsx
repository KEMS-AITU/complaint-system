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
import { useTranslation } from '../shared/lang/translations';

const statusLabelKey = (status: string) => {
  switch (status) {
    case 'NEW':
    case 'SUBMITTED':
      return 'my.status.submitted';
    case 'IN_REVIEW':
      return 'my.status.inReview';
    case 'IN_PROGRESS':
      return 'my.status.inProgress';
    case 'RESOLVED':
      return 'my.status.resolved';
    case 'ACCEPTED':
      return 'my.status.accepted';
    case 'CLOSED':
      return 'my.status.closed';
    case 'REJECTED':
      return 'my.status.rejected';
    default:
      return '';
  }
};

const statusVariant = (status: string) => {
  switch (statusLabelKey(status)) {
    case 'my.status.resolved':
    case 'my.status.accepted':
      return 'success';
    case 'my.status.closed':
      return 'success';
    case 'my.status.rejected':
      return 'warning';
    case 'my.status.inReview':
    case 'my.status.inProgress':
      return 'info';
    default:
      return 'default';
  }
};

const actionLabel = (action: ComplaintHistory['action'], role?: ComplaintHistory['user_role']) => {
  switch (action) {
    case 'CREATED':
      return 'detail.action.created';
    case 'STATUS_CHANGED':
      return 'detail.action.statusChanged';
    case 'ADMIN_RESPONSE':
      return 'detail.action.adminResponse';
    case 'FEEDBACK':
      return role === 'ADMIN' ? 'detail.action.adminFeedback' : 'detail.action.clientFeedback';
    default:
      return '';
  }
};

export const ComplaintDetailPage = () => {
  const { t } = useTranslation();
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
          setError(t('detail.error.signInAgain'));
        } else if (result.status === 404) {
          setError(t('detail.error.notFound'));
        } else {
          setError(t('detail.error.load'));
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

      setHistoryError(result.error ?? t('detail.error.history'));
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
      <Section title={t('detail.page.title')} description={t('detail.page.description')}>
        <div className="stack">
          <Button type="button" onClick={() => navigate('/my-complaints')}>
            {t('detail.back')}
          </Button>
          {loading ? <Notice tone="info">{t('detail.loadingComplaint')}</Notice> : null}
          {error ? <Notice tone="warning">{error}</Notice> : null}
          {complaint ? (
            <>
              <Card>
                <div className="card-head">
                  <div>
                    <h3>
                      {t('detail.heading.complaint')} #{complaint.id}
                    </h3>
                    <p className="muted">
                      {t('my.table.created')}{' '}
                      {new Date(complaint.created_at).toLocaleString()}
                    </p>
                  </div>
                  <Badge variant={statusVariant(complaint.status)}>
                    {t(statusLabelKey(complaint.status) || 'my.table.status')}
                  </Badge>
                </div>
                <div className="result">
                  <div>
                    <strong>{t('detail.label.category')}:</strong>{' '}
                    {complaint.category ?? t('my.category.general')}
                  </div>
                  <div>
                    <strong>{t('detail.label.lastUpdate')}:</strong>{' '}
                    {new Date(complaint.updated_at ?? complaint.created_at).toLocaleString()}
                  </div>
                </div>
              </Card>
              <Card>
                <h3>{t('detail.label.complaintText')}</h3>
                <p>{complaint.text}</p>
              </Card>
              <Card>
                <h3>{t('detail.label.statusHistory')}</h3>
                {historyLoading ? (
                  <Notice tone="info">{t('detail.loadingHistory')}</Notice>
                ) : null}
                {historyError ? <Notice tone="warning">{historyError}</Notice> : null}
                <ul className="list list-stack">
                  <li>
                    {t('detail.history.currentStatusPrefix')}{' '}
                    {t(statusLabelKey(complaint.status) || 'my.table.status')}
                  </li>
                  {history.length === 0 && !historyLoading ? (
                    <li>{t('detail.history.noUpdates')}</li>
                  ) : null}
                  {history.map((item) => (
                    <li key={item.id}>
                      <div>
                        <strong>{t(actionLabel(item.action, item.user_role) || '')}</strong> —{' '}
                        {new Date(item.created_at).toLocaleString()}
                      </div>
                      {item.old_status && item.new_status ? (
                        <div>
                          {t(statusLabelKey(item.old_status) || 'my.table.status')} →{' '}
                          {t(statusLabelKey(item.new_status) || 'my.table.status')}
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
