interface PageHeaderProps {
  title: string;
  subtitle?: string;
  className?: string;
  /** @deprecated All hub pages use centered headers; only `center` is applied */
  align?: 'start' | 'center' | 'responsive';
}

export function PageHeader({
  title,
  subtitle,
  className = '',
}: PageHeaderProps) {
  return (
    <header className={`mb-8 space-y-2 text-center ${className}`}>
      <h1 className="text-2xl font-semibold tracking-tight text-foreground md:text-3xl">
        {title}
      </h1>
      {subtitle ? (
        <p className="mx-auto max-w-2xl text-muted">{subtitle}</p>
      ) : null}
    </header>
  );
}
