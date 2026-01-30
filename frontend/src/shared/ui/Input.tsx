import type { InputHTMLAttributes } from 'react';

type InputProps = InputHTMLAttributes<HTMLInputElement>;

export const Input = ({ className = '', ...props }: InputProps) => {
  return <input className={`input ${className}`.trim()} {...props} />;
};
