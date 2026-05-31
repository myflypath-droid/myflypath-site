import React, { useEffect, useRef } from "react";

const stats = [
  { value: "PPL", label: "Formation complète", color: '#FF9500' },
  { value: "IFR", label: "Vol aux instruments", color: '#4A7FE0' },
  { value: "Simu", label: "Simulateur IFR", color: '#4CAF50' },
  { value: "100 Badges", label: "À débloquer", color: '#FFD700' },
];

export default function TrustBar() {
  const ref = useRef(null);

  useEffect(() => {
    const items = ref.current?.querySelectorAll(".reveal");
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
      { threshold: 0.1 }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <div ref={ref} style={{ background: 'rgba(255,255,255,0.04)', borderTop: '1px solid rgba(255,255,255,0.07)', borderBottom: '1px solid rgba(255,255,255,0.07)' }}>
      <style>{`
        .reveal {
          opacity: 0;
          transform: translateY(12px);
          transition: opacity 0.5s ease, transform 0.5s ease;
          will-change: opacity, transform;
        }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 70ms; }
        .reveal-d2 { transition-delay: 140ms; }
        .reveal-d3 { transition-delay: 210ms; }
        @media (prefers-reduced-motion: reduce) {
          .reveal { opacity: 1; transform: none; transition: none; }
        }
      `}</style>
      <div className="max-w-7xl mx-auto px-5 py-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {stats.map((s, i) => (
            <div key={s.label} className={`reveal ${i > 0 ? `reveal-d${i}` : ''} text-center`}>
              <div className="text-3xl md:text-4xl font-black tracking-tight" style={{ color: s.color }}>
                {s.value}
              </div>
              <div className="mt-1.5 text-xs md:text-sm font-medium uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.45)' }}>
                {s.label}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}