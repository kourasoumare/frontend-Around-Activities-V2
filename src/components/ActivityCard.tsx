import Link from "next/link";
import { MapPin, Calendar, Users } from "lucide-react";
import { Activity } from "@/lib/data";

const CAT_CONFIG: Record<string, { color: string; label: string }> = {
  "Sport & Fitness":      { color: "#4A8C5E", label: "Sport" },
  "Art & Culture":        { color: "#8E5BA8", label: "Art" },
  "Restaurant & Cuisine": { color: "#C4603A", label: "Cuisine" },
  "Musique & Événements": { color: "#D4A547", label: "Musique" },
  "Bien-être & Détente":  { color: "#6BA89B", label: "Bien-être" },
  "Tech & Jeux vidéo":    { color: "#4B6CB7", label: "Tech" },
  "Nature & Plein air":   { color: "#6B8E4E", label: "Nature" },
  "Rencontres & Chill":   { color: "#C97A8E", label: "Chill" },
};

function getCat(category: string) {
  return CAT_CONFIG[category] ?? { color: "#C4603A", label: category };
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
