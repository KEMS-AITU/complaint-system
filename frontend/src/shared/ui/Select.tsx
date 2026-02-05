import type { SelectHTMLAttributes } from 'react';

type SelectProps = SelectHTMLAttributes<HTMLSelectElement>;

export const Select = ({ className = '', ...props }: SelectProps) => {
  return <select className={`select ${className}`.trim()} {...props} />;
};
