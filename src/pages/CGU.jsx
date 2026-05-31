import React from "react";

export default function CGU() {
  return (
    <div className="min-h-screen py-24 px-5" style={{ background: '#13141f', color: '#fff' }}>
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-black mb-2">Conditions Générales d'Utilisation</h1>
        <p className="text-sm mb-12" style={{ color: 'rgba(255,255,255,0.4)' }}>Dernière mise à jour : avril 2025</p>

        {[
          {
            title: "1. Présentation",
            content: `MyFlyPath est une application mobile éditée par la société MyFlyPath SAS, dont le siège social est en France. Elle est accessible via l'App Store d'Apple. Pour toute question : contact@myflypath.fr`
          },
          {
            title: "2. Acceptation des conditions",
            content: `L'utilisation de MyFlyPath implique l'acceptation pleine et entière des présentes CGU. Si vous n'acceptez pas ces conditions, vous devez cesser d'utiliser l'application.`
          },
          {
            title: "3. Description du service",
            content: `MyFlyPath propose une plateforme d'apprentissage à destination des élèves pilotes et pilotes privés, incluant : des cours théoriques PPL et IFR, un LogBook digital, un simulateur IFR, des fiches de révision, des quiz adaptatifs, et un système de gamification (badges, XP, défis).`
          },
          {
            title: "4. Accès et compte utilisateur",
            content: `L'accès à certaines fonctionnalités nécessite la création d'un compte. L'utilisateur s'engage à fournir des informations exactes et à maintenir la confidentialité de ses identifiants. MyFlyPath se réserve le droit de suspendre tout compte en cas d'utilisation abusive.`
          },
          {
            title: "5. Abonnements et achats in-app",
            content: `MyFlyPath propose une version gratuite ainsi que des abonnements payants (mensuel et annuel) et des achats in-app. Les paiements sont gérés via l'App Store (Apple) et/ou Stripe. Tout achat est définitif. Les abonnements se renouvellent automatiquement sauf résiliation avant la date de renouvellement. La résiliation s'effectue depuis les réglages de votre compte App Store.`
          },
          {
            title: "6. Propriété intellectuelle",
            content: `L'ensemble du contenu de MyFlyPath (textes, images, logos, code, structure pédagogique) est la propriété exclusive de MyFlyPath SAS. Toute reproduction, diffusion ou exploitation sans autorisation écrite est strictement interdite.`
          },
          {
            title: "7. Limitation de responsabilité",
            content: `MyFlyPath est un outil pédagogique complémentaire. Il ne remplace en aucun cas une formation officielle auprès d'un organisme agréé. MyFlyPath SAS ne saurait être tenue responsable de toute décision prise sur la base du contenu de l'application.`
          },
          {
            title: "8. Modification des CGU",
            content: `MyFlyPath se réserve le droit de modifier les présentes CGU à tout moment. Les utilisateurs seront informés des changements significatifs. La poursuite de l'utilisation de l'application vaut acceptation des nouvelles CGU.`
          },
          {
            title: "9. Droit applicable",
            content: `Les présentes CGU sont soumises au droit français. Tout litige sera soumis aux tribunaux compétents de France.`
          },
        ].map((section) => (
          <div key={section.title} className="mb-8">
            <h2 className="text-lg font-bold mb-2" style={{ color: '#FF9500' }}>{section.title}</h2>
            <p className="leading-relaxed" style={{ color: 'rgba(255,255,255,0.65)' }}>{section.content}</p>
          </div>
        ))}

        <p className="mt-12 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Contact : <a href="mailto:contact@myflypath.fr" style={{ color: '#FF9500' }}>contact@myflypath.fr</a>
        </p>
      </div>
    </div>
  );
}
