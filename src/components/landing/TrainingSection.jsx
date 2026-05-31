import React, { useState, useEffect, useRef } from "react";

const SCREEN_PARCOURS = "/images/screen/PPL.jpeg";
const SCREEN_PATH = "/images/screen/PARCOURT PPL.jpeg";
const SCREEN_FICHES = "/images/screen/FICHE.jpeg";
const MASCOT_COMPASS = "/images/mascotte/focus_compass.png";
const modules = [
  { icon: "⚙️", name: "Connaissance aéronef", lessons: "" },
  { icon: "🌦️", name: "Météorologie", lessons: "" },
  { icon: "📻", name: "Communication", lessons: "" },
  { icon: "🧭", name: "Navigation", lessons: "" },
  { icon: "📊", name: "Performances & préparation", lessons: "" },
  { icon: "🧠", name: "Performance humaine", lessons: "" },
  { icon: "✈️", name: "Principe de vol", lessons: "" },
  { icon: "📋", name: "Procédures opérationnelles", lessons: "" },
  { icon: "📜", name: "Réglementation", lessons: "" },
];

export default function TrainingSection() {
  const [activeScreen, setActiveScreen] = useState(0);
  const screens = [SCREEN_PARCOURS, SCREEN_PATH, SCREEN_FICHES];
  const labels = ["Parcours PPL", "Progression", "Fiches"];
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
    <section id="training" className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
          will-change: opacity, transform;
        }
        .reveal.revealed {
          opacity: 1;
          transform: translateY(0);
        }
        .reveal-d1 { transition-delay: 80ms; }
        .reveal-d2 { transition-delay: 160ms; }
        .reveal-d3 { transition-delay: 240ms; }
        .reveal-d4 { transition-delay: 320ms; }
        .reveal-d5 { transition-delay: 400ms; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div
          className="absolute left-0 top-1/2 -translate-y-1/2 w-[600px] h-[600px] rounded-full blur-[120px] opacity-15"
          style={{ background: '#4A7FE0' }}
        />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        {/* Header */}
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#4A7FE0' }}>
            Entraînement
          </p>
          <h2 className="reveal reveal-d1 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance leading-tight">
            Tout le programme PPL
            <br />
            <span className="gradient-text-blue">en poche.</span>
          </h2>
          <p className="reveal reveal-d2 mt-5 text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            9 modules complets, près de 70 000 questions organisées en unités et chapitres. Progresse à ton rythme avec un chemin visuel et des objectifs clairs. Optes pour la formule CONTINUE ou OPTIMALE.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-center">
          {/* Left: module list */}
          <div className="reveal reveal-d2">
            <div className="space-y-2">
              {modules.map((m, i) => (
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
                    {m.lessons && (
                      <div className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        ⚡ {m.lessons} · 0%
                      </div>
                    )}
                  </div>
                  <span className="text-white/30 text-lg">›</span>
                </div>
              ))}
            </div>

          
          </div>

          {/* Right: phone + tabs */}
          <div className="reveal reveal-d3 flex flex-col items-center gap-5">
            {/* Tab switcher */}
            <div className="flex items-center gap-2 rounded-2xl p-1.5" style={{ background: 'rgba(255,255,255,0.06)' }}>
              {labels.map((l, i) => (
                <button
                  key={l}
                  onClick={() => setActiveScreen(i)}
                  className="px-4 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={activeScreen === i
                    ? { background: '#4A7FE0', color: '#fff' }
                    : { color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {l}
                </button>
              ))}
            </div>

            {/* iPhone */}
            <div className="relative">
              <div
                className="absolute -inset-10 rounded-full blur-[60px] opacity-20 pointer-events-none"
                style={{ background: '#4A7FE0' }}
              />
              <div className="iphone-frame animate-float" style={{ width: 280 }}>
                <img src={screens[activeScreen]} alt={labels[activeScreen]} className="w-full block" />
              </div>
              <img
                src={MASCOT_COMPASS}
                alt="Checklou"
                className="absolute -right-12 -bottom-8 w-28 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(74,127,224,0.4))' }}
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}