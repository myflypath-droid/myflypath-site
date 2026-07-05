import React, { useEffect, useMemo, useState, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import confetti from "canvas-confetti";
import {
  Plane, CheckCircle2, XCircle, ChevronRight, RotateCcw,
  Trophy, Target, BookOpen, Shuffle, ArrowLeft, Loader2,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const APP_STORE = "https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB";
const QUESTIONS_PER_QUIZ = 10;

const MAILERLITE_API_KEY = import.meta.env.VITE_MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = import.meta.env.VITE_MAILERLITE_GROUP_ID;
const EMAIL_STORAGE_KEY = "mfp_quiz_email";
const isValidEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

// Icône / couleur par thème (clé = nom exact dans le JSON)
const THEME_META = {
  "Aéronef": { color: "#FF9500", emoji: "✈️" },
  "Communication": { color: "#4A7FE0", emoji: "📻" },
  "Réglementation": { color: "#E0574A", emoji: "⚖️" },
  "Facteurs humains": { color: "#B07FE0", emoji: "🧠" },
  "Météorologie": { color: "#4AC0E0", emoji: "🌦️" },
  "Navigation": { color: "#4CAF50", emoji: "🧭" },
  "Procédures opé.": { color: "#E0A54A", emoji: "🛫" },
  "Principes du vol": { color: "#7FB0E0", emoji: "🪶" },
  "Performances": { color: "#E07FA5", emoji: "📊" },
};

function shuffle(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

// Mélange l'ordre des options et remappe l'index de la bonne réponse
function prepareQuestion(q) {
  const idx = q.options.map((_, i) => i);
  const order = shuffle(idx);
  const options = order.map((i) => q.options[i]);
  const correct = order.indexOf(q.correct);
  return { q: q.q, explanation: q.explanation, options, correct };
}

function scoreMessage(pct) {
  if (pct >= 90) return { title: "Prêt pour l'examen ! 🏆", sub: "Niveau impressionnant. Tu maîtrises." };
  if (pct >= 70) return { title: "Très bon niveau 👏", sub: "Solide. Encore un peu de révision et c'est parfait." };
  if (pct >= 50) return { title: "Bonne base 💪", sub: "Tu progresses. La régularité fera la différence." };
  return { title: "En cours d'apprentissage 🌱", sub: "Chaque jour un peu plus — c'est exactement pour ça que MyFlyPath existe." };
}

export default function QuizPPL() {
  const [bank, setBank] = useState(null);       // { theme: [questions] }
  const [loadError, setLoadError] = useState(false);
  const [step, setStep] = useState("gate");      // gate | intro | quiz | result
  const [theme, setTheme] = useState(null);      // null = mix
  // Porte email
  const [email, setEmail] = useState("");
  const [consent, setConsent] = useState(false);
  const [gateStatus, setGateStatus] = useState("idle"); // idle | loading | error
  const [gateError, setGateError] = useState("");
  const [deck, setDeck] = useState([]);
  const [current, setCurrent] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answered, setAnswered] = useState(false);
  const [score, setScore] = useState(0);
  const [history, setHistory] = useState([]);    // {correct: bool}

  useEffect(() => {
    document.title = "Tester mon niveau PPL — MyFlyPath";
    // Si l'email a déjà été renseigné, on passe directement au quiz
    try {
      if (localStorage.getItem(EMAIL_STORAGE_KEY)) setStep("intro");
    } catch (e) { /* localStorage indisponible */ }
    fetch("/data/ppl_questions.json")
      .then((r) => (r.ok ? r.json() : Promise.reject()))
      .then(setBank)
      .catch(() => setLoadError(true));
  }, []);

  const submitGate = async (e) => {
    e.preventDefault();
    if (!isValidEmail(email)) { setGateStatus("error"); setGateError("Adresse e-mail invalide."); return; }
    if (!consent) { setGateStatus("error"); setGateError("Merci d'accepter de recevoir nos communications pour continuer."); return; }
    setGateStatus("loading"); setGateError("");
    try {
      const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MAILERLITE_API_KEY}` },
        body: JSON.stringify({
          email,
          groups: MAILERLITE_GROUP_ID ? [MAILERLITE_GROUP_ID] : [],
          fields: { source: "Quiz PPL" },
          status: "active", resubscribe: true, type: "unconfirmed",
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.message || `Erreur ${res.status}`); }
      try { localStorage.setItem(EMAIL_STORAGE_KEY, email); } catch (e) { /* ignore */ }
      setGateStatus("idle");
      setStep("intro");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } catch (err) {
      setGateStatus("error");
      setGateError(err.message === "Failed to fetch" ? "Impossible de joindre le serveur. Réessaie." : (err.message || "Erreur inattendue."));
    }
  };

  const themes = useMemo(() => (bank ? Object.keys(bank) : []), [bank]);

  const startQuiz = useCallback((selectedTheme) => {
    if (!bank) return;
    let source;
    if (selectedTheme) {
      source = bank[selectedTheme] || [];
    } else {
      source = Object.values(bank).flat();
    }
    const picked = shuffle(source).slice(0, QUESTIONS_PER_QUIZ).map(prepareQuestion);
    setTheme(selectedTheme);
    setDeck(picked);
    setCurrent(0);
    setSelected(null);
    setAnswered(false);
    setScore(0);
    setHistory([]);
    setStep("quiz");
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, [bank]);

  const choose = (i) => {
    if (answered) return;
    setSelected(i);
    setAnswered(true);
    const isCorrect = i === deck[current].correct;
    if (isCorrect) setScore((s) => s + 1);
    setHistory((h) => [...h, { correct: isCorrect }]);
  };

  const next = () => {
    if (current + 1 >= deck.length) {
      const pct = Math.round((score / deck.length) * 100);
      if (pct >= 70) {
        setTimeout(() => confetti({ particleCount: 120, spread: 75, origin: { y: 0.6 }, colors: ["#FF9500", "#FFCC66", "#4A7FE0", "#4CAF50"] }), 250);
      }
      setStep("result");
      window.scrollTo({ top: 0, behavior: "smooth" });
    } else {
      setCurrent((c) => c + 1);
      setSelected(null);
      setAnswered(false);
    }
  };

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: "#13141f", color: "#fff" }}>
      <Navbar />
      <main className="relative pt-24 pb-24 min-h-screen">
        {/* halos décoratifs */}
        <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
          <div className="absolute top-[-5%] left-[10%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
            style={{ background: "radial-gradient(circle, #FF9500 0%, transparent 70%)" }} />
          <div className="absolute top-[30%] right-[5%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
            style={{ background: "radial-gradient(circle, #4A7FE0 0%, transparent 70%)" }} />
        </div>

        <div className="max-w-3xl mx-auto px-4 sm:px-6">
          {/* ===== ERREUR DE CHARGEMENT ===== */}
          {loadError && (
            <div className="text-center py-20">
              <p className="text-white/70">Impossible de charger les questions pour le moment. Réessaie plus tard.</p>
            </div>
          )}

          {/* ===== LOADING ===== */}
          {!bank && !loadError && (
            <div className="flex flex-col items-center justify-center py-32 text-white/50">
              <Loader2 className="w-8 h-8 animate-spin mb-3" style={{ color: "#FF9500" }} />
              Préparation du quiz…
            </div>
          )}

          {/* ===== PORTE EMAIL ===== */}
          {bank && step === "gate" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="max-w-md mx-auto">
              <div className="text-center mb-8">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-semibold uppercase tracking-widest"
                  style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)", color: "#FF9500" }}>
                  <Target className="w-3.5 h-3.5" /> Test de niveau gratuit
                </div>
                <h1 className="text-3xl sm:text-4xl font-black leading-[1.08] tracking-tight text-white">
                  Teste ton niveau <span className="gradient-text-orange">PPL</span>
                </h1>
                <p className="mt-4 text-white/60">
                  Renseigne ton e-mail pour accéder aux {QUESTIONS_PER_QUIZ} questions type examen.
                </p>
              </div>

              <form onSubmit={submitGate} className="rounded-2xl p-6 card-app">
                <label className="block text-sm font-semibold text-white/80 mb-2">Ton e-mail</label>
                <input
                  type="email" required value={email} autoComplete="email"
                  onChange={(e) => { setEmail(e.target.value); if (gateStatus === "error") setGateStatus("idle"); }}
                  placeholder="ton@email.com"
                  className="w-full rounded-xl px-4 py-3 mb-4 text-white outline-none transition-colors"
                  style={{ background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)" }}
                />

                <label className="flex items-start gap-3 mb-5 cursor-pointer select-none">
                  <input
                    type="checkbox" checked={consent}
                    onChange={(e) => { setConsent(e.target.checked); if (gateStatus === "error") setGateStatus("idle"); }}
                    className="mt-1 w-4 h-4 flex-shrink-0 accent-[#FF9500]"
                  />
                  <span className="text-sm leading-relaxed text-white/60">
                    J'accepte de recevoir les communications de MyFlyPath (conseils, offres et nouveautés).
                    Je peux me désinscrire à tout moment.
                  </span>
                </label>

                {gateStatus === "error" && (
                  <p className="text-sm mb-4" style={{ color: "#E0574A" }}>{gateError}</p>
                )}

                <button type="submit" disabled={gateStatus === "loading" || !email || !consent}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                  style={{ background: "#FF9500", color: "#000", cursor: (gateStatus === "loading" || !email || !consent) ? "not-allowed" : "pointer", opacity: (!email || !consent) ? 0.6 : 1 }}>
                  {gateStatus === "loading" ? (<><Loader2 className="w-5 h-5 animate-spin" /> Un instant…</>) : (<>Accéder au quiz <ChevronRight className="w-5 h-5" /></>)}
                </button>

                <p className="mt-4 text-xs text-center text-white/35">
                  Tes données restent confidentielles. Voir notre{" "}
                  <a href="/confidentialite" className="underline hover:text-white/60">politique de confidentialité</a>.
                </p>
              </form>
            </motion.div>
          )}

          {/* ===== INTRO ===== */}
          {bank && step === "intro" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
              <div className="text-center mb-10">
                <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-semibold uppercase tracking-widest"
                  style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)", color: "#FF9500" }}>
                  <Target className="w-3.5 h-3.5" /> Test de niveau gratuit
                </div>
                <h1 className="text-4xl sm:text-5xl font-black leading-[1.05] tracking-tight text-white">
                  Teste ton niveau <span className="gradient-text-orange">PPL</span>
                </h1>
                <p className="mt-5 text-base md:text-lg max-w-xl mx-auto" style={{ color: "rgba(255,255,255,0.65)" }}>
                  {QUESTIONS_PER_QUIZ} questions type examen théorique. Choisis un thème ou lance un mix général.
                  Correction et explication après chaque réponse.
                </p>
              </div>

              {/* Mix général */}
              <button onClick={() => startQuiz(null)}
                className="group w-full mb-6 rounded-2xl p-5 flex items-center gap-4 text-left transition-all duration-300 hover:scale-[1.02] glow-orange"
                style={{ background: "linear-gradient(135deg, #FF9500 0%, #FFB347 100%)", color: "#000" }}>
                <div className="w-12 h-12 rounded-xl bg-black/15 flex items-center justify-center flex-shrink-0">
                  <Shuffle className="w-6 h-6" />
                </div>
                <div className="flex-1">
                  <div className="font-black text-lg">Mix général</div>
                  <div className="text-sm font-medium opacity-80">Questions tirées de tous les thèmes</div>
                </div>
                <ChevronRight className="w-6 h-6 transition-transform group-hover:translate-x-1" />
              </button>

              <div className="flex items-center gap-3 my-6">
                <div className="h-px flex-1 bg-white/10" />
                <span className="text-xs uppercase tracking-widest text-white/40">ou choisis un thème</span>
                <div className="h-px flex-1 bg-white/10" />
              </div>

              {/* Thèmes */}
              <div className="grid sm:grid-cols-2 gap-3">
                {themes.map((t) => {
                  const meta = THEME_META[t] || { color: "#888", emoji: "📘" };
                  return (
                    <button key={t} onClick={() => startQuiz(t)}
                      className="group rounded-2xl p-4 flex items-center gap-3 text-left transition-all duration-300 hover:scale-[1.02] card-app hover:border-white/25">
                      <div className="w-11 h-11 rounded-xl flex items-center justify-center text-xl flex-shrink-0"
                        style={{ background: `${meta.color}20`, border: `1px solid ${meta.color}55` }}>
                        {meta.emoji}
                      </div>
                      <div className="flex-1">
                        <div className="font-bold text-white">{t}</div>
                        <div className="text-xs text-white/45">{(bank[t] || []).length} questions</div>
                      </div>
                      <ChevronRight className="w-5 h-5 text-white/30 transition-transform group-hover:translate-x-1" />
                    </button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* ===== QUIZ ===== */}
          {bank && step === "quiz" && deck.length > 0 && (
            <div>
              {/* header progression */}
              <div className="flex items-center justify-between mb-4">
                <button onClick={() => setStep("intro")} className="inline-flex items-center gap-1.5 text-sm text-white/50 hover:text-white transition-colors">
                  <ArrowLeft className="w-4 h-4" /> Quitter
                </button>
                <span className="text-sm font-semibold text-white/70">
                  Question {current + 1}<span className="text-white/40">/{deck.length}</span>
                </span>
              </div>
              <div className="h-2 w-full rounded-full bg-white/8 mb-8 overflow-hidden">
                <motion.div className="h-full rounded-full" style={{ background: "#FF9500" }}
                  initial={false} animate={{ width: `${((current + (answered ? 1 : 0)) / deck.length) * 100}%` }}
                  transition={{ duration: 0.4 }} />
              </div>

              <AnimatePresence mode="wait">
                <motion.div key={current} initial={{ opacity: 0, x: 24 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -24 }} transition={{ duration: 0.3 }}>
                  <h2 className="text-xl sm:text-2xl font-bold text-white leading-snug mb-6">
                    {deck[current].q}
                  </h2>

                  <div className="space-y-3">
                    {deck[current].options.map((opt, i) => {
                      const isCorrect = i === deck[current].correct;
                      const isChosen = i === selected;
                      let cls = "card-app hover:border-white/30";
                      let icon = null;
                      if (answered) {
                        if (isCorrect) {
                          cls = "border-2";
                          icon = <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#4CAF50" }} />;
                        } else if (isChosen) {
                          cls = "border-2";
                          icon = <XCircle className="w-5 h-5 flex-shrink-0" style={{ color: "#E0574A" }} />;
                        } else {
                          cls = "opacity-50 card-app";
                        }
                      }
                      const borderColor = answered && isCorrect ? "#4CAF50" : answered && isChosen ? "#E0574A" : undefined;
                      return (
                        <button key={i} onClick={() => choose(i)} disabled={answered}
                          className={`w-full rounded-xl p-4 flex items-center gap-3 text-left transition-all duration-200 ${cls} ${!answered ? "hover:scale-[1.01]" : ""}`}
                          style={borderColor ? { borderColor, background: `${borderColor}12` } : undefined}>
                          <span className="w-7 h-7 rounded-lg flex items-center justify-center text-sm font-bold flex-shrink-0"
                            style={{ background: "rgba(255,255,255,0.06)", color: "rgba(255,255,255,0.75)" }}>
                            {String.fromCharCode(65 + i)}
                          </span>
                          <span className="flex-1 text-white/90">{opt}</span>
                          {icon}
                        </button>
                      );
                    })}
                  </div>

                  {/* explication */}
                  <AnimatePresence>
                    {answered && (
                      <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: "auto" }} exit={{ opacity: 0, height: 0 }} className="overflow-hidden">
                        <div className="mt-5 rounded-xl p-4 flex gap-3" style={{ background: "rgba(74,127,224,0.10)", border: "1px solid rgba(74,127,224,0.25)" }}>
                          <BookOpen className="w-5 h-5 flex-shrink-0 mt-0.5" style={{ color: "#4A7FE0" }} />
                          <div>
                            <div className="text-sm font-semibold text-white mb-1">
                              {selected === deck[current].correct ? "Correct !" : "La bonne réponse est " + String.fromCharCode(65 + deck[current].correct)}
                            </div>
                            <p className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.7)" }}>
                              {deck[current].explanation}
                            </p>
                          </div>
                        </div>
                        <button onClick={next}
                          className="mt-5 w-full inline-flex items-center justify-center gap-2 rounded-xl px-6 py-4 font-bold transition-transform hover:scale-[1.02] active:scale-[0.98]"
                          style={{ background: "#FF9500", color: "#000" }}>
                          {current + 1 >= deck.length ? "Voir mon résultat" : "Question suivante"}
                          <ChevronRight className="w-5 h-5" />
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              </AnimatePresence>
            </div>
          )}

          {/* ===== RÉSULTAT ===== */}
          {bank && step === "result" && (
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }} className="text-center">
              {(() => {
                const pct = Math.round((score / deck.length) * 100);
                const msg = scoreMessage(pct);
                return (
                  <>
                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-full mb-6"
                      style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)" }}>
                      <Trophy className="w-9 h-9" style={{ color: "#FF9500" }} />
                    </div>
                    <h1 className="text-3xl sm:text-4xl font-black text-white">{msg.title}</h1>
                    <p className="mt-3 text-white/60">{msg.sub}</p>

                    <div className="my-8 flex items-center justify-center gap-8">
                      <div>
                        <div className="text-5xl font-black gradient-text-orange">{score}<span className="text-2xl text-white/40">/{deck.length}</span></div>
                        <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Score</div>
                      </div>
                      <div className="h-14 w-px bg-white/10" />
                      <div>
                        <div className="text-5xl font-black text-white">{pct}<span className="text-2xl text-white/40">%</span></div>
                        <div className="text-xs uppercase tracking-widest text-white/40 mt-1">Réussite</div>
                      </div>
                    </div>

                    {/* pastilles récap */}
                    <div className="flex flex-wrap justify-center gap-2 mb-8">
                      {history.map((h, i) => (
                        <div key={i} className="w-8 h-8 rounded-lg flex items-center justify-center text-xs font-bold"
                          style={{ background: h.correct ? "rgba(76,175,80,0.15)" : "rgba(224,87,74,0.15)", color: h.correct ? "#4CAF50" : "#E0574A", border: `1px solid ${h.correct ? "#4CAF5055" : "#E0574A55"}` }}>
                          {i + 1}
                        </div>
                      ))}
                    </div>

                    {/* CTA App Store */}
                    <div className="rounded-2xl p-6 mb-6 card-app text-left">
                      <p className="text-white font-bold text-lg mb-1">Continue ta progression sur l'app 🚀</p>
                      <p className="text-white/60 text-sm mb-4">
                        Parcours PPL & IFR gamifié, fiches de révision, examens blancs illimités et LogBook digital.
                      </p>
                      <a href={APP_STORE} className="inline-flex items-center gap-2.5 rounded-xl px-6 py-3.5 font-bold transition-transform hover:scale-[1.03]"
                        style={{ background: "#FF9500", color: "#000" }}>
                        <svg viewBox="0 0 24 24" className="w-6 h-6" fill="currentColor">
                          <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                        </svg>
                        Télécharger MyFlyPath
                      </a>
                    </div>

                    <div className="flex flex-col sm:flex-row gap-3 justify-center">
                      <button onClick={() => startQuiz(theme)}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold transition-colors card-app hover:border-white/30 text-white">
                        <RotateCcw className="w-4 h-4" /> Rejouer {theme ? "ce thème" : "un mix"}
                      </button>
                      <button onClick={() => setStep("intro")}
                        className="inline-flex items-center justify-center gap-2 rounded-xl px-6 py-3.5 font-semibold text-white/70 hover:text-white transition-colors">
                        <Plane className="w-4 h-4" /> Changer de thème
                      </button>
                    </div>
                  </>
                );
              })()}
            </motion.div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}
