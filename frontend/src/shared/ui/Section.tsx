import type { ReactNode } from 'react';

type SectionProps = {
  title: string;
  description?: string;
  children: ReactNode;
};

export const Section = ({ title, description, children }: SectionProps) => {
  return (
    <section className="section">
      <div className="section-head">
        <div>
          <h2>{title}</h2>
          {description ? <p className="section-desc">{description}</p> : null}
        </div>
      </div>
      {children}
    </section>
  );
};
