import { member } from "@/lib/member-data";

const barWidths = [2, 4, 1, 3, 2, 5, 1, 2, 4, 2, 3, 1, 4, 2, 1, 3, 5, 2, 1, 4, 2, 3, 1, 2, 4, 1, 3, 2];

export function MemberCard() {
  return (
    <section className="surface-card overflow-hidden">
      <div className="brand-gradient shadow-brand px-5 py-6 text-primary-foreground md:px-8">
        <div className="flex min-w-0 items-center gap-3">
          <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-foreground/25 text-lg font-bold">
            {member.avatarInitial}
          </span>
          <div className="min-w-0">
            <p className="truncate text-lg font-bold">{member.name}</p>
            <p className="text-xs opacity-85">{member.tier}</p>
          </div>
        </div>

        <p className="mt-6 text-xs tracking-[0.3em] opacity-80">健康會員條碼</p>
      </div>

      <div className="px-5 pt-4 pb-6 md:px-8">
        <div className="flex h-20 items-end justify-center gap-[3px] rounded-xl bg-secondary px-4 py-3">
          {barWidths.map((w, i) => (
            <span
              key={i}
              className="h-full rounded-[1px] bg-foreground"
              style={{ width: `${w}px`, opacity: i % 3 === 0 ? 0.9 : 0.75 }}
            />
          ))}
        </div>
        <p className="mt-3 text-center text-sm font-medium tracking-[0.25em] text-muted-foreground tabular-nums">
          {member.memberId}
        </p>
        <p className="mt-1 text-center text-xs text-muted-foreground">
          門市結帳或健檢報到時出示此條碼
        </p>
      </div>
    </section>
  );
}
