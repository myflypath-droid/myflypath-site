import React from "react";

export default function CGV() {
  return (
    <div className="min-h-screen py-24 px-5" style={{ background: '#13141f', color: '#fff' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Conditions Générales de Vente</h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Dernière mise à jour : avril 2025</p>

        {[
          {
            title: "1. Vendeur",
            content: `Les présentes CGV sont proposées par MyFlyPath SAS, société de droit français. Contact : contact@myflypath.fr`
          },
          {
            title: "2. Produits et services",
            content: `MyFlyPath commercialise les offres suivantes :\n• Formule Gratuite : accès limité sans frais\n• Formule LogBook à 4,99 €/mois : LogBook illimité, export EASA, carte des routes, stats détaillées\n• Formule Training à 4,99 €/mois : parcours PPL & IFR, fiches, quiz, examens blancs\n• Formule Pro mensuelle à 8,99 €/mois : accès complet sans simulateur IFR\n• Formule Pro annuelle à 89,99 €/an : accès complet incluant le simulateur IFR\n• Achats in-app : énergie, freezes, gemmes`
          },
          {
            title: "3. Prix",
            content: `Tous les prix sont indiqués en euros TTC. MyFlyPath se réserve le droit de modifier ses tarifs à tout moment. Les prix applicables sont ceux en vigueur au moment de la souscription.`
          },
          {
            title: "4. Paiement",
            content: `Les paiements sont sécurisés et traités via l'App Store Apple et/ou Stripe. MyFlyPath SAS ne stocke aucune donnée bancaire. En cas de paiement via l'App Store, les conditions de paiement d'Apple s'appliquent.`
          },
          {
            title: "5. Abonnements et renouvellement",
            content: `Les abonnements sont à renouvellement automatique. L'utilisateur peut résilier à tout moment depuis son compte App Store, au moins 24h avant la date de renouvellement. Aucun remboursement ne sera effectué pour la période en cours.`
          },
          {
            title: "6. Droit de rétractation",
            content: `Conformément à l'article L221-28 du Code de la consommation, le droit de rétractation ne s'applique pas aux contenus numériques dont l'exécution a commencé avec l'accord préalable du consommateur. En acceptant les présentes CGV, vous renoncez expressément à votre droit de rétractation dès l'accès au contenu.`
          },
          {
            title: "7. Remboursements",
            content: `Les achats effectués via l'App Store sont soumis à la politique de remboursement d'Apple. Pour tout autre litige, contactez-nous à contact@myflypath.fr.`
          },
          {
            title: "8. Droit applicable",
            content: `Les présentes CGV sont régies par le droit français. Tout litige sera de la compétence exclusive des tribunaux français.`
          },
        ].map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#FF9500' }}>{section.title}</h2>
            <p className="leading-relaxed whitespace-pre-line" style={{ color: 'rgba(255,255,255,0.65)' }}>{section.content}</p>
          </div>
        ))}

        <p className="mt-12 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Contact : <a href="mailto:contact@myflypath.fr" style={{ color: '#FF9500' }}>contact@myflypath.fr</a>
        </p>
      </div>
    </div>
  );
}
