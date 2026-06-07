// ─── Types ────────────────────────────────────────────────────────────────────

export interface Activity {
  id: number;
  image_url: string | null;
  title: string;
  category: string;
  city: string;
  description: string;
  _count?: { groups: number };
  groups?: BackendGroup[];
}

export interface BackendGroup {
  id: number;
  activity_id: number;
  creator_id: number;
  name: string;
  description: string;
  city: string;
  meeting_date: string;
  location: string;
  max_members: number;
  contact_link: string | null;
  created_at: string;
  users?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
  activities?: {
    id: number;
    title: string;
    category: string;
  } | null;
  memberships?: {
    id: number;
    user_id: number;
    group_id: number;
    joined_at: string;
    users?: {
      id: number;
      first_name: string;
      last_name: string;
      avatar_url: string | null;
    };
  }[];
}

// MyGroup = groupe retourné directement par getMyGroupsApi (tableau plat, pas d'objet .groups imbriqué)
export interface MyGroup {
  id: number;
  name: string;
  activity_id: number;
  creator_id: number;
  meeting_date: string;
  location: string;
  max_members: number;
  contact_link: string | null;
  activities?: {
    id: number;
    title: string;
    category: string;
  } | null;
}

export interface Group {
  id: number;
  activityId: number;
  name: string;
  description: string;
  date: string;
  location: string;
  maxMembers: number;
  members: string[];
  organizer: string;
  contactLink: string;
}

export interface User {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  city: string;
  interests: string[];
  createdAt: string;
}

export interface Friend {
  id: number;
  first_name: string;
  last_name: string;
  avatar_url: string | null;
  city?: string;
}

export interface FriendRequest {
  id: number;
  requester: {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

export interface FriendStatus {
  status: "pending" | "accepted" | "refused";
  request_id: number;
  requester_id: number;
}

export interface Message {
  id: number;
  content: string;
  created_at: string;
  sender_id: number;
  receiver_id?: number | null;
  group_id?: number | null;
  sender?: {
    id: number;
    first_name: string;
    last_name: string;
    avatar_url: string | null;
  };
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "Tout",
  "Sport & Fitness",
  "Art & Culture",
  "Restaurant & Cuisine",
  "Musique & Événements",
  "Bien-être & Détente",
  "Tech & Jeux vidéo",
  "Nature & Plein air",
  "Rencontres & Chill",
];

export const INTERESTS = [
  "Football", "Running", "Fitness", "Yoga", "Danse",
  "Art", "Photographie", "Théâtre", "Cinéma", "Musées",
  "Cuisine", "Restaurants", "Brunch", "Café",
  "Concerts", "Musique", "Karaoké",
  "Bien-être", "Méditation",
  "Tech", "Gaming", "Intelligence artificielle",
  "Nature", "Randonnée", "Voyages",
  "Lecture", "Jeux de société", "Échange linguistique", "Rencontres sociales",
];

export const ACTIVITIES: Activity[] = [
  { id: 1, image_url: "/aquarelle.jpg", title: "Atelier peinture aquarelle", category: "Art & Culture", city: "Paris", _count: { groups: 3 }, description: "Rejoins un groupe de passionné·e·s pour explorer la peinture aquarelle ensemble. Tous niveaux bienvenus — l'important c'est de s'amuser et de rencontrer des gens sympas !" },
  { id: 2, image_url: "/football.jpg", title: "Foot du dimanche", category: "Sport & Fitness", city: "Paris", _count: { groups: 5 }, description: "Match amical chaque dimanche matin au parc. Tous niveaux, bonne ambiance garantie. On joue pour le plaisir, pas pour gagner." },
  { id: 3, image_url: "/cuisine.jpg", title: "Cuisine du monde", category: "Restaurant & Cuisine", city: "Paris", _count: { groups: 2 }, description: "On se retrouve chez un membre pour cuisiner ensemble une recette d'ailleurs. Chaque session, un nouveau pays à explorer." },
  { id: 4, image_url: "/guitare.jpg", title: "Jam session guitar", category: "Musique & Événements", city: "Paris", _count: { groups: 4 }, description: "Musiciens de tous niveaux, on improvise et on s'amuse ! Guitare, basse, voix... tout le monde est le bienvenu." },
  { id: 5, image_url: "/yoga.jpg", title: "Yoga en plein air", category: "Bien-être & Détente", city: "Paris", _count: { groups: 6 }, description: "Séances de yoga dans les parcs parisiens chaque matin. Pour démarrer la journée du bon pied, entouré·e de gens bienveillants." },
  { id: 6, image_url: "/photo.jpg", title: "Balade photo urbaine", category: "Art & Culture", city: "Paris", _count: { groups: 2 }, description: "On explore la ville appareil en main, partage de tips photo et regards croisés sur la ville. Smartphone ou reflex, peu importe." },
  { id: 7, image_url: "/coding.jpg", title: "Coding and Side projects", category: "Tech & Jeux vidéo", city: "Paris", _count: { groups: 3 }, description: "On se retrouve dans un café pour coder sur nos side projects respectifs. Ambiance studieuse et échanges techniques bienvenus." },
  { id: 8, image_url: "/randonnee.jpg", title: "Randonnée en forêt", category: "Nature & Plein air", city: "Paris", _count: { groups: 4 }, description: "Escapades vertes le week-end en forêt de Fontainebleau ou dans la vallée de Chevreuse. On respire, on marche, on parle." },
];

export const MOCK_USER: User = {
  id: 1,
  firstName: "Jules",
  lastName: "Martin",
  email: "jules@exemple.fr",
  city: "Paris",
  interests: ["🎨 Art", "⚽ Sport", "🍳 Cuisine", "🎵 Musique", "📚 Lecture"],
  createdAt: "mai 2025",
};