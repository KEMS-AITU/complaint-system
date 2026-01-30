import type { HTMLAttributes } from 'react';

type NoticeProps = HTMLAttributes<HTMLDivElement> & {
  tone?: 'info' | 'warning' | 'success' | 'danger';
};

export const Notice = ({ tone = 'info', className = '', ...props }: NoticeProps) => {
  return <div className={`notice notice-${tone} ${className}`.trim()} {...props} />;
};
