import React, { useEffect, useRef } from "react";

const SCREEN_PROFILE = "/images/screen/PROFILE.webp";
const MASCOT_DETECTIVE = "/images/mascotte/detective.webp";

const profileFeatures = [
  { emoji: "⚡", label: "Énergie", desc: "Progresses chaque jour, se recharge tous les jours à minuit.", color: "#FF9500" },
  { emoji: "🔥", label: "Série", desc: "Maintiens ta série de jours consécutifs d'apprentissage.", color: "#FF4500" },
  { emoji: "💎", label: "Gemmes", desc: "Monnaie in-app pour débloquer des avantages.", color: "#4A7FE0" },
  { emoji: "⭐", label: "Niveau XP", desc: "Monte en niveau au fil de tes progrès.", color: "#FFD700" },

];

export default function ProfileSection() {
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
    <section className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
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
        <div className="absolute right-0 bottom-0 w-[600px] h-[600px] rounded-full blur-[120px] opacity-12"
          style={{ background: '#FFD700' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left: iPhone */}
          <div className="reveal flex justify-center relative order-2 lg:order-1">
            <div className="absolute -inset-10 rounded-full blur-[70px] opacity-15 pointer-events-none"
              style={{ background: '#FFD700' }} />
            <div className="relative">
              <div className="iphone-frame animate-float-slow" style={{ width: 280 }}>
                <img loading="lazy" src={SCREEN_PROFILE} alt="Profil" className="w-full block" />
              </div>
              <img loading="lazy"
                src={MASCOT_DETECTIVE}
                alt="Checklou detective"
                className="absolute -left-14 bottom-0 w-28 drop-shadow-2xl"
                style={{ filter: 'drop-shadow(0 8px 24px rgba(255,215,0,0.35))' }}
              />
            </div>
          </div>

          {/* Right: copy */}
          <div className="order-1 lg:order-2">
            <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FFD700' }}>
              Profil & Progression
            </p>
            <h2 className="reveal reveal-d1 text-4xl md:text-5xl font-black tracking-tight text-white text-balance leading-tight mb-5">
              Un système de jeu
              <br />
              <span style={{ color: '#FFD700' }}>pour voler plus haut.</span>
            </h2>
            <p className="reveal reveal-d2 text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              XP, niveaux, séries, gemmes, défis quotidiens — MyFlyPath transforme l'apprentissage en aventure. Tu reviens chaque jour.
            </p>

            <div className="grid grid-cols-2 gap-4">
              {profileFeatures.map((f, i) => (
                <div
                  key={f.label}
                  className={`reveal reveal-d${i + 1} flex items-start gap-3 rounded-2xl p-4`}
                  style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.07)' }}
                >
                  <span className="text-2xl mt-0.5">{f.emoji}</span>
                  <div>
                    <div className="font-bold text-sm" style={{ color: f.color }}>{f.label}</div>
                    <div className="text-xs mt-0.5 leading-snug" style={{ color: 'rgba(255,255,255,0.45)' }}>{f.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}