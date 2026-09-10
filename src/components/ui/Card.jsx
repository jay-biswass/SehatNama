import React from 'react';

export const Card = ({
  children,
  onClick,
  selected = false,
  className = '',
  ...props
}) => {
  const clickableStyles = onClick ? 'cursor-pointer hover:shadow-[var(--shadow-card)] hover:border-[var(--color-primary)]/20 transition-all duration-200 active:scale-[0.995] select-none' : '';
  const selectedStyles = selected
    ? 'border-[var(--color-primary)]/40 bg-[var(--color-primary-light)] ring-1 ring-[var(--color-primary)]/15 shadow-[var(--shadow-sm)]'
    : 'border-[var(--color-border)] bg-[var(--color-bg-elevated)]';

  return (
    <div
      onClick={onClick}
      className={`border rounded-[var(--radius-md)] p-5 shadow-[var(--shadow-xs)] ${clickableStyles} ${selectedStyles} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
