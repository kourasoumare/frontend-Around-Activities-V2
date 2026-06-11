import Link from "next/link";
import { Calendar, MapPin } from "lucide-react";
import { BackendGroup } from "@/lib/data";

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

interface GroupCardProps {
  group: BackendGroup;
  showActivity?: boolean;
}

export function GroupCard({ group, showActivity = false }: GroupCardProps) {
  const cat = group.activities ? (CAT_CONFIG[group.activities.category] ?? { color: "#C4603A", label: group.activities.category }) : null;
  const taken = group.memberships?.length ?? 0;
  const pct = Math.min(100, Math.round((taken / group.max_members) * 100));
  const dateStr = new Date(group.meeting_date).toLocaleDateString("fr-FR", {
    day: "numeric", month: "short", hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="glass-card glass-card-hover p-5">
      {showActivity && group.activities && cat && (
        <Link
          href={`/activites/${group.activities.id}`}
          className="mb-2 inline-flex items-center gap-2 text-xs font-semibold"
          style={{ color: cat.color }}
        >
          <span className="h-2 w-2 rounded-full" style={{ background: cat.color }} />
          {group.activities.title}
        </Link>
      )}
      <h3 className="font-display text-lg font-bold leading-snug">{group.name}</h3>
      <div className="mt-2 flex flex-wrap gap-x-4 gap-y-1 text-xs text-[var(--muted-text)]">
        <span className="inline-flex items-center gap-1"><Calendar className="h-3.5 w-3.5" /> {dateStr}</span>
        <span className="inline-flex items-center gap-1"><MapPin className="h-3.5 w-3.5" /> {group.location.split(",")[0]}</span>
      </div>
      <div className="mt-4">
        <div className="mb-1 flex items-center justify-between text-xs text-[var(--muted-text)]">
          <span>{taken} / {group.max_members} membres</span>
          <span>{group.max_members - taken} places</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-[rgba(90,60,30,0.1)]">
          <div className="h-full rounded-full" style={{ width: `${pct}%`, background: "var(--gradient-primary)" }} />
        </div>
      </div>
      <div className="mt-4 flex justify-end">
        <Link href={`/groupes/${group.id}`} className="btn-ghost !py-1.5 !text-sm">Voir</Link>
      </div>
    </div>
  );
}
