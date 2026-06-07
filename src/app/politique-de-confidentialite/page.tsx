import Navbar from "@/components/Navbar";
import Footer from "@/components/Footer";

export default function PolitiqueConfidentialite() {
  return (
    <div className="min-h-screen bg-black text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="max-w-4xl mx-auto px-6 pt-32 pb-24 relative z-10">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-white/5 rounded-full blur-[120px] pointer-events-none" />
        
        <div className="mb-12 border-b border-white/10 pb-8">
          <h1 className="text-4xl font-bold tracking-tight mb-4">Politique de Confidentialité</h1>
          <p className="text-white/40 text-sm">Dernière mise à jour le {new Date().toLocaleDateString("fr-FR")}</p>
        </div>

        <div className="space-y-10 text-white/70 leading-relaxed text-sm">
          {/* Section 1 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">1. Présentation générale</h2>
            <p>
              Dans le cadre de l'utilisation de la plateforme <strong>Vroom</strong> (accessible sur <strong>vroompro.fr</strong>), nous attachons une importance particulière à la protection de vos données personnelles et au respect du Règlement Général sur la Protection des Données (RGPD).
            </p>
            <p>
              Cette politique de confidentialité décrit les informations que nous collectons, la manière dont nous les utilisons et les choix dont vous disposez concernant ces données.
            </p>
          </section>

          {/* Section 2 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">2. Données collectées</h2>
            <p>
              Nous collectons et traitons les types de données suivants :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>
                <strong>Données des Chauffeurs :</strong> Nom complet, adresse email, numéro de téléphone, ville d'exercice, modèle de véhicule, informations de paiement via Stripe (si abonné), et identifiants de connexion Supabase.
              </li>
              <li>
                <strong>Données des Clients des Chauffeurs :</strong> Nom, prénom, numéro de téléphone, adresse email (optionnel), adresses de départ et d'arrivée, dates, heures et notes sur les trajets.
              </li>
              <li>
                <strong>Données techniques :</strong> Données de connexion, adresses IP, type de navigateur et informations sur les cookies de session.
              </li>
            </ul>
          </section>

          {/* Section 3 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">3. Finalités du traitement</h2>
            <p>
              Les données personnelles recueillies sur le Site sont traitées pour les finalités suivantes :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li>Création et gestion des comptes chauffeurs.</li>
              <li>Mise en relation et planification des courses entre les clients et les chauffeurs.</li>
              <li>Gestion de la facturation et des abonnements via notre prestataire Stripe.</li>
              <li>Envoi de notifications push ou alertes en temps réel relatives aux réservations.</li>
              <li>Amélioration technique du Site et sécurité de la plateforme.</li>
            </ul>
          </section>

          {/* Section 4 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">4. Partage et destinataires des données</h2>
            <p>
              Vos données personnelles sont strictement confidentielles et ne sont jamais transmises ou revendues à des tiers à des fins publicitaires. Elles peuvent être partagées uniquement avec nos sous-traitants techniques de confiance pour le bon fonctionnement du Site :
            </p>
            <ul className="list-disc pl-5 space-y-2">
              <li><strong>Supabase :</strong> Hébergement des données et authentification sécurisée.</li>
              <li><strong>Stripe :</strong> Gestion sécurisée des abonnements chauffeurs (Vroom ne stocke aucune coordonnée bancaire).</li>
            </ul>
          </section>

          {/* Section 5 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">5. Durée de conservation</h2>
            <p>
              Les données des chauffeurs sont conservées pendant toute la durée active du compte, puis supprimées ou anonymisées dans un délai de 3 mois après la fermeture du compte.
            </p>
            <p>
              Les données des clients et des réservations de trajets sont conservées pendant une durée maximale de 3 ans après le dernier contact commercial ou la fin de la course, afin de permettre au chauffeur de suivre l'historique de sa clientèle privée.
            </p>
          </section>

          {/* Section 6 */}
          <section className="space-y-3">
            <h2 className="text-lg font-semibold text-white tracking-wide">6. Vos droits</h2>
            <p>
              Conformément à la réglementation européenne, vous disposez d'un droit d'accès, de rectification, de suppression, de limitation du traitement et de portabilité de vos données personnelles.
            </p>
            <p>
              Pour exercer ces droits, vous pouvez nous contacter par courrier électronique à l'adresse suivante : <strong>contact@vroompro.fr</strong>.
            </p>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
