import { useEffect, useMemo, useState } from 'react';
import { useAuth } from '../shared/auth/AuthContext';
import { Button } from '../shared/ui/Button';
import { Card } from '../shared/ui/Card';
import { Field } from '../shared/ui/Field';
import { Input } from '../shared/ui/Input';
import { Notice } from '../shared/ui/Notice';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';
import { getProfile, updateAvatar, updateProfile, UserProfile, UserProfileUpdate } from '../features/account/accountApi';
import { API_BASE_URL } from '../shared/api/config';

const buildMediaUrl = (path?: string | null) => {
  if (!path) return '';
  if (path.startsWith('http://') || path.startsWith('https://')) return path;
  const base = API_BASE_URL.replace(/\/api\/?$/, '');
  return `${base}${path.startsWith('/') ? '' : '/'}${path}`;
};

export const AccountPage = () => {
  const { token, setUserProfile } = useAuth();
  const { t } = useTranslation();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [formError, setFormError] = useState('');
  const [validationError, setValidationError] = useState('');
  const [avatarError, setAvatarError] = useState('');
  const [success, setSuccess] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'saving' | 'uploading'>('idle');
  const [activeSection, setActiveSection] = useState<'basic' | 'settings'>('basic');
  const [isEditing, setIsEditing] = useState(false);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [pendingAvatarFile, setPendingAvatarFile] = useState<File | null>(null);
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
    setValidationError('');
    if (!formState.first_name.trim() || !formState.last_name.trim()) {
      setValidationError(t('account.validation.nameRequired'));
      return;
    }
    if (formState.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formState.email)) {
      setValidationError(t('account.validation.emailInvalid'));
      return;
    }
    setStatus('saving');
    setFormError('');
    setSuccess('');
    const payload: UserProfileUpdate = {};
    if (profile) {
      if (formState.first_name !== profile.first_name) payload.first_name = formState.first_name;
      if (formState.last_name !== profile.last_name) payload.last_name = formState.last_name;
      if (formState.email !== profile.email) payload.email = formState.email;
      if (formState.username !== profile.username) payload.username = formState.username;
    } else {
      payload.first_name = formState.first_name;
      payload.last_name = formState.last_name;
      payload.email = formState.email;
      payload.username = formState.username;
    }
    if (!Object.keys(payload).length) {
      setIsEditing(false);
      return;
    }
    const result = await updateProfile(token, payload);
    if (result.ok && result.data) {
      setProfile(result.data);
      setSuccess(t('account.success.saved'));
      setIsEditing(false);
      const name = `${result.data.first_name ?? ''} ${result.data.last_name ?? ''}`.trim();
      setUserProfile({
        name: name || result.data.username || '',
        email: result.data.email || '',
        id: result.data.id ? String(result.data.id) : '',
        avatarUrl: buildMediaUrl(result.data.avatar_url || result.data.avatar || ''),
      });
      setStatus('idle');
      return;
    }
    setFormError(t('account.error.save'));
    setStatus('idle');
  };

  const handleAvatarSelect = (file?: File | null) => {
    if (!file) return;
    setAvatarError('');
    const isValidType = ['image/png', 'image/jpeg', 'image/jpg'].includes(file.type);
    if (!isValidType) {
      setAvatarError(t('account.avatar.error.type'));
      return;
    }
    const maxSize = 5 * 1024 * 1024;
    if (file.size > maxSize) {
      setAvatarError(t('account.avatar.error.size'));
      return;
    }
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview(URL.createObjectURL(file));
    setPendingAvatarFile(file);
    setSuccess('');
  };

  const handleAvatarSave = async () => {
    if (!token || !pendingAvatarFile) return;
    setStatus('uploading');
    setFormError('');
    setSuccess('');
    const result = await updateAvatar(token, pendingAvatarFile);
    if (result.ok && result.data) {
      setProfile(result.data);
      setSuccess(t('account.success.avatar'));
      const name = `${result.data.first_name ?? ''} ${result.data.last_name ?? ''}`.trim();
      setUserProfile({
        name: name || result.data.username || '',
        email: result.data.email || '',
        id: result.data.id ? String(result.data.id) : '',
        avatarUrl: buildMediaUrl(result.data.avatar_url || result.data.avatar || ''),
      });
      if (avatarPreview) URL.revokeObjectURL(avatarPreview);
      setAvatarPreview('');
      setPendingAvatarFile(null);
      setStatus('idle');
      return;
    }
    setFormError(t('account.error.avatar'));
    setStatus('idle');
  };

  const handleAvatarCancel = () => {
    if (avatarPreview) URL.revokeObjectURL(avatarPreview);
    setAvatarPreview('');
    setPendingAvatarFile(null);
    setAvatarError('');
  };

  const isBusy = status === 'saving' || status === 'uploading' || status === 'loading';
  const roleLabel =
    profile?.role === 'ADMIN' || profile?.is_superuser ? t('account.role.admin') : t('account.role.client');

  return (
    <div className="stack">
      <Section title={t('account.page.title')} description={t('account.page.description')}>
        <div className="account-breadcrumb">
          <span>{t('account.page.title')}</span>
          <span className="breadcrumb-sep">/</span>
          <span className="breadcrumb-accent">{displayName || t('account.label.user')}</span>
        </div>

        <Card className="account-profile-card">
          <div className="account-profile-left">
            <div className="account-avatar-wrap">
              <div className="account-avatar">
                {avatarUrl ? (
                  <img src={avatarUrl} alt={displayName || 'User avatar'} />
                ) : (
                  <span>{(displayName || 'U').slice(0, 1).toUpperCase()}</span>
                )}
              </div>
              <label className="account-avatar-edit">
                <span>✎</span>
                <input
                  type="file"
                  accept="image/png,image/jpeg,image/jpg"
                  onChange={(event) => handleAvatarSelect(event.target.files?.[0])}
                  disabled={isBusy}
                />
              </label>
            </div>
            <div className="account-profile-meta">
              <h3>{displayName || t('account.label.user')}</h3>
              <p className="muted">{profile?.email || t('account.label.noEmail')}</p>
              <span className="role-badge">{roleLabel}</span>
            </div>
          </div>
          <div className="account-profile-action">
            {pendingAvatarFile ? (
              <div className="profile-action-group">
                <Button type="button" variant="secondary" onClick={handleAvatarCancel}>
                  {t('common.cancel')}
                </Button>
                <Button type="button" onClick={handleAvatarSave} disabled={isBusy}>
                  {status === 'uploading' ? t('account.avatar.uploading') : t('account.save.idle')}
                </Button>
              </div>
            ) : (
              <Button type="button" variant="secondary" className="btn-accent">
                {t('account.avatar.changeHistory')}
              </Button>
            )}
          </div>
        </Card>
        {avatarError ? <Notice tone="warning">{avatarError}</Notice> : null}

        <div className="account-layout">
          <Card className="account-details-card">
            <div className="details-head">
              <div>
                <h3>
                  {activeSection === 'basic'
                    ? t('account.section.basic.title')
                    : t('account.section.settings.title')}
                </h3>
                <p className="muted">
                  {activeSection === 'basic'
                    ? t('account.section.basic.description')
                    : t('account.section.settings.description')}
                </p>
              </div>
              {activeSection === 'basic' ? (
                isEditing ? (
                  <div className="details-actions">
                    <Button type="button" variant="secondary" onClick={() => {
                      if (profile) {
                        setFormState({
                          username: profile.username ?? '',
                          email: profile.email ?? '',
                          first_name: profile.first_name ?? '',
                          last_name: profile.last_name ?? '',
                        });
                      }
                      setValidationError('');
                      setFormError('');
                      setSuccess('');
                      setIsEditing(false);
                    }}>
                      {t('common.cancel')}
                    </Button>
                    <Button type="button" onClick={handleSave} disabled={isBusy}>
                      {status === 'saving' ? t('account.save.saving') : t('account.save.idle')}
                    </Button>
                  </div>
                ) : (
                  <Button
                    type="button"
                    variant="secondary"
                    className="btn-accent"
                    onClick={() => setIsEditing(true)}
                  >
                    {t('common.edit')}
                  </Button>
                )
              ) : null}
            </div>

            {activeSection === 'basic' ? (
              isEditing ? (
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
                      disabled
                    />
                  </Field>
                  {validationError ? <Notice tone="warning">{validationError}</Notice> : null}
                  {formError ? <Notice tone="warning">{formError}</Notice> : null}
                  {success ? <Notice tone="success">{success}</Notice> : null}
                </div>
              ) : (
                <div className="details-grid">
                  <div>
                    <span className="details-label">{t('account.field.firstName')}</span>
                    <span className="details-value">{formState.first_name || '-'}</span>
                  </div>
                  <div>
                    <span className="details-label">{t('account.field.lastName')}</span>
                    <span className="details-value">{formState.last_name || '-'}</span>
                  </div>
                  <div>
                    <span className="details-label">{t('account.field.email')}</span>
                    <span className="details-value">{formState.email || '-'}</span>
                  </div>
                  <div>
                    <span className="details-label">{t('account.field.username')}</span>
                    <span className="details-value">{formState.username || '-'}</span>
                  </div>
                </div>
              )
            ) : (
              <div className="details-grid">
                <div>
                  <span className="details-label">{t('account.field.username')}</span>
                  <span className="details-value">{formState.username || '-'}</span>
                </div>
                <div>
                  <span className="details-label">{t('account.label.role')}</span>
                  <span className="details-value">{roleLabel}</span>
                </div>
                <div>
                  <span className="details-label">{t('account.field.email')}</span>
                  <span className="details-value">{formState.email || '-'}</span>
                </div>
              </div>
            )}
          </Card>

          <Card className="account-side-nav">
            <button
              type="button"
              className={`side-nav-item${activeSection === 'basic' ? ' side-nav-item-active' : ''}`}
              onClick={() => setActiveSection('basic')}
            >
              <span className="side-nav-icon" aria-hidden="true" />
              {t('account.nav.basic')}
            </button>
            <button
              type="button"
              className={`side-nav-item${activeSection === 'settings' ? ' side-nav-item-active' : ''}`}
              onClick={() => setActiveSection('settings')}
            >
              <span className="side-nav-icon" aria-hidden="true" />
              {t('account.nav.settings')}
            </button>
          </Card>
        </div>
      </Section>
    </div>
  );
};
