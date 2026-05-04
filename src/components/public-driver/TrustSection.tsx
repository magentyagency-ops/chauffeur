export default function TrustSection() {
  const cards = [
    { title: "Vérifié", desc: "Carte pro VTC" },
    { title: "Premium", desc: "Service discrétion" },
    { title: "Prix Fixe", desc: "Zéro majoration" },
    { title: "Sur-mesure", desc: "Accueil dédié" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 animate-fade-up">
      {cards.map((c, i) => (
        <div key={i} className="text-center md:text-left space-y-2 group">
          <h4 className="display text-xl font-medium text-foreground tracking-tight group-hover:text-primary transition-colors">{c.title}</h4>
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
