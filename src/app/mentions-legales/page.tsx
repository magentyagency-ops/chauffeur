import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function MentionsLegales() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Mentions Légales</h1>
          <p className="text-white/40 text-sm">En vigueur au {new Date().toLocaleDateString("fr-FR")}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">1. Édition du site</h2>
            <p>
              Le présent site internet, accessible à l'adresse <strong>vroompro.fr</strong> (ci-après le « Site »), est édité par l'entreprise individuelle de transport exploitant la marque <strong>Vroom</strong>, immatriculée sous le numéro SIRET <strong>951 653 476 00014</strong>.
            </p>
            <p>
              Pour toute question ou réclamation, vous pouvez contacter l'éditeur par courrier électronique à l'adresse suivante : <strong>contact@vroompro.fr</strong>.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">2. Hébergement</h2>
            <p>
              Le Site est hébergé par la société <strong>Vercel Inc.</strong>, située au 340 S Lemon Ave #4133 Walnut, CA 91789, États-Unis (téléphone : +1 507-250-4041).
            </p>
            <p>
              Les bases de données et services applicatifs backend sont hébergés par la société <strong>Supabase Inc.</strong>, située au 970 Summer St, Stamford, CT 06905, États-Unis.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">3. Propriété intellectuelle</h2>
            <p>
              La structure générale du Site, ainsi que les textes, graphismes, images, sons et vidéos la composant, sont la propriété de l'éditeur ou de ses partenaires. Toute représentation, reproduction, ou exploitation partielle ou totale des contenus et services proposés par le Site, par quelque procédé que ce soit, sans l'autorisation préalable et écrite de l'éditeur est strictement interdite et serait susceptible de constituer une contrefaçon au sens des articles L 335-2 et suivants du Code de la propriété intellectuelle.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">4. Responsabilité</h2>
            <p>
              L'éditeur s'efforce de fournir des informations aussi précises que possible sur le Site. Toutefois, il ne pourra être tenu responsable des omissions, des inexactitudes et des carences dans la mise à jour, qu'elles soient de son fait ou du fait des tiers partenaires qui lui fournissent ces informations.
            </p>
            <p>
              L'utilisation des informations et contenus disponibles sur l'ensemble du Site ne saurait en aucun cas engager la responsabilité de l'éditeur, à quelque titre que ce soit. L'utilisateur est seul maître de la bonne utilisation, avec discernement et esprit, des informations mises à sa disposition sur le Site.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">5. Droit applicable</h2>
            <p>
              Le Site et ses mentions légales sont soumis au droit français. En cas de litige, et à défaut d'accord amiable, le différend sera soumis aux tribunaux français compétents.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
