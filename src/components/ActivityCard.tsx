import Link from "next/link";
import Image from "next/image";
import { MapPin, Calendar, Users } from "lucide-react";
import { Activity, getCategoryOption, getCategoryImage } from "@/lib/data";

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
  const imageUrl = activity.image_url || getCategoryImage(activity.category);

  return (
    <Link href={`/activites/${activity.id}`} className="glass-card glass-card-hover relative overflow-hidden" style={{ minHeight: "220px" }}>
      {/* Image plein fond */}
      <Image
        src={imageUrl}
        alt={activity.title}
        fill
        className="object-cover"
        sizes="(max-width: 768px) 50vw, 20vw"
      />
      {/* Overlay gradient */}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />

      {/* Contenu par dessus */}
      <div className="absolute inset-0 flex flex-col justify-between p-4">
        <span
          className="self-start rounded-full px-2.5 py-0.5 text-[10px] font-semibold uppercase tracking-wider text-white"
          style={{ background: cat.color }}
        >
          {cat.label}
        </span>

        <div className="flex flex-col gap-1">
          <h3 className="font-display text-lg font-bold leading-tight text-white">{activity.title}</h3>
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] text-white/80">
            <span className="inline-flex items-center gap-1"><MapPin className="h-3 w-3" /> {activity.city}</span>
            <span className="inline-flex items-center gap-1">
              <Calendar className="h-3 w-3" /> {groupCount} sortie{groupCount !== 1 ? "s" : ""}
            </span>
          </div>
          <div className="mt-1 flex items-center justify-between">
            <span className="inline-flex items-center gap-1 text-[10px] text-white/70">
              <Users className="h-2.5 w-2.5" /> Communauté
            </span>
            <span className="text-xs font-semibold text-white">Voir →</span>
          </div>
        </div>
      </div>
    </Link>
  );
}