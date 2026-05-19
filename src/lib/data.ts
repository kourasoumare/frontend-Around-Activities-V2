// ─── Types ────────────────────────────────────────────────────────────────────

export interface Activity {
  id: number;
  image: string;
  title: string;
  category: string;
  city: string;
  groupsCount: number;
  description: string;
  color: string;
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

// ─── Mock Data ────────────────────────────────────────────────────────────────

export const CATEGORIES = [
  "Tout",
  "Sport",
  "Art",
  "Cuisine",
  "Musique",
  "Bien-être",
  "Tech",
  "Nature",
];

export const INTERESTS = [
  "🎨 Art",
  "⚽ Sport",
  "🍳 Cuisine",
  "🎵 Musique",
  "📚 Lecture",
  "🎮 Gaming",
  "🌿 Nature",
  "✈️ Voyages",
  "💻 Tech",
  "🎭 Théâtre",
  "📷 Photo",
  "🧘 Bien-être",
  "🎸 Guitare",
  "🏃 Running",
  "🍷 Gastronomie",
];

export const ACTIVITIES: Activity[] = [
  {
    id: 1,
    image: "/aquarelle.jpg",
    title: "Atelier peinture aquarelle",
    category: "Art",
    city: "Paris",
    groupsCount: 3,
    description:
      "Rejoins un groupe de passionné·e·s pour explorer la peinture aquarelle ensemble. Tous niveaux bienvenus — l'important c'est de s'amuser et de rencontrer des gens sympas !",
    color: "#F0D5C8",
  },
  {
    id: 2,
    image: "/football.jpg",
    title: "Foot du dimanche",
    category: "Sport",
    city: "Paris",
    groupsCount: 5,
    description:
      "Match amical chaque dimanche matin au parc. Tous niveaux, bonne ambiance garantie. On joue pour le plaisir, pas pour gagner.",
    color: "#D5E8D0",
  },
  {
    id: 3,
    image: "/cuisine.jpg",
    title: "Cuisine du monde",
    category: "Cuisine",
    city: "Paris",
    groupsCount: 2,
    description:
      "On se retrouve chez un membre pour cuisiner ensemble une recette d'ailleurs. Chaque session, un nouveau pays à explorer.",
    color: "#FDE8D0",
  },
  {
    id: 4,
    image: "/guitare.jpg",
    title: "Jam session guitar",
    category: "Musique",
    city: "Paris",
    groupsCount: 4,
    description:
      "Musiciens de tous niveaux, on improvise et on s'amuse ! Guitare, basse, voix... tout le monde est le bienvenu.",
    color: "#E0D5F0",
  },
  {
    id: 5,
    image: "/yoga.jpg",
    title: "Yoga en plein air",
    category: "Bien-être",
    city: "Paris",
    groupsCount: 6,
    description:
      "Séances de yoga dans les parcs parisiens chaque matin. Pour démarrer la journée du bon pied, entouré·e de gens bienveillants.",
    color: "#D5EEE8",
  },
  {
    id: 6,
    image: "/photo.jpg",
    title: "Balade photo urbaine",
    category: "Art",
    city: "Paris",
    groupsCount: 2,
    description:
      "On explore la ville appareil en main, partage de tips photo et regards croisés sur la ville. Smartphone ou reflex, peu importe.",
    color: "#F0D5C8",
  },
  {
    id: 7,
    image: "/coding.jpg",
    title: "Coding and Side projects",
    category: "Tech",
    city: "Paris",
    groupsCount: 3,
    description:
      "On se retrouve dans un café pour coder sur nos side projects respectifs. Ambiance studieuse et échanges techniques bienvenus.",
    color: "#D5DCF0",
  },
  {
    id: 8,
    image: "/randonnee.jpg",
    title: "Randonnée en forêt",
    category: "Nature",
    city: "Paris",
    groupsCount: 4,
    description:
      "Escapades vertes le week-end en forêt de Fontainebleau ou dans la vallée de Chevreuse. On respire, on marche, on parle.",
    color: "#D5E8D0",
  },
];

export const GROUPS: Group[] = [
  {
    id: 1,
    activityId: 1,
    name: "Aquarellistes du dimanche",
    description: "On se retrouve chaque dimanche pour peindre ensemble dans une bonne ambiance. Débutants bienvenus ! On apporte le matériel de base.",
    date: "Dim. 15 juin · 14h00",
    location: "Studio Art, Paris 11e",
    maxMembers: 8,
    members: ["Sofia R.", "Lucas M.", "Emma K.", "Thomas B."],
    organizer: "Sofia R.",
    contactLink: "https://discord.gg/example",
  },
  {
    id: 2,
    activityId: 2,
    name: "Foot du dimanche",
    description: "Match amical chaque dimanche matin au parc. Tous niveaux, bonne ambiance garantie.",
    date: "Dim. 22 juin · 10h00",
    location: "Bois de Vincennes, Paris 12e",
    maxMembers: 14,
    members: ["Jules M.", "Sofia R.", "Lucas M.", "Emma K.", "Thomas B.", "Camille T.", "Noah L.", "Lena V.", "Marc D.", "Antoine P."],
    organizer: "Jules M.",
    contactLink: "https://wa.me/example",
  },
  {
    id: 3,
    activityId: 3,
    name: "Cuisine coréenne",
    description: "On cuisine ensemble un repas coréen traditionnel. Débutants bienvenus, on apprend ensemble !",
    date: "Sam. 28 juin · 15h00",
    location: "Paris 9e",
    maxMembers: 6,
    members: ["Jules M.", "Sofia R.", "Lucas M.", "Emma K.", "Thomas B."],
    organizer: "Sofia R.",
    contactLink: "https://discord.gg/example3",
  },
  {
    id: 4,
    activityId: 5,
    name: "Yoga Jardin des Plantes",
    description: "Séance de yoga en plein air dans le Jardin des Plantes. Tapis recommandé.",
    date: "Ven. 20 juin · 8h00",
    location: "Jardin des Plantes, Paris 5e",
    maxMembers: 10,
    members: ["Jules M.", "Sofia R.", "Lucas M.", "Emma K.", "Thomas B.", "Camille T.", "Noah L."],
    organizer: "Jules M.",
    contactLink: "https://wa.me/example2",
  },
  {
    id: 5,
    activityId: 1,
    name: "Peintres du jeudi soir",
    description: "Session peinture détendue le jeudi soir après le boulot. Verre de vin autorisé 🍷",
    date: "Jeu. 12 juin · 19h30",
    location: "Café culturel, Paris 3e",
    maxMembers: 6,
    members: ["Camille T.", "Noah L."],
    organizer: "Camille T.",
    contactLink: "https://wa.me/example",
  },
  {
    id: 6,
    activityId: 1,
    name: "Atelier du samedi matin",
    description: "Pour les lève-tôt passionnés d'aquarelle. Petit dej partagé avant de commencer.",
    date: "Sam. 14 juin · 9h00",
    location: "Parc des Buttes-Chaumont, Paris 19e",
    maxMembers: 10,
    members: ["Lena V.", "Marc D.", "Julie S.", "Antoine P.", "Sara M."],
    organizer: "Lena V.",
    contactLink: "https://discord.gg/example2",
  },
];
export const MY_GROUPS = [
  {
    id: 1,
    image: "/images/aquarelle.jpg",
    name: "Aquarellistes du dimanche",
    activity: "Peinture aquarelle",
    date: "15 juin",
    location: "Paris 11e",
    members: 4,
    isOrganizer: false,
  },
  {
    id: 2,
    image: "/images/football.jpg",
    name: "Foot du dimanche",
    activity: "Foot en plein air",
    date: "22 juin",
    location: "Bois de Vincennes",
    members: 10,
    isOrganizer: false,
  },
  {
    id: 3,
    image: "/images/cuisine.jpg",
    name: "Cuisine coréenne",
    activity: "Cuisine du monde",
    date: "28 juin",
    location: "Paris 9e",
    members: 5,
    isOrganizer: false,
  },
  {
    id: 4,
    image: "/images/yoga.jpg",
    name: "Yoga Jardin des Plantes",
    activity: "Yoga en plein air",
    date: "20 juin",
    location: "Paris 5e",
    members: 7,
    isOrganizer: true,
  },
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

