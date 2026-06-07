import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function CGU() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Conditions Générales d'Utilisation</h1>
          <p className="text-white/40 text-sm">En vigueur au {new Date().toLocaleDateString("fr-FR")}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">1. Objet de la plateforme</h2>
            <p>
              La plateforme <strong>Vroom</strong> (ci-après « Vroom ») est un service en ligne d'aide à la gestion de réservation en direct pour les chauffeurs VTC indépendants. Vroom fournit aux chauffeurs des outils numériques (page de réservation publique, tableau de bord, génération de QR codes, suivi client) pour leur permettre de développer et de fidéliser leur clientèle privée sans intermédiaire.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">2. Rôle et responsabilité de Vroom</h2>
            <p>
              <strong>Vroom est un éditeur de logiciel et n'est en aucun cas une entreprise de transport.</strong>
            </p>
            <p>
              Le contrat de transport est conclu exclusivement et directement entre le Client et le Chauffeur. Par conséquent, Vroom ne pourra en aucun cas être tenu responsable des litiges, retards, annulations, comportements ou accidents survenus à l'occasion de la réalisation d'une course réservée via la plateforme.
            </p>
            <p>
              Le Chauffeur exerce son activité de transport routier de personnes en toute indépendance et sous sa propre responsabilité juridique, professionnelle et fiscale.
            </p>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">3. Inscription et obligations du Chauffeur</h2>
            <p>
              Pour utiliser Vroom, le Chauffeur doit créer un compte et s'assurer de la véracité des informations transmises. Le Chauffeur s'engage à être en conformité constante avec la législation applicable à l'exercice de son activité de VTC (détention de la carte professionnelle, assurance responsabilité civile professionnelle transport de personnes à titre onéreux, déclaration d'activité, etc.).
            </p>
            <p>
              Le Chauffeur s'engage à traiter les demandes de réservation reçues avec professionnalisme et réactivité.
            </p>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">4. Conditions financières</h2>
            <p>
              L'utilisation des outils de Vroom pour les Chauffeurs est soumise à un abonnement payant fixe et mensuel. Les tarifs sont indiqués sur le Site.
            </p>
            <p>
              <strong>Aucune commission n'est prélevée par Vroom sur les courses réalisées par le Chauffeur.</strong> Le Chauffeur encaisse directement le prix de la course auprès de son client final selon les modalités convenues entre eux (espèces, carte bancaire à bord, etc.).
            </p>
            <p>
              Le paiement de l'abonnement s'effectue par carte bancaire via le système de paiement sécurisé Stripe. L'abonnement est sans engagement et peut être résilié à tout moment depuis l'espace personnel du Chauffeur. Tout mois entamé reste dû.
            </p>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">5. Modification des CGU</h2>
            <p>
              Vroom se réserve le droit de modifier à tout moment les présentes conditions d'utilisation. Les modifications seront applicables dès leur mise en ligne sur le Site. L'utilisation continue du Site après publication des modifications vaut acceptation de ces dernières.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
