import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { createComplaint } from '../../shared/api/complaints';
import { useAuth } from '../../shared/auth/AuthContext';
import { useTranslation } from '../../shared/lang/translations';
import { Badge } from '../../shared/ui/Badge';
import { Button } from '../../shared/ui/Button';
import { Card } from '../../shared/ui/Card';
import { Field } from '../../shared/ui/Field';
import { Input } from '../../shared/ui/Input';
import { Notice } from '../../shared/ui/Notice';
import { TextArea } from '../../shared/ui/TextArea';

const validateText = (value: string, t: (key: string) => string) => {
  const trimmed = value.trim();
  if (!trimmed) return t('create.field.text.error.required');
  if (trimmed.length < 10) return t('create.field.text.error.min');
  if (trimmed.length > 2000) return t('create.field.text.error.max');
  return '';
};

const validateCategory = (value: string, t: (key: string) => string) => {
  if (!value.trim()) return '';
  const parsed = Number(value);
  if (!Number.isInteger(parsed) || parsed <= 0) {
    return t('create.field.category.error.invalid');
  }
  return '';
};

export const ComplaintCreateForm = () => {
  const { token } = useAuth();
  const navigate = useNavigate();
  const { t } = useTranslation();
  const [text, setText] = useState('');
  const [categoryId, setCategoryId] = useState('');
  const [message, setMessage] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'error'>('idle');
  const [touched, setTouched] = useState({ text: false, category: false });

  const textError = validateText(text, t);
  const categoryError = validateCategory(categoryId, t);
  const canSubmit = !textError && !categoryError;
  const isLoading = status === 'loading';

  const handleSubmit = async (event: React.FormEvent) => {
    event.preventDefault();
    if (!token || !canSubmit || isLoading) return;

    setStatus('loading');
    setMessage('');

    const payload: { text: string; category?: number } = { text: text.trim() };
    if (categoryId.trim()) {
      payload.category = Number(categoryId);
    }

    const result = await createComplaint(payload, token);

    if (result.ok && result.data) {
      navigate(`/my-complaints?highlight=${result.data.id}`, {
        replace: true,
        state: { created: true },
      });
      return;
    }

    if (result.status === 401 || result.status === 403) {
      setMessage(t('create.error.signInAgain'));
    } else if (result.status === 429) {
      setMessage(t('create.error.tooMany'));
    } else {
      setMessage(t('create.error.generic'));
    }
    setStatus('error');
  };

  return (
    <Card>
      <h3>{t('create.card.title')}</h3>
      <p className="muted">{t('create.card.subtitle')}</p>
      {!token ? <Notice tone="warning">{t('create.notice.signInRequired')}</Notice> : null}
      <form onSubmit={handleSubmit} className="form">
        <Field label={t('create.field.text.label')}>
          <>
            <TextArea
              rows={4}
              value={text}
              onChange={(e) => setText(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, text: true }))}
              aria-invalid={touched.text && textError ? true : undefined}
              aria-describedby={touched.text && textError ? 'complaint-text-error' : undefined}
              disabled={!token || isLoading}
            />
            {touched.text && textError ? (
              <span id="complaint-text-error" className="field-error">
                {textError}
              </span>
            ) : null}
          </>
        </Field>
        <Field
          label={t('create.field.category.label')}
          hint={t('create.field.category.hint')}
        >
          <>
            <Input
              type="number"
              min="1"
              value={categoryId}
              onChange={(e) => setCategoryId(e.target.value)}
              onBlur={() => setTouched((prev) => ({ ...prev, category: true }))}
              aria-invalid={touched.category && categoryError ? true : undefined}
              aria-describedby={touched.category && categoryError ? 'complaint-category-error' : undefined}
              disabled={!token || isLoading}
            />
            {touched.category && categoryError ? (
              <span id="complaint-category-error" className="field-error">
                {categoryError}
              </span>
            ) : null}
          </>
        </Field>
        <Button type="submit" disabled={!token || !canSubmit || isLoading}>
          {isLoading ? t('create.submit.loading') : t('create.submit.idle')}
        </Button>
        {message ? (
          <Notice tone="warning">{message}</Notice>
        ) : null}
      </form>
      <div className="result">
        <div className="muted">
          {t('create.statusPreview')} <Badge variant="info">{t('create.status.submitted')}</Badge>
        </div>
      </div>
    </Card>
  );
};
