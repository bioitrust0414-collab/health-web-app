export function SectionHeader({
  badge,
  title,
  desc,
}: {
  badge: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="section-header">
      <div className="section-badge">{badge}</div>
      <h2 className="section-title">{title}</h2>
      <p className="section-desc">{desc}</p>
    </div>
  );
}