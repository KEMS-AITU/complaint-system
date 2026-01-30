import type { TextareaHTMLAttributes } from 'react';

type TextAreaProps = TextareaHTMLAttributes<HTMLTextAreaElement>;

export const TextArea = ({ className = '', ...props }: TextAreaProps) => {
  return <textarea className={`textarea ${className}`.trim()} {...props} />;
};
