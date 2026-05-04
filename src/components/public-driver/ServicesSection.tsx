export default function ServicesSection({ services }: { services: any[] }) {
  return (
    <section id="services" className="scroll-mt-28 space-y-8 animate-fade-up">
      <h2 className="display text-3xl font-medium text-foreground tracking-tight">Prestations</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
        {services.map(s => (
          <div key={s.id} className="card p-6 border-surface-border group hover:border-foreground/10 transition-colors">
            <h4 className="display text-lg font-medium text-foreground mb-3">{s.title}</h4>
            <p className="text-sm font-medium text-text-muted leading-relaxed">{s.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
