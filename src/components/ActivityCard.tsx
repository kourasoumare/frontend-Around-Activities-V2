import Link from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";
import { Activity, getCategoryOption } from "@/lib/data";

function getCat(category: string) {
  const option = getCategoryOption(category);
  return option ? { color: option.color, label: option.shortLabel } : { color: "#C4603A", label: category };
}

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const cat = getCat(activity.category);
  const groupCount = activity._count?.groups ?? 0;
  return (
    <Link href={`/activites/${activity.id}`} className="glass-card glass-card-hover flex flex-col overflow-hidden">
      <div className="h-1.5 w-full" style={{ background: cat.color }} />
      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="text-[10px] font-semibold uppercase tracking-wider" style={{ color: cat.color }}>
          {cat.label}
        </span>
        <h3 className="font-display text-lg font-bold leading-tight">{activity.title}</h3>
        <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-[var(--muted-text)]">
          <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.city}</span>
          <span className="inline-flex items-center gap-1">
            <Calendar className="h-3 w-3" /> {groupCount} sortie{groupCount !== 1 ? "s" : ""}
          </span>
        </div>
        <div className="mt-auto flex items-center justify-between pt-2">
          <span className="pill !py-0.5 !text-[10px]">
            <Users className="h-2.5 w-2.5" /> Communauté
          </span>
          <span className="text-xs font-semibold text-[var(--primary)]">Voir →</span>
        </div>
      </div>
    </Link>
  );
}
