export default function ServicesSection({ services }: { services: any[] }) {
  return (
    <section id="services" className="scroll-mt-28 space-y-6">
      <h2 className="text-2xl md:text-3xl font-black text-foreground tracking-tight">Prestations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {services.map(s => (
          <div key={s.id} className="glass rounded-[1.5rem] p-5 border border-surface-border">
            <h4 className="text-lg font-bold text-foreground mb-2">{s.title}</h4>
            <p className="text-sm font-medium text-text-muted leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
