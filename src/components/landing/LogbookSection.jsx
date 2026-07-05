import React, { useState, useEffect, useRef } from "react";

const SCREEN_STATS = "/images/screen/STAT LOG.webp";
const SCREEN_VOLS = "/images/screen/LOGBOOK.webp";
const SCREEN_SHARE = "/images/screen/SHARE.webp";
const SCREEN_CARTE = "/images/screen/MAP.webp";
const SCREEN_AGENDA = "/images/screen/CALENDIER.webp";
const MASCOT_DREAMER = "/images/mascotte/laid.webp";

const tabs = [
  { label: "Stats", screen: SCREEN_STATS },
  { label: "Vols", screen: SCREEN_VOLS },
  { label: "Partager", screen: SCREEN_SHARE },
  { label: "Carte", screen: SCREEN_CARTE },
  { label: "Agenda", screen: SCREEN_AGENDA },
];

const features = [
  { icon: "📊", title: "Stats détaillées", desc: "PIC, nuit, IFR, atterrissages... Tout en un coup d'œil." },
  { icon: "✈️", title: "Vols organisés", desc: "LFOP → LFRG, durées bloc, vol favori. Retrouves tes vols facilement." },
  { icon: "🗺️", title: "Carte des routes", desc: "Visualise ta navigation sur une carte satellite." },
  { icon: "📅", title: "Agenda", desc: "Calendrier de tes vols, retrouve n'importe quelle date instantanément." },
  { icon: "📤", title: "Partage carrousel", desc: "Génère 3 visuels Instagram/LinkedIn d'un vol partageables en un clic." },
  { icon: "📄", title: "Export PDF EASA", desc: "LogBook officiel conforme FCL.050, prêt pour tes examens et ton instructeur." },
];

export default function LogbookSection() {
  const [active, setActive] = useState(0);
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
    <section id="logbook" className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
          will-change: opacity, transform;
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 80ms; }
        .reveal-d2 { transition-delay: 160ms; }
        .reveal-d3 { transition-delay: 240ms; }
        .reveal-d4 { transition-delay: 320ms; }
        .reveal-d5 { transition-delay: 400ms; }
        .reveal-d6 { transition-delay: 480ms; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute right-0 top-0 w-[700px] h-[700px] rounded-full blur-[140px] opacity-15"
          style={{ background: '#FF9500' }} />
        <div className="absolute left-1/3 bottom-0 w-[500px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: '#4CAF50' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF9500' }}>
            Mon LogBook
          </p>
          <h2 className="reveal reveal-d1 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white text-balance leading-tight">
            Ton carnet de vol,
            <br />
            <span className="gradient-text-orange">enfin intelligent.</span>
          </h2>
          <p className="reveal reveal-d2 mt-5 text-lg leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
            Fini le papier. Enregistre chaque vol instantanément, consulte tes stats en temps réel et exporte un LogBook EASA conforme FCL.050.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-14 items-start">
          {/* Left: phone */}
          <div className="reveal reveal-d2 flex flex-col items-center gap-5">
            <div className="flex items-center gap-1.5 rounded-2xl p-1.5 flex-wrap justify-center"
              style={{ background: 'rgba(255,255,255,0.06)' }}>
              {tabs.map((t, i) => (
                <button
                  key={t.label}
                  onClick={() => setActive(i)}
                  className="px-3 py-2 rounded-xl text-sm font-semibold transition-all duration-200"
                  style={active === i
                    ? { background: '#FF9500', color: '#000' }
                    : { color: 'rgba(255,255,255,0.45)' }
                  }
                >
                  {t.label}
                </button>
              ))}
            </div>
            <div className="relative">
              <div className="absolute -inset-10 rounded-full blur-[60px] opacity-20 pointer-events-none"
                style={{ background: '#FF9500' }} />
              <div className="iphone-frame animate-float-slow" style={{ width: 280 }}>
                <img loading="lazy" src={tabs[active].screen} alt={tabs[active].label} className="w-full block" />
              </div>
              <img loading="lazy"
                src={MASCOT_DREAMER}
                alt="Checklou"
                className="absolute -left-14 -bottom-4 w-28 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(255,149,0,0.35))' }}
              />
            </div>
          </div>

          {/* Right: feature cards */}
          <div className="grid sm:grid-cols-2 gap-4 content-start pt-20">
            {features.map((f, i) => (
              <div
                key={f.title}
                className={`reveal reveal-d${i + 1} rounded-2xl p-5 hover:scale-[1.02] transition-transform duration-200`}
                style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
              >
                <div className="text-2xl mb-3">{f.icon}</div>
                <div className="font-bold text-white text-sm mb-1.5">{f.title}</div>
                <div className="text-xs leading-relaxed" style={{ color: 'rgba(255,255,255,0.5)' }}>{f.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}