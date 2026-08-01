const statusStyles = {
  normal: "bg-accent text-accent-foreground",
  watch: "bg-chart-3/25 text-foreground",
  high: "bg-destructive/12 text-destructive",
} as const;

const statusLabels = {
  normal: "正常",
  watch: "注意",
  high: "偏高",
} as const;

export function StatusBadge({ status }: { status: keyof typeof statusStyles }) {
  return (
    <span className={`shrink-0 rounded-full px-2.5 py-1 text-xs font-bold ${statusStyles[status]}`}>
      {statusLabels[status]}
    </span>
  );
}
