import React, { useState, useEffect, useRef } from "react";

const tabs = [
  { label: "Parcours IFR", screen: "/images/screen/IFR.webp" },
  { label: "Modules", screen: "/images/screen/MODULE IFR.webp" },
  { label: "Simulateur", screen: "/images/screen/SIMU IFR.webp" },
];

const modules = [
  { icon: "📚", name: "Fondamentaux IFR & Environnement" },
  { icon: "🎛️", name: "Instruments de vol" },
  { icon: "📡", name: "Navigation radio" },
  { icon: "🛰️", name: "Navigation RNAV / GPS" },
  { icon: "🌧️", name: "Météorologie IFR" },
  { icon: "🗺️", name: "Cartes IFR & procédures" },
  { icon: "✈️", name: "Approches IFR" },
  { icon: "📻", name: "Procédures ATC / RT" },
  { icon: "🧳", name: "Gestion du vol IFR" },
  { icon: "🚨", name: "Situations anormales & urgences" },
  { icon: "🎓", name: "Le MUP" },
];

export default function IFRSection() {
  const [activeScreen, setActiveScreen] = useState(0);
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

  return (
    <section id="ifr" className="py-12 md:py-16 relative overflow-hidden" ref={sectionRef}>
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
        <div
          className="absolute right-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{ background: '#4A7FE0' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-2xl mb-10">
          <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4A7FE0' }}>
            Formation IFR
          </p>
          <h2 className="reveal text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance leading-tight">
            Vers ta qualification
            <br />
            <span className="gradient-text-blue">aux instruments.</span>
          </h2>
          <p className="reveal mt-5 text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Sois guidé pas à pas tout au long des procédures IFR. Des fiches d'exercices claires, un parcours structuré et un simulateur pour t'entraîner partout.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">

          {/* Phone — 1er sur mobile, 2ème (droite) sur desktop */}
          <div className="reveal flex flex-col items-center gap-5 order-1 lg:order-2">
            <div
              className="flex items-center gap-2 rounded-2xl p-1.5"
              style={{ background: 'rgba(255,255,255,0.06)' }}
            >
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActiveScreen(i)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={activeScreen === i
                    ? { background: '#4A7FE0', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>

            <div className="relative">
              <div
                className="absolute -inset-10 rounded-full blur-[60px] opacity-20 pointer-events-none"
                style={{ background: '#4A7FE0' }}
              />
              <div className="iphone-frame animate-float" style={{ width: 280 }}>
                <img loading="lazy"
                  src={tabs[activeScreen].screen}
                  alt={tabs[activeScreen].label}
                  className="w-full block"
                />
              </div>
            </div>
          </div>

          {/* Modules — 2ème sur mobile, 1er (gauche) sur desktop */}
          <div className="reveal order-2 lg:order-1">
            <div className="space-y-2">
              {modules.map((m) => (
                <div
                  key={m.name}
                  className="flex items-center gap-4 rounded-2xl px-5 py-4 hover:scale-[1.01] transition-transform duration-200"
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <div
                    className="w-11 h-11 rounded-xl flex items-center justify-center text-2xl flex-shrink-0"
                    style={{ background: 'rgba(255,255,255,0.06)' }}
                  >
                    {m.icon}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="font-semibold text-white text-sm">{m.name}</div>
                  </div>
                  <span className="text-white/30 text-lg">›</span>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
