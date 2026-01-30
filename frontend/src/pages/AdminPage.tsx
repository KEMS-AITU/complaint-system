import { AdminResponseForm } from '../features/admin/AdminResponseForm';
import { ComplaintList } from '../features/admin/ComplaintList';
import { ComplaintStatusForm } from '../features/admin/ComplaintStatusForm';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';

export const AdminPage = () => {
  const { t } = useTranslation();
  return (
    <div className="stack">
      <Section title={t('admin.page.title')} description={t('admin.page.description')}>
        <div className="grid grid-1">
          <ComplaintList />
        </div>
        <div className="grid grid-2">
          <ComplaintStatusForm />
          <AdminResponseForm />
        </div>
      </Section>
    </div>
  );
};
