import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";

const PRICE = 89.99;

const STEPS = { LOADING: "loading", NOT_FOUND: "not_found", INPUT: "input", CHECKOUT: "checkout" };

export default function ClubPage() {
  const { slug } = useParams();
  const [step, setStep] = useState(STEPS.LOADING);
  const [clubNom, setClubNom] = useState("");
  const [email, setEmail] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Enregistrer la visite + charger le club
  useEffect(() => {
    if (!slug) return;

    fetch("/.netlify/functions/club-visit", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ slug }),
    })
      .then((r) => r.json())
      .then((data) => {
        if (data.nom) {
          setClubNom(data.nom);
          setStep(STEPS.INPUT);
        } else {
          setStep(STEPS.NOT_FOUND);
        }
      })
      .catch(() => setStep(STEPS.NOT_FOUND));
  }, [slug]);

  const handleCheckout = async (e) => {
    e.preventDefault();
    setError("");
    setIsLoading(true);

    try {
      const res = await fetch("/.netlify/functions/club-checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, email }),
      });
      const data = await res.json();

      if (data.url) {
        window.location.href = data.url;
      } else {
        setError(data.error || "Erreur lors du paiement");
        setIsLoading(false);
      }
    } catch {
      setError("Erreur réseau. Réessaie.");
      setIsLoading(false);
    }
  };

  // Loading
  if (step === STEPS.LOADING) {
    return (
      <div className="min-h-screen flex items-center justify-center" style={{ background: '#13141f' }}>
        <div className="text-white opacity-50 text-lg font-bold">Chargement…</div>
      </div>
    );
  }

  // Club introuvable
  if (step === STEPS.NOT_FOUND) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#13141f' }}>
        <div className="text-center">
          <div className="text-5xl mb-4">✈️</div>
          <h1 className="text-2xl font-black text-white mb-2">Page introuvable</h1>
          <p style={{ color: 'rgba(255,255,255,0.4)' }}>Ce lien partenaire n'existe pas ou est désactivé.</p>
          <a href="/" className="mt-6 inline-block" style={{ color: '#FF9500' }}>← Retour à l'accueil</a>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans" style={{ background: '#13141f', color: '#fff' }}>

      {/* Header */}
      <header className="px-6 py-5 border-b" style={{ borderColor: 'rgba(255,255,255,0.08)' }}>
        <div className="max-w-lg mx-auto flex items-center justify-center gap-4">
          {/* Logo MyFlyPath */}
          <div className="flex items-center gap-2">
            <span className="font-black text-lg">
              My<span style={{ color: '#FF9500' }}>Fly</span>Path
            </span>
          </div>
          {/* Séparateur × */}
          <span className="text-2xl font-black" style={{ color: 'rgba(255,255,255,0.2)' }}>×</span>
          {/* Nom du club */}
          <span className="font-black text-lg text-white">{clubNom}</span>
        </div>
      </header>

      <main className="max-w-lg mx-auto px-5 py-12">

        {/* Titre */}
        <div className="text-center mb-10">
          <div className="w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mx-auto mb-4"
            style={{ background: 'rgba(255,149,0,0.15)', border: '1px solid rgba(255,149,0,0.3)' }}>
            ✈️
          </div>
          <h1 className="text-3xl font-black text-white mb-3">
            Offre exclusive<br />
            <span style={{ color: '#FF9500' }}>{clubNom}</span>
          </h1>
          <p style={{ color: 'rgba(255,255,255,0.5)' }}>
            Accédez à MyFlyPath Pro et commencez votre formation PPL & IFR dès aujourd'hui.
          </p>
        </div>

        {/* Card offre */}
        <form onSubmit={handleCheckout} className="space-y-4">
          <div className="rounded-3xl p-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,149,0,0.2)' }}>

            <p className="text-xs font-bold uppercase tracking-widest mb-4 text-center" style={{ color: '#FF9500' }}>
              Abonnement annuel MyFlyPath Pro
            </p>

            {/* Prix */}
            <div className="text-center mb-6">
              <p className="text-5xl font-black text-white">
                {PRICE.toFixed(2)}€
                <span className="text-xl font-normal" style={{ color: 'rgba(255,255,255,0.4)' }}>/an</span>
              </p>
            </div>

            {/* Features */}
            <div className="space-y-2 mb-6">
              {[
                "✈️ Cours PPL complets (9 modules)",
                "🛫 Formation IFR (11 modules)",
                "📋 LogBook digital EASA",
                "🌍 MyUnivers — réseau social pilotes",
                "🏅 Badges & gamification",
                "🔄 Mises à jour incluses",
              ].map((f) => (
                <div key={f} className="flex items-center gap-2 text-sm" style={{ color: 'rgba(255,255,255,0.7)' }}>
                  <span>{f}</span>
                </div>
              ))}
            </div>

            {/* Email */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-widest mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                Ton adresse email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="ton@email.com"
                required
                className="w-full rounded-2xl px-4 py-3"
                style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', outline: 'none' }}
              />
              <p className="text-xs mt-2" style={{ color: 'rgba(255,255,255,0.3)' }}>
                Ton code d'activation sera envoyé à cette adresse après paiement.
              </p>
            </div>
          </div>

          {error && (
            <p className="text-sm text-center" style={{ color: '#FF6B6B' }}>⚠️ {error}</p>
          )}

          <button
            type="submit"
            disabled={!email || isLoading}
            className="w-full font-black py-4 rounded-2xl text-lg transition-all hover:scale-[1.02] active:scale-[0.98]"
            style={{
              background: (!email || isLoading) ? 'rgba(255,149,0,0.4)' : '#FF9500',
              color: '#000',
              cursor: (!email || isLoading) ? 'not-allowed' : 'pointer',
            }}
          >
            {isLoading ? "Redirection…" : `Payer ${PRICE.toFixed(2)}€ →`}
          </button>

          <p className="text-xs text-center" style={{ color: 'rgba(255,255,255,0.25)' }}>
            🔒 Paiement sécurisé par Stripe.
          </p>
        </form>
      </main>
    </div>
  );
}