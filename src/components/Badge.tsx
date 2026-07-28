import type { HTMLAttributes } from 'react';

export function Badge({
  className = '',
  children,
  ...props
}: HTMLAttributes<HTMLSpanElement>) {
  return (
    <span
      className={`inline-flex items-center rounded-md border border-border bg-surface-raised px-2 py-0.5 text-xs font-medium text-muted ${className}`}
      {...props}
    >
      {children}
    </span>
  );
}
