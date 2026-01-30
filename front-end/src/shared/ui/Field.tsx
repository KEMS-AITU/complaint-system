import type { ReactNode } from 'react';

type FieldProps = {
  label: string;
  hint?: string;
  children: ReactNode;
};

export const Field = ({ label, hint, children }: FieldProps) => {
  return (
    <label className="field">
      <span className="field-label">{label}</span>
      {children}
      {hint ? <span className="field-hint">{hint}</span> : null}
    </label>
  );
};
