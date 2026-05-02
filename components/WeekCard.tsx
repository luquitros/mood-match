import Link from "next/link";
import { summarizeWeek } from "@/lib/data";
import type { WeekMoodMatch } from "@/lib/types";

type WeekCardProps = {
  week: WeekMoodMatch;
};

export function WeekCard({ week }: WeekCardProps) {
  return (
    <Link className="week-card" href={`/weeks/${week.year}/${week.week}`}>
      <header>
        <div>
          <strong>
            Semana {week.week}, {week.year}
          </strong>
          <span>
            {week.startDate} a {week.endDate}
          </span>
        </div>
        <strong>{week.score}</strong>
      </header>
      <p className="muted">{summarizeWeek(week)}</p>
      <div className="pill-row">
        {week.highlights.map((highlight) => (
          <span className="pill" key={highlight}>
            {highlight}
          </span>
        ))}
      </div>
    </Link>
  );
}
