import React, { useState, useRef, useEffect } from "react";

// ── MailerLite config ─────────────────────────────────────────────────────────
const MAILERLITE_API_KEY  = import.meta.env.VITE_MAILERLITE_API_KEY;
const MAILERLITE_GROUP_ID = import.meta.env.VITE_MAILERLITE_GROUP_ID;

const NL_STATUS = { IDLE: "idle", LOADING: "loading", SUCCESS: "success", ERROR: "error" };

// ─────────────────────────────────────────────────────────────────────────────

export default function ContactNewsletterSection() {
  const sectionRef = useRef(null);

  useEffect(() => {
    const items = sectionRef.current?.querySelectorAll(".reveal");
    if (!items) return;
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) { entry.target.classList.add("revealed"); observer.unobserve(entry.target); }
        });
      },
      { threshold: 0.08, rootMargin: "0px 0px -30px 0px" }
    );
    items.forEach((item) => observer.observe(item));
    return () => observer.disconnect();
  }, []);

  return (
    <section id="contact" className="py-24 md:py-32 relative" ref={sectionRef}>
      <style>{`
        .reveal { opacity:0; transition:opacity 0.4s ease; will-change:opacity; }
        .reveal.revealed { opacity:1; }
        .reveal-d1 { transition-delay:100ms; }
        .cn-input {
          width:100%; background:rgba(255,255,255,0.05); border:1px solid rgba(255,255,255,0.1);
          border-radius:12px; padding:12px 16px; color:#fff; font-size:14px; outline:none;
          transition:border-color 0.2s;
        }
        .cn-input::placeholder { color:rgba(255,255,255,0.28); }
        .cn-input:focus { border-color:rgba(255,149,0,0.5); }
        @media (prefers-reduced-motion:reduce){ .reveal{opacity:1;transition:none;} }
      `}</style>

      {/* Halo fond */}
      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute left-1/2 -translate-x-1/2 bottom-0 w-[700px] h-[400px] rounded-full blur-[120px] opacity-10"
          style={{ background: '#FF9500' }} />
      </div>

      <div className="max-w-6xl mx-auto px-5">

        {/* Titre section centré */}
        <div className="reveal text-center mb-14">
          <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: '#FF9500' }}>Contact & Newsletter</p>
          <h2 className="text-4xl md:text-5xl font-black tracking-tight text-white leading-tight">
            Restons en contact.
          </h2>
        </div>

        {/* Grid 2 colonnes */}
        <div className="grid lg:grid-cols-2 gap-6">

          {/* ── CONTACT ── */}
          <div className="reveal reveal-d1 rounded-3xl p-8"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,149,0,0.15)' }}>✉️</span>
              <div>
                <h3 className="font-black text-xl text-white">Une question ?</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>On te répond.</p>
              </div>
            </div>
            <ContactForm />
          </div>

          {/* ── NEWSLETTER ── */}
          <div className="reveal reveal-d1 rounded-3xl p-8 flex flex-col"
            style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
            <div className="flex items-center gap-3 mb-6">
              <span className="w-10 h-10 rounded-2xl flex items-center justify-center text-xl"
                style={{ background: 'rgba(255,149,0,0.15)' }}>🛩️</span>
              <div>
                <h3 className="font-black text-xl text-white">Reste dans le cockpit.</h3>
                <p className="text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>Actu, tips, mises à jour.</p>
              </div>
            </div>

            <p className="text-base mb-6 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Conseils de formation, mises à jour de l'app, astuces logbook et actualités du monde de l'aviation. Pas de spam — jamais.
            </p>

            {/* Features newsletter */}
            <div className="space-y-3 mb-8">
              {[
                { icon: "📚", text: "Tips de formation PPL & IFR" },
                { icon: "🆕", text: "Nouvelles fonctionnalités en avant-première" },
                { icon: "🌍", text: "Actualités aviation francophone" },
              ].map((item) => (
                <div key={item.text} className="flex items-center gap-3">
                  <span className="text-base">{item.icon}</span>
                  <span className="text-sm" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.text}</span>
                </div>
              ))}
            </div>

            <div className="mt-auto">
              <NewsletterForm />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}

// ── Formulaire Contact ────────────────────────────────────────────────────────
function ContactForm() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.target);
    try {
      const res = await fetch("https://formspree.io/f/xrerdkoj", {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("success"); e.target.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center h-full py-10 text-center">
        <div className="text-5xl mb-4">✈️</div>
        <p className="text-lg font-black text-white mb-2">Message envoyé !</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.45)' }}>On t'atterrit une réponse très vite. 📬</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Prénom</label>
          <input type="text" name="prenom" required placeholder="Aymeric" className="cn-input" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Email</label>
          <input type="email" name="email" required placeholder="aymeric@example.com" className="cn-input" />
        </div>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Sujet</label>
        <select name="sujet" required className="cn-input" style={{ cursor: 'pointer' }}>
          <option value="" disabled defaultValue style={{ background: '#13141f' }}>Choisir un sujet</option>
          {["Support technique","Partenariat","Feedback","Presse / Média","Autre"].map((s) => (
            <option key={s} value={s} style={{ background: '#13141f' }}>{s}</option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Message</label>
        <textarea name="message" required rows={4} placeholder="Ton message..." className="cn-input" style={{ resize: 'none' }} />
      </div>
      {status === "error" && (
        <p className="text-xs text-center" style={{ color: '#FF4444' }}>
          Erreur. Écris-nous à contact@myflypath.fr
        </p>
      )}
      <button type="submit" disabled={status === "sending"}
        className="w-full font-bold py-3.5 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: status === "sending" ? 'rgba(255,149,0,0.5)' : '#FF9500', color: '#000', cursor: status === "sending" ? 'not-allowed' : 'pointer' }}>
        {status === "sending" ? "Envoi…" : "Envoyer le message"}
      </button>
    </form>
  );
}

// ── Formulaire Newsletter ─────────────────────────────────────────────────────
function NewsletterForm() {
  const [email, setEmail]     = useState("");
  const [name,  setName]      = useState("");
  const [status, setStatus]   = useState(NL_STATUS.IDLE);
  const [errorMsg, setErrorMsg] = useState("");

  const isValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!isValid(email)) { setStatus(NL_STATUS.ERROR); setErrorMsg("Adresse e-mail invalide."); return; }
    setStatus(NL_STATUS.LOADING); setErrorMsg("");
    try {
      const res = await fetch("https://connect.mailerlite.com/api/subscribers", {
        method: "POST",
        headers: { "Content-Type": "application/json", Authorization: `Bearer ${MAILERLITE_API_KEY}` },
        body: JSON.stringify({
          email, fields: { name: name.trim() || undefined },
          groups: MAILERLITE_GROUP_ID ? [MAILERLITE_GROUP_ID] : [],
          status: "active", resubscribe: true, type: "unconfirmed",
        }),
      });
      if (!res.ok) { const err = await res.json().catch(() => ({})); throw new Error(err?.message || `Erreur ${res.status}`); }
      setStatus(NL_STATUS.SUCCESS); setEmail(""); setName("");
    } catch (err) {
      setStatus(NL_STATUS.ERROR);
      setErrorMsg(err.message === "Failed to fetch" ? "Impossible de joindre le serveur." : err.message || "Erreur inattendue.");
    }
  };

  if (status === NL_STATUS.SUCCESS) {
    return (
      <div className="flex flex-col items-center gap-3 rounded-2xl p-6 text-center"
        style={{ background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.25)' }}>
        <span className="w-10 h-10 rounded-full flex items-center justify-center text-black font-black text-lg"
          style={{ background: '#FF9500' }}>✓</span>
        <p className="font-bold text-white">Bienvenue à bord ! 🛩️</p>
        <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>Tu es inscrit(e) à la newsletter MyFlyPath.</p>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="space-y-3">
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Prénom</label>
          <input type="text" placeholder="Aymeric" value={name} onChange={(e) => setName(e.target.value)}
            disabled={status === NL_STATUS.LOADING} className="cn-input" autoComplete="given-name" />
        </div>
        <div>
          <label className="block text-xs font-semibold mb-1.5 uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>Email *</label>
          <input type="email" required placeholder="ton@email.com" value={email}
            onChange={(e) => { setEmail(e.target.value); if (status === NL_STATUS.ERROR) setStatus(NL_STATUS.IDLE); }}
            disabled={status === NL_STATUS.LOADING} className="cn-input"
            style={{ borderColor: status === NL_STATUS.ERROR ? 'rgba(255,68,68,0.6)' : undefined }}
            autoComplete="email" />
        </div>
      </div>
      {status === NL_STATUS.ERROR && (
        <p className="text-xs" style={{ color: '#FF7070' }}>⚠️ {errorMsg}</p>
      )}
      <button type="submit" disabled={status === NL_STATUS.LOADING || !email}
        className="w-full font-bold py-3.5 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: status === NL_STATUS.LOADING ? 'rgba(255,149,0,0.5)' : '#FF9500', color: '#000',
          cursor: (status === NL_STATUS.LOADING || !email) ? 'not-allowed' : 'pointer',
          opacity: !email ? 0.6 : 1 }}>
        {status === NL_STATUS.LOADING ? "Inscription…" : "M'abonner à la newsletter"}
      </button>
      <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
        Désabonnement possible à tout moment.{" "}
        <a href="/confidentialite" className="underline hover:text-white transition-colors">Confidentialité</a>.
      </p>
    </form>
  );
}