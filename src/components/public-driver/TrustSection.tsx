export default function TrustSection() {
  const cards = [
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/><polyline points="22 4 12 14.01 9 11.01"/></svg>, title: "Chauffeur vérifié", desc: "Carte professionnelle VTC" },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>, title: "Service Premium", desc: "Ponctualité et discrétion" },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>, title: "Prix Fixe", desc: "Sans majoration" },
    { icon: <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5"><path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/></svg>, title: "Prise en charge", desc: "Accueil sur-mesure" }
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
      {cards.map((c, i) => (
        <div key={i} className="glass rounded-[1.5rem] p-5 md:p-6 flex flex-col items-center justify-center text-center border border-surface-border">
          <div className="w-12 h-12 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-4">
            <div className="w-6 h-6">{c.icon}</div>
          </div>
          <h4 className="text-sm font-black text-foreground mb-1 tracking-tight">{c.title}</h4>
          <p className="text-xs font-medium text-text-muted">{c.desc}</p>
        </div>
      ))}
    </div>
  );
}
