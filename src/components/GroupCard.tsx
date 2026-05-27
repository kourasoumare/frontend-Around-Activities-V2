import Link from "next/link";
import { BackendGroup } from "@/lib/data";

interface GroupCardProps {
  group: BackendGroup;
  compact?: boolean;
}

export function GroupCard({ group, compact = false }: GroupCardProps) {
  const date = new Date(group.meeting_date).toLocaleDateString('fr-FR', { day: 'numeric', month: 'long', hour: '2-digit', minute: '2-digit' });
  const membersCount = group.memberships?.length ?? 0;
  const organizer = group.users ? `${group.users.first_name} ${group.users.last_name}` : "Inconnu";

  if (compact) {
    return (
      <div className="bg-white rounded-2xl p-5 border border-bg-3 flex items-center justify-between gap-4 hover:border-tc-light hover:shadow-md transition-all duration-200">
        <div>
          <h4 className="font-semibold text-ink mb-1.5">{group.name}</h4>
          <div className="flex gap-4 text-xs text-ink-3">
            <span>📅 {date}</span>
            <span>📍 {group.location}</span>
            <span>👥 {membersCount}/{group.max_members}</span>
          </div>
        </div>
        <Link href={`/groupes/${group.id}`} className="btn btn-outline btn-sm shrink-0">
          Voir →
        </Link>
      </div>
    );
  }

  return (
    <Link href={`/groupes/${group.id}`}>
      <div className="bg-white rounded-2xl p-6 border border-bg-3 hover:border-tc-light hover:shadow-lg transition-all duration-300 cursor-pointer group">
        <div className="flex items-start justify-between gap-3 mb-3">
          <h3 className="font-semibold text-ink group-hover:text-tc transition-colors">
            {group.name}
          </h3>
          <span className="text-xs bg-tc-light text-tc-dark px-2 py-1 rounded-full font-medium shrink-0">
            {membersCount}/{group.max_members} membres
          </span>
        </div>
        <p className="text-xs text-ink-2 leading-relaxed mb-4 line-clamp-2">
          {group.description}
        </p>
        <div className="flex gap-3 text-xs text-ink-3">
          <span>📅 {date}</span>
          <span>📍 {group.location}</span>
        </div>
        <div className="mt-3 text-xs text-ink-3">
          Organisé par <span className="text-ink font-medium">{organizer}</span>
        </div>
      </div>
    </Link>
  );
}