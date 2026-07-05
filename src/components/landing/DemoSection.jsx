import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";

const STEPS = [
  {
    screen: "/images/screen/ACCUEIL.jpeg",
    label: "Ton accueil",
    desc: "Reprends là où tu t'es arrêté, chaque jour.",
    tap: { x: "50%", y: "82%" },
  },
  {
    screen: "/images/screen/PARCOURT PPL.jpeg",
    label: "Ton parcours PPL",
    desc: "Une progression gamifiée, module par module.",
    tap: { x: "50%", y: "40%" },
  },
  {
    screen: "/images/screen/PPL.jpeg",
    label: "Micro-leçons",
    desc: "Des notions courtes, retenues durablement.",
    tap: { x: "50%", y: "70%" },
  },
  {
    screen: "/images/screen/LOGBOOK.jpeg",
    label: "Ton LogBook",
    desc: "Chaque vol enregistré, tes stats en direct.",
    tap: { x: "50%", y: "55%" },
  },
];

const AUTO_MS = 3000;

export default function DemoSection() {
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const timerRef = useRef(null);

  const go = useCallback((i) => setActive(((i % STEPS.length) + STEPS.length) % STEPS.length), []);

  useEffect(() => {
    if (paused) return;
    timerRef.current = setTimeout(() => setActive((a) => (a + 1) % STEPS.length), AUTO_MS);
    return () => clearTimeout(timerRef.current);
  }, [active, paused]);

  const step = STEPS[active];

  return (
    <section id="demo" className="py-24 md:py-32 relative overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute left-1/4 top-10 w-[600px] h-[600px] rounded-full blur-[150px] opacity-15"
          style={{ background: "#4A7FE0" }} />
        <div className="absolute right-1/4 bottom-0 w-[500px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: "#FF9500" }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="max-w-2xl mx-auto text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#FF9500" }}>
            Aperçu de l'app
          </p>
          <h2 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight text-white leading-tight">
            Fais le tour du{" "}
            <span className="gradient-text-orange">cockpit.</span>
          </h2>
          <p className="mt-5 text-lg leading-relaxed" style={{ color: "rgba(255,255,255,0.55)" }}>
            Un aperçu de ce qui t'attend, sans rien installer.
          </p>
        </div>

        <div className="grid lg:grid-cols-2 gap-12 lg:gap-20 items-center">
          {/* Phone */}
          <div className="flex justify-center order-2 lg:order-1">
            <div
              className="relative"
              onMouseEnter={() => setPaused(true)}
              onMouseLeave={() => setPaused(false)}
            >
              <div className="absolute -inset-12 rounded-full blur-[70px] opacity-20 pointer-events-none"
                style={{ background: "#FF9500" }} />
              <div className="iphone-frame animate-float-slow relative" style={{ width: 290 }}>
                <AnimatePresence mode="wait">
                  <motion.img
                    key={active}
                    src={step.screen}
                    alt={step.label}
                    className="w-full block"
                    initial={{ opacity: 0, scale: 1.03 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.98 }}
                    transition={{ duration: 0.45 }}
                    draggable={false}
                  />
                </AnimatePresence>

                {/* Indicateur de tap */}
                <AnimatePresence>
                  <motion.span
                    key={"tap" + active}
                    className="absolute pointer-events-none"
                    style={{ left: step.tap.x, top: step.tap.y, translateX: "-50%", translateY: "-50%" }}
                    initial={{ opacity: 0, scale: 0.4 }}
                    animate={{ opacity: [0, 1, 1, 0], scale: [0.4, 1, 1, 1.6] }}
                    transition={{ duration: 1.1, times: [0, 0.2, 0.6, 1], delay: 0.35 }}
                  >
                    <span className="block w-11 h-11 rounded-full"
                      style={{ border: "2px solid rgba(255,255,255,0.9)", boxShadow: "0 0 20px rgba(255,255,255,0.5)" }} />
                  </motion.span>
                </AnimatePresence>
              </div>
            </div>
          </div>

          {/* Steps */}
          <div className="order-1 lg:order-2">
            <div className="space-y-3">
              {STEPS.map((s, i) => {
                const isActive = i === active;
                return (
                  <button
                    key={s.label}
                    onClick={() => { go(i); setPaused(true); }}
                    className="w-full text-left rounded-2xl p-4 flex items-center gap-4 transition-all duration-300"
                    style={{
                      background: isActive ? "rgba(255,149,0,0.10)" : "rgba(255,255,255,0.04)",
                      border: `1px solid ${isActive ? "rgba(255,149,0,0.35)" : "rgba(255,255,255,0.07)"}`,
                    }}
                  >
                    <span
                      className="w-9 h-9 rounded-xl flex items-center justify-center font-black flex-shrink-0 transition-colors"
                      style={{
                        background: isActive ? "#FF9500" : "rgba(255,255,255,0.08)",
                        color: isActive ? "#000" : "rgba(255,255,255,0.5)",
                      }}
                    >
                      {i + 1}
                    </span>
                    <div className="flex-1">
                      <div className="font-bold text-white">{s.label}</div>
                      <div className="text-sm" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</div>
                    </div>
                    {/* barre de progression sur l'étape active */}
                    {isActive && !paused && (
                      <motion.span
                        key={"bar" + active}
                        className="h-1.5 w-10 rounded-full overflow-hidden flex-shrink-0"
                        style={{ background: "rgba(255,255,255,0.15)" }}
                      >
                        <motion.span
                          className="block h-full rounded-full"
                          style={{ background: "#FF9500" }}
                          initial={{ width: "0%" }}
                          animate={{ width: "100%" }}
                          transition={{ duration: AUTO_MS / 1000, ease: "linear" }}
                        />
                      </motion.span>
                    )}
                  </button>
                );
              })}
            </div>

            <a
              href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
              className="mt-8 inline-flex items-center gap-2.5 rounded-2xl px-6 py-4 font-bold transition-transform hover:scale-[1.03] active:scale-[0.98]"
              style={{ background: "#FF9500", color: "#000" }}
            >
              <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
              </svg>
              Télécharger l'app
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
