import React from "react";

export default function Confidentialite() {
  return (
    <div className="min-h-screen py-24 px-5" style={{ background: '#13141f', color: '#fff' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Politique de Confidentialité</h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Dernière mise à jour : avril 2025</p>

        {[
          {
            title: "1. Responsable du traitement",
            content: `MyFlyPath SAS, société de droit français. Contact : contact@myflypath.fr`
          },
          {
            title: "2. Données collectées",
            content: `Dans le cadre de l'utilisation de MyFlyPath, nous collectons les données suivantes :\n• Données d'identification : adresse email, prénom\n• Données de vol : heures de vol, aéronefs, aérodromes, types de vol\n• Données de progression : leçons suivies, quiz réalisés, badges obtenus\n• Données de paiement : gérées exclusivement par Apple et/ou Stripe, non stockées par MyFlyPath`
          },
          {
            title: "3. Finalités du traitement",
            content: `Vos données sont utilisées pour :\n• Créer et gérer votre compte utilisateur\n• Personnaliser votre expérience d'apprentissage\n• Gérer vos abonnements et achats\n• Vous envoyer des communications relatives à votre compte (si consentement)\n• Améliorer nos services`
          },
          {
            title: "4. Base légale",
            content: `Le traitement de vos données est fondé sur :\n• L'exécution du contrat (utilisation de l'application)\n• Votre consentement (communications marketing)\n• Notre intérêt légitime (amélioration du service)`
          },
          {
            title: "5. Conservation des données",
            content: `Vos données sont conservées pendant toute la durée de votre utilisation de l'application, puis supprimées dans un délai de 3 ans après la dernière activité ou sur demande de votre part.`
          },
          {
            title: "6. Partage des données",
            content: `Vos données ne sont jamais vendues à des tiers. Elles peuvent être partagées avec :\n• Apple (gestion des paiements App Store)\n• Stripe (gestion des paiements en ligne)\n• Nos hébergeurs techniques (dans l'UE ou avec garanties adéquates)`
          },
          {
            title: "7. Vos droits (RGPD)",
            content: `Conformément au RGPD, vous disposez des droits suivants :\n• Droit d'accès à vos données\n• Droit de rectification\n• Droit à l'effacement (« droit à l'oubli »)\n• Droit à la portabilité\n• Droit d'opposition\n\nPour exercer ces droits : contact@myflypath.fr`
          },
          {
            title: "8. Sécurité",
            content: `MyFlyPath met en œuvre toutes les mesures techniques et organisationnelles appropriées pour protéger vos données contre tout accès non autorisé, perte ou divulgation.`
          },
          {
            title: "9. Cookies",
            content: `MyFlyPath n'utilise pas de cookies de traçage ou d'analyse tiers. Seuls les cookies strictement nécessaires au fonctionnement de l'application peuvent être utilisés.`
          },
          {
            title: "10. Contact & réclamations",
            content: `Pour toute question relative à vos données personnelles : contact@myflypath.fr\nVous pouvez également adresser une réclamation à la CNIL : www.cnil.fr`
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
