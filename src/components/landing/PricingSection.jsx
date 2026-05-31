import React, { useState, useEffect, useRef } from "react";
import { Check } from "lucide-react";

const REDUCTION = Math.round((1 - 89.99 / (8.99 * 12)) * 100);

const specificPlans = {
  logbook: {
    name: "LogBook",
    color: "#4CAF50",
    features: [
      "LogBook illimité",
      "Export PDF EASA",
      "Carte des routes complète",
      "Partage carrousel social",
      "Agenda des vols",
      "Stats détaillées",
    ],
  },
  training: {
    name: "Training",
    color: "#4A7FE0",
    features: [
      "Parcours PPL & IFR complets",
      "Fiches de révision illimitées",
      "Quiz adaptatifs",
      "Examens blancs illimités",
      "Badges & défis",
      "Énergie illimitée",
    ],
  },
};

export default function PricingSection() {
  const [isAnnual, setIsAnnual] = useState(false);
  const [specificTab, setSpecificTab] = useState("logbook");
  const sectionRef = useRef(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".reveal");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("revealed");
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  const active = specificPlans[specificTab];

  return (
    <section id="pricing" className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <style>{`
        .reveal {
          opacity: 0;
          transition: opacity 0.35s ease !important;
          transform: none !important;
          will-change: opacity;
        }
        .reveal.revealed { opacity: 1; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transition: none !important; }
        }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-12"
          style={{ background: '#FF9500' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="max-w-2xl mb-12 mx-auto text-center">
          <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF9500' }}>
            Tarifs
          </p>
          <h2 className="reveal text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Commence gratuitement.
            <br />
            <span className="gradient-text-orange">Décolle avec Pro.</span>
          </h2>
        </div>

        {/* Toggle mensuel / annuel */}
        <div className="reveal flex items-center justify-center gap-4 mb-12">
          <span className="text-sm font-semibold" style={{ color: !isAnnual ? '#fff' : 'rgba(255,255,255,0.4)' }}>
            Mensuel
          </span>
          <button
            onClick={() => setIsAnnual(!isAnnual)}
            className="relative w-14 h-7 rounded-full transition-all duration-300"
            style={{ background: isAnnual ? '#FF9500' : 'rgba(255,255,255,0.15)' }}
          >
            <div
              className="absolute top-1 w-5 h-5 rounded-full bg-white transition-all duration-300"
              style={{ left: isAnnual ? '2rem' : '0.25rem' }}
            />
          </button>
          <span className="text-sm font-semibold flex items-center gap-2" style={{ color: isAnnual ? '#fff' : 'rgba(255,255,255,0.4)' }}>
            Annuel
            <span className="text-xs font-bold px-2 py-0.5 rounded-full" style={{ background: 'rgba(255,149,0,0.2)', color: '#FF9500' }}>
              -{REDUCTION}%
            </span>
          </span>
        </div>

        {/* 3 cartes */}
        <div className="grid md:grid-cols-3 gap-5 max-w-5xl mx-auto">

          {/* Carte 1 — Gratuit */}
          <div className="reveal rounded-3xl p-6 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <p className="text-sm font-bold mb-1" style={{ color: '#6B7280' }}>Gratuit</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-white">0 €</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>pour toujours</span>
            </div>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Pour découvrir MyFlyPath</p>
            <ul className="space-y-2.5 mb-6 flex-1">
              {["Parcours PPL limité", "20 vols dans le LogBook", "Fiches de révision", "Badges & défis", "Carte des routes"].map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(107,114,128,0.2)', border: '1px solid rgba(107,114,128,0.4)' }}>
                    <Check className="w-2.5 h-2.5" style={{ color: '#6B7280' }} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>
            <a href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
              className="block w-full text-center font-bold py-3 rounded-2xl text-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: 'rgba(255,255,255,0.08)', color: '#fff', border: '1px solid rgba(255,255,255,0.12)' }}>
              Démarre l'aventure
            </a>
          </div>

          {/* Carte 2 — Specific (double onglet) */}
          <div className="reveal rounded-3xl p-6 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.05)', border: `1px solid ${active.color}40` }}>

            {/* Onglets LogBook / Training */}
            <div className="flex rounded-xl p-1 mb-4 gap-1"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {Object.entries(specificPlans).map(([key, plan]) => (
                <button
                  key={key}
                  onClick={() => setSpecificTab(key)}
                  className="flex-1 py-2 rounded-lg text-xs font-bold transition-all duration-200"
                  style={specificTab === key
                    ? { background: plan.color, color: key === 'training' ? '#fff' : '#000' }
                    : { color: 'rgba(255,255,255,0.4)' }
                  }
                >
                  {plan.name}
                </button>
              ))}
            </div>

            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-white">4,99 €</span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>/ mois</span>
            </div>
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>
              {specificTab === 'logbook' ? 'Pour les pilotes qui volent' : 'Pour les élèves pilotes'}
            </p>

            <ul className="space-y-2.5 mb-6 flex-1">
              {active.features.map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: active.color + '25', border: `1px solid ${active.color}50` }}>
                    <Check className="w-2.5 h-2.5" style={{ color: active.color }} strokeWidth={3} />
                  </div>
                  {f}
                </li>
              ))}
            </ul>

            <a href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
              className="block w-full text-center font-bold py-3 rounded-2xl text-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: active.color, color: specificTab === 'training' ? '#fff' : '#000' }}>
              Démarre l'aventure
            </a>
          </div>

          {/* Carte 3 — Pro */}
          <div className="reveal relative rounded-3xl p-6 flex flex-col"
            style={{ background: 'rgba(255,149,0,0.08)', border: '2px solid rgba(255,149,0,0.4)' }}>
            <div className="absolute top-0 right-5 px-3 py-1 rounded-b-xl text-xs font-bold"
              style={{ background: '#FF9500', color: '#000' }}>
              ⭐ Recommandé
            </div>

            <p className="text-sm font-bold mb-1 mt-2" style={{ color: '#FF9500' }}>Pro</p>
            <div className="flex items-baseline gap-1 mb-1">
              <span className="text-3xl font-black text-white">
                {isAnnual ? '89,99 €' : '8,99 €'}
              </span>
              <span className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                {isAnnual ? '/ an' : '/ mois'}
              </span>
            </div>
            {isAnnual && (
              <p className="text-xs font-bold mb-1" style={{ color: '#FF9500' }}>
                Simulateur IFR inclus
              </p>
            )}
            {!isAnnual && (
              <p className="text-xs mb-1" style={{ color: 'rgba(255,255,255,0.35)' }}>
                Sans simulateur IFR
              </p>
            )}
            <p className="text-xs mb-5" style={{ color: 'rgba(255,255,255,0.4)' }}>Tout MyFlyPath, sans limite</p>

            <ul className="space-y-2.5 mb-6 flex-1">
              {(isAnnual ? [
                "Parcours PPL & IFR complets",
                "LogBook illimité + Export EASA",
                "Simulateur IFR inclus",
                "Fiches d'exercices IFR",
                "Quiz & examens blancs illimités",
                "Partage carrousel social",
                "Énergie & freezes illimités",
                "Support prioritaire",
              ] : [
                "Parcours PPL & IFR complets",
                "LogBook illimité + Export EASA",
                "Fiches d'exercices IFR",
                "Quiz & examens blancs illimités",
                "Partage carrousel social",
                "Énergie & freezes illimités",
                "Support prioritaire",
              ]).map(f => (
                <li key={f} className="flex items-start gap-2.5 text-sm text-white">
                  <div className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                    style={{ background: 'rgba(255,149,0,0.2)', border: '1px solid rgba(255,149,0,0.4)' }}>
                    <Check className="w-2.5 h-2.5" style={{ color: '#FF9500' }} strokeWidth={3} />
                  </div>
                  <span style={{ color: f.startsWith('🎛️') ? '#FF9500' : 'inherit', fontWeight: f.startsWith('🎛️') ? '600' : 'normal' }}>
                    {f}
                  </span>
                </li>
              ))}
            </ul>

            <a href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
              className="block w-full text-center font-bold py-3 rounded-2xl text-sm transition-transform duration-200 hover:scale-[1.02]"
              style={{ background: '#FF9500', color: '#000' }}>
              Démarre l'aventure
            </a>
          </div>

        </div>
      </div>
    </section>
  );
}
