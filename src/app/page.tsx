import Link from "next/link";
import { PublicNavbar } from "@/components/Navbar";

export default function LandingPage() {
  return (
   <div className="min-h-screen" style={{ background: "#2D1535" }}>
      <PublicNavbar />
      {/* ── Hero ────────────────────────────────────────────────────── */}
      <section className="flex items-center relative px-8 pt-24 pb-24" style={{ background: "transparent" }}>
        {/* Background glow */}
        <div className="absolute inset-0" style={{ background: "radial-gradient(ellipse 70% 90% at 85% 15%, rgba(196,96,58,0.55) 0%, rgba(160,60,180,0.3) 50%, transparent 80%)" }} />

        <div className="max-w-2xl relative z-10">
          <div className="inline-block bg-white/10 border  text-white text-xs font-semibold tracking-widest uppercase px-4 py-2 rounded-full mb-8">
  Pour les nouveaux arrivants en France
</div>

          <h1 className="font-head font-black leading-[1.02] tracking-tight mb-8" style={{ fontSize: "clamp(3rem, 7vw, 5.5rem)" }}>
  <span style={{ color: "#FAF7F2" }}>Nouvelle ville,</span><br />
<span style={{ color: "#FAF7F2" }}>nouvelles </span>
<span style={{ background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)", WebkitBackgroundClip: "text", backgroundClip: "text", WebkitTextFillColor: "transparent", color: "transparent" }}>aventures.</span>
</h1>

<p style={{ fontSize: "1.1rem", color: "rgba(255,255,255,0.8)", lineHeight: 1.75, marginBottom: "3.5rem", maxWidth: "520px" }}>
  Trouve des sorties qui te ressemblent, rejoins un groupe et rencontre
  des personnes qui partagent tes intérêts. Sans prise de tête.
</p>

          <div className="flex gap-4 flex-wrap">
            
          </div>
        </div>

        
      </section>


      {/* ── Problem section ─────────────────────────────────────────── */}
      <section className="pt-1 pb-20 px-5 max-w-6xl mx-auto">

  <div className="flex items-center gap-2 text-white text-xs font-semibold tracking-widest uppercase mb-4">
    <div className="w-3 h-0.5 bg-tc" />
    Le problème
  </div>

  <h2 className="font-head text-4xl md:text-5xl tracking-tight leading-tight mb-8">
    <span style={{ color: "#FAF7F2" }}>
      Arriver quelque part<br />ne devrait{" "}
    </span>
    <span
      style={{
        background: "linear-gradient(135deg, #C4603A, #E8924A, #F0A860)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent",
      }}
    >
      pas être seul.
    </span>
  </h2>

  <p style={{ color: "rgba(250,247,242,0.65)", fontSize: "1.05rem", lineHeight: 1.7, maxWidth: "520px", marginBottom: "2rem" }}>
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
          <div className="flex items-center gap-0 text-white text-xs font-semibold tracking-widest uppercase mb-3">
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
    image: "https://i.pinimg.com/736x/c6/2a/70/c62a709be081d53f3a5755e0d3de5922.jpg",
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
      </section>

<div className="bg-tc flex justify-center py-8">
  <div className="h-24 w-24 md:h-32 md:w-32 rounded-full overflow-hidden opacity-80 hover:opacity-100 transition">
    <video
      src="/logo.mp4"
      autoPlay
      loop
      muted
      playsInline
      className="h-full w-full object-cover"
    />
  </div>
</div>

      {/* ── Footer ──────────────────────────────────────────────────── */}
      <footer className="bg-ink text-white/80 text-center py-8 text-sm">
        <span className="font-head text-white/80">Around Activities</span>
        {" "}· Fait avec amours pour les nouveaux arrivants · 2026
      </footer>
    </div>
  );
}
