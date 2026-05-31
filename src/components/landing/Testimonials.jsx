import React, { useEffect, useRef } from "react";
import { Star } from "lucide-react";

const reviews = [
  {
    name: "Thomas L.",
    role: "Élève PPL · LFLY",
    stars: 5,
    text: "J'ai réussi mon QCM théorique du premier coup. Les micro-sessions sont addictives, j'étudie même dans le métro. Le LogBook est top.",
    color: "#4A7FE0",
  },
  {
    name: "Claire D.",
    role: "Pilote IR(A)",
    stars: 5,
    text: "Le LogBook avec l'export EASA me fait gagner un temps fou. Plus jamais de papier. Et les fiches IFR sont vraiment bien construites.",
    color: "#FF9500",
  },
  {
    name: "Maxime R.",
    role: "FI(A) · Instructeur",
    stars: 5,
    text: "Je recommande MyFlyPath à tous mes élèves. Le parcours PPL est rigoureux, la progression visuelle les motive vraiment.",
    color: "#4CAF50",
  },
  {
    name: "Sophie M.",
    role: "Élève PPL",
    stars: 5,
    text: "Enfin une app en français, par des pilotes, pour des pilotes. Le système de badges me donne envie de revenir chaque jour. 🔥",
    color: "#9B59B6",
  },
];

export default function Testimonials() {
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
    <section id="testimonials" className="py-24 md:py-32 relative overflow-hidden" ref={sectionRef}>
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
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/2 -translate-x-1/2 top-0 w-[800px] h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: '#4A7FE0' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-2xl mb-16">
          <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF9500' }}>
            Témoignages
          </p>
          <h2 className="reveal reveal-d1 text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Des pilotes <span className="gradient-text-orange">qui volent plus haut.</span>
          </h2>
        </div>

        <div className="grid md:grid-cols-2 gap-5">
          {reviews.map((r, i) => (
            <figure
              key={r.name}
              className={`reveal reveal-d${i + 1} rounded-3xl p-8 hover:scale-[1.01] transition-transform duration-300`}
              style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}
            >
              <div className="flex gap-1 mb-5">
                {[...Array(r.stars)].map((_, j) => (
                  <Star key={j} className="w-4 h-4" style={{ fill: '#FF9500', color: '#FF9500' }} />
                ))}
              </div>
              <blockquote className="text-lg font-medium text-white leading-relaxed mb-6">
                « {r.text} »
              </blockquote>
              <figcaption className="flex items-center gap-3">
                <div
                  className="w-10 h-10 rounded-full flex items-center justify-center font-black text-sm"
                  style={{ background: r.color + '33', border: `2px solid ${r.color}55`, color: r.color }}
                >
                  {r.name[0]}
                </div>
                <div>
                  <div className="font-bold text-white text-sm">{r.name}</div>
                  <div className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>{r.role}</div>
                </div>
              </figcaption>
            </figure>
          ))}
        </div>
      </div>
    </section>
  );
}