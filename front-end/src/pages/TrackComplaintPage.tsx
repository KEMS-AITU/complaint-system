import { useState } from 'react';
import { ComplaintTracker } from '../features/client/ComplaintTracker';
import { FeedbackForm } from '../features/client/FeedbackForm';
import { Modal } from '../shared/ui/Modal';
import { Section } from '../shared/ui/Section';
import { useTranslation } from '../shared/lang/translations';

export const TrackComplaintPage = () => {
  const { t } = useTranslation();
  const [selectedComplaintId, setSelectedComplaintId] = useState<number | null>(null);
  const [isFeedbackOpen, setIsFeedbackOpen] = useState(false);

  const handleSelectComplaint = (complaintId: number) => {
    setSelectedComplaintId(complaintId);
    setIsFeedbackOpen(true);
  };

  return (
    <div className="stack">
      <Section title={t('track.page.title')} description={t('track.page.description')}>
        <div className="grid grid-1">
          <ComplaintTracker
            selectedComplaintId={selectedComplaintId}
            onSelectComplaint={handleSelectComplaint}
          />
        </div>
      </Section>
      <Modal open={isFeedbackOpen} title="Send feedback" onClose={() => setIsFeedbackOpen(false)}>
        <FeedbackForm
          presetComplaintId={selectedComplaintId}
          lockComplaintId={Boolean(selectedComplaintId)}
        />
      </Modal>
    </div>
  );
};
