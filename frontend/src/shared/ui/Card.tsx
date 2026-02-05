import type { HTMLAttributes } from 'react';

type CardProps = HTMLAttributes<HTMLDivElement>;

export const Card = ({ className = '', ...props }: CardProps) => {
  return <div className={`card ${className}`.trim()} {...props} />;
};
