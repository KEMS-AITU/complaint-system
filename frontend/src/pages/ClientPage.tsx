import { ComplaintCreateForm } from '../features/client/ComplaintCreateForm';
import { ComplaintLookup } from '../features/client/ComplaintLookup';
import { FeedbackForm } from '../features/client/FeedbackForm';
import { Section } from '../shared/ui/Section';

export const ClientPage = () => {
  return (
    <div className="stack">
      <Section
        title="Your complaints"
        description="Create a complaint, check its status, and send follow-up feedback."
      >
        <div className="grid grid-2">
          <ComplaintCreateForm />
          <ComplaintLookup />
        </div>
        <div className="grid grid-1">
          <FeedbackForm />
        </div>
      </Section>
    </div>
  );
};
