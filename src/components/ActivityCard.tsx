import Link from "next/link";
import Image from "next/image";
import { Activity } from "@/lib/data";

interface ActivityCardProps {
  activity: Activity;
}

export function ActivityCard({ activity }: ActivityCardProps) {
  const categoryImages: Record<string, string> = {
    "Sport & Fitness": "/football.jpg",
    "Art & Culture": "/aquarelle.jpg",
    "Restaurant & Cuisine": "/cuisine.jpg",
    "Musique & Événements": "/guitare.jpg",
    "Bien-être & Détente": "/yoga.jpg",
    "Tech & Jeux vidéo": "/coding.jpg",
    "Nature & Plein air": "/randonnee.jpg",
    "Rencontres & Chill": "/photo.jpg",
  };
  const imageSrc = activity.image_url || categoryImages[activity.category] || "/aquarelle.jpg";
  return (
    <Link href={`/activites/${activity.id}`}>
      <div className="bg-white rounded-2xl overflow-hidden border border-bg-3 cursor-pointer transition-all duration-300 hover:-translate-y-1 hover:shadow-xl hover:border-tc-light group">

        {/* Image */}
        <div className="relative h-44 overflow-hidden">
          <Image
            src={imageSrc}
            alt={activity.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />

          <div className="absolute inset-0 bg-black/10" />

          <div className="absolute top-3 left-3 bg-white rounded-full px-3 py-1 text-xs font-semibold text-tc">
            {activity.category}
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <h3 className="font-semibold text-ink mb-2 group-hover:text-tc transition-colors">
            {activity.title}
          </h3>

          <div className="flex items-center gap-4 text-xs text-ink-3 mb-3">
            <span className="flex items-center gap-1">
              📍 {activity.city}
            </span>

            <span className="flex items-center gap-1">
              👥 {activity._count?.groups ?? 0} groupe{activity._count?.groups !== 1 ? "s" : ""}
            </span>
          </div>

          <p className="text-xs text-ink-2 leading-relaxed line-clamp-2">
            {activity.description}
          </p>
        </div>
      </div>
    </Link>
  );
}
