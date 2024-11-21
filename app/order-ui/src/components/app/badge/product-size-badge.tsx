interface IProductSizeBadgeProps {
  size: string
}

export default function LogLevelBadge({ size }: IProductSizeBadgeProps) {
  // Ensure the component returns valid JSX
  return (
    <span
      className={`inline-block p-2 w-10 h-10 text-md border border-muted-foreground/55 text-center rounded-full`}
    >
      {size.toUpperCase()}
    </span>
  )
}
