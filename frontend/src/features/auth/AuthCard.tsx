import type { ReactNode } from 'react';
import { Card } from '../../shared/ui/Card';

type AuthCardProps = {
  title: string;
  subtitle?: string;
  children: ReactNode;
};

export const AuthCard = ({ title, subtitle, children }: AuthCardProps) => {
  return (
    <div className="auth-page">
      <Card className="auth-card">
        <div className="stack">
          <div>
            <h1>{title}</h1>
            {subtitle ? <p className="muted">{subtitle}</p> : null}
          </div>
          {children}
        </div>
      </Card>
    </div>
  );
};
