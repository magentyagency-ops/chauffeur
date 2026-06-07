export default function PublicFooter({ driver }: { driver: any }) {
  return (
    <footer className="border-t border-surface-border mt-24 bg-surface/30 pb-28 md:pb-12">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
          
          <div className="space-y-4">
            <div className="font-black text-xl text-foreground tracking-tight">{driver.publicName}</div>
            <p className="text-sm font-medium text-text-muted leading-relaxed max-w-sm">
              {driver.shortDescription}
            </p>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Contact</h4>
            <ul className="space-y-2">
              <li>
                <a href={`tel:${driver.phone}`} className="text-sm font-medium text-text-muted hover:text-foreground transition-colors flex items-center gap-2">
                  <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z"/></svg>
                  {driver.phone}
                </a>
              </li>
              <li>
                <a href={`https://wa.me/${driver.whatsapp}`} target="_blank" rel="noopener noreferrer" className="text-sm font-medium text-text-muted hover:text-[#25D366] transition-colors flex items-center gap-2">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-3.5 h-3.5"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51a12.8 12.8 0 0 0-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 0 1-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 0 1-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 0 1 2.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0 0 12.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 0 0 5.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 0 0-3.48-8.413Z"/></svg>
                  WhatsApp
                </a>
              </li>
            </ul>
          </div>

          <div className="space-y-4">
            <h4 className="text-sm font-bold text-foreground uppercase tracking-wider">Liens utiles</h4>
            <ul className="space-y-2">
              <li><a href="#services" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">Prestations</a></li>
              <li><a href="#avis" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">Avis clients</a></li>
              <li><a href="#faq" className="text-sm font-medium text-text-muted hover:text-foreground transition-colors">Foire aux questions</a></li>
            </ul>
          </div>

        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="text-sm font-medium text-text-muted">
            © {new Date().getFullYear()} {driver.publicName}. Tous droits réservés.
          </div>
          <a href="/" target="_blank" className="flex items-center gap-2 text-sm font-medium text-text-muted hover:text-foreground transition-colors">
            Propulsé par 
            <span className="font-bold text-foreground flex items-center gap-1.5">
              <div className="w-5 h-5 rounded-md bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><path d="M12 2L2 7l10 5 10-5-10-5z"/><path d="M2 17l10 5 10-5"/><path d="M2 12l10 5 10-5"/></svg>
              </div>
              Vroom
            </span>
          </a>
        </div>
      </div>
    </footer>
  );
}
