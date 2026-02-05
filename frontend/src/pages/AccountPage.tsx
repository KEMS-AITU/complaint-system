import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../shared/auth/AuthContext';
import { Badge } from '../shared/ui/Badge';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Field } from '../shared/ui/Field';
import { Input } from '../shared/ui/Input';
import { Notice } from '../shared/ui/Notice';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';
import { getProfile, updateAvatar, updateProfile, UserProfile } from '../features/account/accountApi';
import { API_BASE_URL } from '../shared/api/config';

const buildMediaUrl = (path?: string | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const AccountPage = () => {
  const { token } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formError, setFormError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'uploading'>('idle');
  const [avatarPreview, setAvatarPreview] = useState('');
  const [formState, setFormState] = useState({
    username: '',
    email: '',
    first_name: '',
    last_name: '',
  });

  useEffect(() => {
    if (!token) return;
    let active = true;
    setStatus('loading');
    setFormError('');
    getProfile(token).then((result) => {
      if (!active) return;
      if (!result.ok || !result.data) {
        setFormError(t('account.error.load'));
        setStatus('idle');
        return;
      }
      setProfile(result.data);
      setFormState({
        username: result.data.username ?? '',
        email: result.data.email ?? '',
        first_name: result.data.first_name ?? '',
        last_name: result.data.last_name ?? '',
      });
      setStatus('idle');
    });
    return () => {
      active = false;
    };
  }, [token, t]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  const displayName = useMemo(() => {
    if (!profile) return '';
    const name = `${profile.first_name} ${profile.last_name}`.trim();
    return name || profile.username;
  }, [profile]);

  const avatarUrl = avatarPreview || buildMediaUrl(profile?.avatar_url || profile?.avatar || '');

  const handleSave = async () => {
    if (!token) return;
    setStatus('saving');
    setFormError('');
    setSuccess('');
    const result = await updateProfile(token, formState);
    if (result.ok && result.data) {
      setProfile(result.data);
      setSuccess(t('account.success.saved'));
      setStatus('idle');
      return;
    }
    setFormError(t('account.error.save'));
    setStatus('idle');
  };

  const handleAvatarChange = async (file?: File | null) => {
    if (!token || !file) return;
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    setStatus('uploading');
    setFormError('');
    setSuccess('');
    const result = await updateAvatar(token, file);
    if (result.ok && result.data) {
      setProfile(result.data);
      setSuccess(t('account.success.avatar'));
      setStatus('idle');
      return;
    }
    setFormError(t('account.error.avatar'));
    setStatus('idle');
  };

  const isBusy = status === 'saving' || status === 'uploading' || status === 'loading';

  return (
    <div className="stack">
      <Section title={t('account.page.title')} description={t('account.page.description')}>
        <div className="account-grid">
          <Card className="account-card">
            <div className="account-header">
              <div className="account-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName || 'User avatar'} />
                ) : (
                  <span>{(displayName || 'U').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <div className="account-meta">
                <h3>{displayName || t('account.label.user')}</h3>
                <p className="muted">{profile?.email || t('account.label.noEmail')}</p>
                <div className="account-badges">
                  <Badge variant="info">
                    {profile?.role === 'ADMIN' || profile?.is_superuser
                      ? t('account.role.admin')
                      : t('account.role.client')}
                  </Badge>
                  {profile?.is_superuser ? (
                    <Badge variant="success">{t('account.role.superuser')}</Badge>
                  ) : null}
                </div>
              </div>
            </div>
            <div className="account-upload">
              <label className="btn btn-secondary">
                {status === 'uploading' ? t('account.avatar.uploading') : t('account.avatar.upload')}
                <input
                  type="file"
                  accept="image/*"
                  onChange={(event) => handleAvatarChange(event.target.files?.[0])}
                  disabled={isBusy}
                />
              </label>
              <p className="muted">{t('account.avatar.hint')}</p>
            </div>
          </Card>

          <Card className="account-card">
            <div className="card-head">
              <div>
                <h3>{t('account.section.personal.title')}</h3>
                <p className="muted">{t('account.section.personal.description')}</p>
              </div>
            </div>
            <div className="form">
              <Field label={t('account.field.firstName')}>
                <Input
                  value={formState.first_name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, first_name: event.target.value }))}
                  disabled={isBusy}
                />
              </Field>
              <Field label={t('account.field.lastName')}>
                <Input
                  value={formState.last_name}
                  onChange={(event) => setFormState((prev) => ({ ...prev, last_name: event.target.value }))}
                  disabled={isBusy}
                />
              </Field>
              <Field label={t('account.field.email')}>
                <Input
                  type="email"
                  value={formState.email}
                  onChange={(event) => setFormState((prev) => ({ ...prev, email: event.target.value }))}
                  disabled={isBusy}
                />
              </Field>
              <Field label={t('account.field.username')}>
                <Input
                  value={formState.username}
                  onChange={(event) => setFormState((prev) => ({ ...prev, username: event.target.value }))}
                  disabled={isBusy}
                />
              </Field>
              {formError ? <Notice tone="warning">{formError}</Notice> : null}
              {success ? <Notice tone="success">{success}</Notice> : null}
              <Button onClick={handleSave} disabled={isBusy} className="btn-block">
                {status === 'saving' ? t('account.save.saving') : t('account.save.idle')}
              </Button>
            </div>
          </Card>
        </div>
      </Section>
    </div>
  );
};
