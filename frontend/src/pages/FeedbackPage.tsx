import { FeedbackForm } from '../features/client/FeedbackForm';
import { Section } from '../shared/ui/Section';

export const FeedbackPage = () => {
  return (
    <div className="stack">
      <Section
        title="Send feedback"
        description="Tell us if the resolution met your expectations."
      >
        <div className="grid grid-1">
          <FeedbackForm />
        </div>
      </Section>
    </div>
  );
};
