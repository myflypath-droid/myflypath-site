import React, { useEffect, useRef } from "react";

const MASCOT_NEUTRAL = "/images/mascotte/Standard.png";

export default function DownloadCTA() {
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
    <section className="py-28 md:py-36 relative overflow-hidden" ref={sectionRef}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(20px);
          transition: opacity 0.55s ease, transform 0.55s ease;
          will-change: opacity, transform;
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 100ms; }
        .reveal-d2 { transition-delay: 200ms; }
        .reveal-d3 { transition-delay: 300ms; }
        .reveal-d4 { transition-delay: 500ms; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute inset-0" style={{ background: 'linear-gradient(135deg, rgba(255,149,0,0.12) 0%, rgba(74,127,224,0.08) 50%, rgba(76,175,80,0.05) 100%)' }} />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[900px] h-[500px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(ellipse, #FF9500 0%, transparent 60%)' }} />
      </div>

      <div className="max-w-4xl mx-auto px-5 text-center relative">
        <img
          src={MASCOT_NEUTRAL}
          alt="Checklou"
          className="reveal w-48 md:w-64 mx-auto mb-8 drop-shadow-2xl animate-float"
          style={{ filter: 'drop-shadow(0 12px 40px rgba(255,149,0,0.4))' }}
        />
        <h2 className="reveal reveal-d1 text-5xl md:text-6xl lg:text-7xl font-black tracking-tight text-white leading-tight text-balance">
          Prêt à <span className="gradient-text-orange">décoller</span> ?
        </h2>
        <p className="reveal reveal-d2 mt-6 text-xl max-w-lg mx-auto" style={{ color: 'rgba(255,255,255,0.55)' }}>
          Télécharge MyFlyPath et amuse toi tout en apprenant.
        </p>
        <div className="reveal reveal-d3 mt-10 flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
            className="group inline-flex items-center gap-3 rounded-2xl px-7 py-4 font-bold text-lg transition-transform duration-300 hover:scale-[1.05] active:scale-[0.97] shadow-2xl"
            style={{ background: '#FF9500', color: '#000', boxShadow: '0 8px 40px rgba(255,149,0,0.4)' }}
          >
            <svg viewBox="0 0 24 24" className="w-8 h-8 flex-shrink-0" fill="currentColor">
              <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
            </svg>
            <div className="flex flex-col items-start leading-tight">
              <span className="text-xl font-black tracking-tight">App Store</span>
            </div>
          </a>
        </div>
        <p className="reveal reveal-d4 mt-5 text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>
          Gratuit · Compatible iOS · iOS 17+ 
        </p>
      </div>
    </section>
  );
}