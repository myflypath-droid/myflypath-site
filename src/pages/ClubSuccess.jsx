import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function ClubSuccess() {
  const { slug } = useParams();
  const [countdown, setCountdown] = useState(10);

  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((c) => {
        if (c <= 1) { clearInterval(timer); window.location.href = "/"; }
        return c - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  return (
    <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#13141f' }}>
      <div className="max-w-md w-full text-center">
        <div className="w-20 h-20 rounded-full flex items-center justify-center text-4xl mx-auto mb-6"
          style={{ background: 'rgba(76,175,80,0.15)', border: '2px solid rgba(76,175,80,0.4)' }}>
          ✅
        </div>
        <h1 className="text-3xl font-black text-white mb-3">Paiement confirmé !</h1>
        <p className="text-lg mb-2" style={{ color: 'rgba(255,255,255,0.6)' }}>
          Bienvenue dans la communauté MyFlyPath Pro. ✈️
        </p>
        <p className="text-sm mb-8" style={{ color: 'rgba(255,255,255,0.4)' }}>
          Ton code d'activation Apple t'a été envoyé par email. Vérifie ta boîte de réception.
        </p>
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
            Redirection dans <strong className="text-white">{countdown}s</strong>
          </p>
        </div>
        <a href="/"
          className="inline-block font-bold px-8 py-3 rounded-2xl transition-all hover:scale-[1.02]"
          style={{ background: '#FF9500', color: '#000' }}>
          Retour à l'accueil
        </a>
      </div>
    </div>
  );
}
