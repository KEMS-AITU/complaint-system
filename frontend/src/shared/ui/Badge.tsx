import type { HTMLAttributes } from 'react';

type BadgeProps = HTMLAttributes<HTMLSpanElement> & {
  variant?: 'default' | 'success' | 'warning' | 'info';
};

export const Badge = ({ variant = 'default', className = '', ...props }: BadgeProps) => {
  return <span className={`badge badge-${variant} ${className}`.trim()} {...props} />;
};
