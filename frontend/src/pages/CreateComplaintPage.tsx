import { ComplaintCreateForm } from '../features/client/ComplaintCreateForm';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';
import { useAuth } from '../shared/auth/AuthContext';
import { Navigate } from 'react-router-dom';

export const CreateComplaintPage = () => {
  const { t } = useTranslation();
  const { isAdmin } = useAuth();

  if (isAdmin) {
    // Admin users cannot create complaints — redirect to admin workspace
    return <Navigate to="/track" replace />;
  }

  return (
    <div className="stack">
      <Section
        title={t('create.page.title')}
        description={t('create.page.description')}
      >
        <div className="grid grid-1">
          <ComplaintCreateForm />
        </div>
      </Section>
    </div>
  );
};
