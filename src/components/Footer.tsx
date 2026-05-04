export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="py-20 bg-white border-t border-surface-border">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        <div className="flex flex-col md:flex-row justify-between items-start gap-12 mb-20">
          <div className="space-y-6 max-w-sm">
            <div className="display text-2xl font-medium tracking-tighter">
              Privé<span className="italic font-normal">Chauffeur.</span>
            </div>
            <p className="text-text-muted text-sm font-medium leading-relaxed">
              La plateforme premium pour les chauffeurs privés qui souhaitent développer leur propre clientèle en toute indépendance.
            </p>
          </div>
          
          <div className="grid grid-cols-2 md:grid-cols-3 gap-x-16 gap-y-10">
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Produit</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#fonctionnalites" className="hover:text-foreground transition-colors">Fonctionnalités</a></li>
                <li><a href="#tarifs" className="hover:text-foreground transition-colors">Tarifs</a></li>
                <li><a href="#faq" className="hover:text-foreground transition-colors">FAQ</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Compte</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="/auth/login" className="hover:text-foreground transition-colors">Connexion</a></li>
                <li><a href="/auth/register" className="hover:text-foreground transition-colors">Inscription</a></li>
                <li><a href="/dashboard" className="hover:text-foreground transition-colors">Dashboard</a></li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-[10px] font-black text-text-muted uppercase tracking-widest">Légal</h4>
              <ul className="space-y-2 text-sm font-medium">
                <li><a href="#" className="hover:text-foreground transition-colors">Mentions légales</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">Confidentialité</a></li>
                <li><a href="#" className="hover:text-foreground transition-colors">CGV</a></li>
              </ul>
            </div>
          </div>
        </div>

        <div className="pt-8 border-t border-surface-border flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-[10px] font-black text-text-muted uppercase tracking-widest">
            © {currentYear} PrivéChauffeur — Tous droits réservés.
          </p>
          <div className="flex items-center gap-6">
             <a href="#" className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-foreground transition-colors">Twitter</a>
             <a href="#" className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-foreground transition-colors">LinkedIn</a>
             <a href="#" className="text-[10px] font-black text-text-muted uppercase tracking-widest hover:text-foreground transition-colors">Instagram</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
