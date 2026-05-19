import Link from "next/link";
import { PublicNavbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
   <div className="min-h-screen" style={{ background: "#2D1535" }}>
      <PublicNavbar />

      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="bg-ink flex items-center relative overflow-hidden px-8 pt-16 pb-16">
        {/* Background glow */}
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_70%_50%,rgba(196,96,58,0.25)_0%,transparent_70%)]" />

        <div className="max-w-2xl relative z-10">
          <div className="inline-block bg-tc/15 border border-tc/30 text-tc-light text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
            Pour les nouveaux arrivants en France
          </div>

          <h1 className="font-head font-black leading-[1.02] tracking-tight mb-8" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
  <span style={{ color: "#FAF7F2" }}>Nouvelle ville,</span><br />
  <span style={{ color: "#FAF7F2" }}>nouvelles</span><br />
  <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>aventures.</span>
</h1>

          <p className="text-lg text-white leading-relaxed mb-10 max-w-xl">
            Trouve des sorties qui te ressemblent, rejoins un groupe et rencontre
            des personnes qui partagent tes intérêts. Sans prise de tête.
          </p>

          <div className="flex gap-4 flex-wrap">
            <Link href="/inscription" className="btn btn-primary btn-lg text-base">
              Créer mon compte gratuit
            </Link>
            <Link
              href="/connexion"
              className="btn btn-lg text-base"
              style={{ background: "rgba(255,255,255,0.1)", color: "#fff", border: "1px solid rgba(255,255,255,0.2)" }}
            >
              Se connecter
            </Link>
          </div>
        </div>

        {/* Floating cards */}
        <div className="absolute right-12 bottom-20 hidden lg:flex flex-col gap-4">
          {[
            { emoji: "🎨", title: "Atelier peinture", info: "12 membres · Bordeaux" },
            { emoji: "🏃", title: "Marathon", info: "100 membres · Lyon 3e" },
            { emoji: "🎮", title: "Tournoi FC26", info: "20 membres · Paris 19e" },
            { emoji: "⚽", title: "Foot du dimanche", info: "15 membres · Marseille 9e" },
          ].map((card, i) => (
            <div
              key={i}
              className="flex items-center gap-3 bg-black/20 backdrop-blur border border-white/15 rounded-2xl px-5 py-4"
              style={{ animation: `float 3s ease-in-out ${i * -2}s infinite` }}
            >
              <div className="w-9 h-9 rounded-xl bg-tc flex items-center justify-center text-lg">
                {card.emoji}
              </div>
              <div>
                <p className="text-sm text-white font-medium">{card.title}</p>
                <p className="text-xs text-white/50">{card.info}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── Problem section ─────────────────────────────────────────── */}
      <section className="py-20 px-5 max-w-6xl mx-auto">
        <div className="flex items-center gap-2 text-tc text-xs font-semibold tracking-widest uppercase mb-4">
          <div className="w-3 h-0.5 bg-tc" />
          Le problème
        </div>
        <h2 className="font-head text-4xl md:text-5xl tracking-tight leading-tight mb-8">
  <span style={{ color: "#FAF7F2" }}>Arriver quelque part<br />ne devrait </span>
  <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>pas être seul.</span>
</h2>
        <p className="text-ink-2 text-lg leading-relaxed max-w-xl mb-16">
          Des milliers d&apos;étudiants et jeunes actifs déménagent chaque année.
          La plupart passent leurs premiers mois dans l&apos;ennui et la solitude.
        </p>

        <div className="grid md:grid-cols-3 gap-10 items-start">
          {[
  {
    num: "01",
    title: "Tu ne sais pas quoi faire",
    text: "Les grandes villes débordent d'activités, mais sans guidance ça paralyse. Trop de choix, pas de direction.",
    image: "https://images.unsplash.com/photo-1555949963-ff9fe0c870eb?w=600&q=80",
  },
  {
    num: "02",
    title: "Tu ne sais pas avec qui",
    text: "Google te donne des idées, pas des compagnons. Tes amis sont ailleurs. Les apps existantes sont trop formelles.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    num: "03",
    title: "Rencontrer des gens, c'est compliqué",
    text: "Les réseaux sociaux sont bruyants, Meetup est rigide. Il n'existait pas d'espace dédié aux jeunes.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
          ].map((item) => (
            <div
              key={item.num}
              className="group self-start hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
              style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}
            >
              <div className="h-0 group-hover:h-44 overflow-hidden transition-all duration-500">
                <img
                  src={item.image}
                  alt={item.title}
                  className="w-full h-44 object-cover"
                />
              </div>
              <div className="p-10">
                <div className="font-head text-7xl font-black leading-none mb-8 transition-colors duration-300"
                  style={{ color: item.num === "01" ? "#C4603A" : item.num === "02" ? "#B8722E" : "#F0A860" }}>
                  {item.num}
                </div>
                <h3 className="font-semibold text-xl mb-4" style={{ color: "#FAF7F2" }}>{item.title}</h3>
                <p className="text-sm leading-relaxed" style={{ color: "rgba(250,247,242,0.55)" }}>{item.text}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ────────────────────────────────────────────── */}
      <section className="bg-ink pt-5 pb-32 px-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-center gap-0 text-tc text-xs font-semibold tracking-widest uppercase mb-3">
            <div className="w-7 h-0.5 bg-tc" />
            Comment ça marche
          </div>
          <h2 className="font-head text-4xl md:text-5xl tracking-tight leading-tight mb-20">
  <span style={{ color: "#FAF7F2" }}>Trois étapes,<br /></span>
  <span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>mille rencontres.</span>
</h2>

          <div className="grid md:grid-cols-3 gap-10 items-start">
            {[
  {
    num: "01",
    title: "Cherche par intérêt",
    text: "Parcours nos catégories : Sport, Art, Cuisine, Musique, Tech… Trouve ce qui t'inspire.",
    image: "https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=600&q=80",
  },
  {
    num: "02",
    title: "Rejoins ou crée un groupe",
    text: "Rejoins un groupe existant ou lance le tien. Tu définis la date, le lieu et l'ambiance.",
    image: "https://images.unsplash.com/photo-1529156069898-49953e39b3ac?w=600&q=80",
  },
  {
    num: "03",
    title: "Rencontre des personnes",
    text: "Vas-y, passe un bon moment, et construis ton réseau naturellement.",
    image: "https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80",
  },
            ].map((step) => (
              <div key={step.num} className="group self-start hover:-translate-y-1 transition-all duration-300 rounded-2xl overflow-hidden"
                style={{ background: "rgba(255,255,255,0.06)", border: "1px solid rgba(255,255,255,0.12)" }}>
                <div className="h-0 group-hover:h-44 overflow-hidden transition-all duration-500">
                  <img
                    src={step.image}
                    alt={step.title}
                    className="w-full h-44 object-cover"
                  />
                </div>
                <div className="p-10">
                  <div className="font-head text-7xl font-black leading-none mb-8 transition-colors duration-300"
                    style={{ color: step.num === "01" ? "#C4603A" : step.num === "02" ? "#B8722E" : "#F0A860" }}> 
                    {step.num}
                  </div>
                  <h3 className="font-semibold text-xl mb-4" style={{ color: "#FAF7F2" }}>{step.title}</h3>
                  <p className="text-sm leading-relaxed" style={{ color: "rgba(250,247,242,0.55)" }}>{step.text}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ──────────────────────────────────────────────── */}
      <section className="bg-tc py-15 px-8 text-center">
        <h2 className="font-head text-4xl md:text-5xl text-white tracking-tight mb-4">
          Prêt·e à explorer ta ville ?
        </h2>
        <p className="text-white/80 mb-8 text-lg">
          C&apos;est gratuit, c&apos;est simple, et ça peut tout changer.
        </p>
        <Link
          href="/inscription"
          className="inline-flex items-center gap-2 bg-white text-tc font-semibold px-8 py-4 rounded-full text-base hover:bg-tc-light transition-colors"
        >
          Créer mon compte
        </Link>
      </section>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-ink text-black/80 text-center py-8 text-sm">
        <span className="font-head text-black/80">Around Activities</span>
        {" "}· Fait avec amours pour les nouveaux arrivants · 2026
      </footer>
    </div>
  );
}
