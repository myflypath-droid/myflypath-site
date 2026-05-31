import React, { useState, useEffect, useRef } from "react";

const SCREEN_MYUNIVERS = "/images/screen/ACCUEIL.jpeg";

const TABS = [
  { id: "explorer", label: "Explorer", icon: "🌍" },
  { id: "fil", label: "Mon fil", icon: "📋" },
  { id: "profil", label: "Profil", icon: "👤" },
];

const EXPLORER_TABS = [
  { id: "overview", label: "Vue d'ensemble", icon: "⚡" },
  { id: "activity", label: "Activité", icon: "📊" },
  { id: "events", label: "Événements", icon: "🗓️" },
];

const events = [
  { day: "05", month: "JUIN", title: "Atterrissage Festival", location: "Deauville — 5 au 7 juin 2026" },
  { day: "16", month: "JUIN", title: "Salon du Bourget", location: "Le Bourget — 16 au 22 juin 2026" },
  { day: "10", month: "JUIL", title: "Rassemblement RSA", location: "Brienne-le-Château — 10 au 12 juil." },
  { day: "13", month: "JUIL", title: "Tour Aérien des Jeunes Pilotes", location: "France — départ 13 juillet 2026" },
];

const feedPosts = [
  { pilot: "Aymeric", time: "il y a 2h", title: "Vol local entre les cellules", desc: "Petit vol sympa entre les averses ☁️", emoji: "✈️", color: "#FF9500" },
  { pilot: "Lucas", time: "il y a 5h", title: "Premier vol solo réussi !", desc: "Une émotion incroyable, merci à mon instructeur 🎉", emoji: "🏆", color: "#4A7FE0" },
  { pilot: "Sarah", time: "hier", title: "Navigation LFPO → LFPB", desc: "Belle traversée de la TMA Paris en VFR 🗺️", emoji: "🛫", color: "#9B59B6" },
];

const profileStats = [
  { icon: "✈️", label: "VOLS", value: "648" },
  { icon: "👥", label: "AMIS", value: "12" },
  { icon: "📋", label: "POSTS", value: "7" },
];

// Aéroclub du jour (meilleur en heures enregistrées)
const TOP_CLUB = {
  nom: "Cap Aero",
  pilotes: 1,
  heures: "16h21",
};

export default function MyUniversSection() {
  const [activeTab, setActiveTab] = useState("explorer");
  const [activeExplorerTab, setActiveExplorerTab] = useState("overview");

  // Date du jour en français
  const todayLabel = new Date().toLocaleDateString("fr-FR", {
    weekday: "long", day: "numeric", month: "long",
  }).replace(/^\w/, (c) => c.toUpperCase());
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
    <section id="myunivers" className="py-24 md:py-32 relative" ref={sectionRef}>
      <style>{`
        .reveal { opacity: 0; transform: translateY(20px); transition: opacity 0.55s ease, transform 0.55s ease; }
        .reveal.revealed { opacity: 1; transform: translateY(0); }
        .reveal-d1 { transition-delay: 80ms; }
        .reveal-d2 { transition-delay: 160ms; }
        .reveal-d3 { transition-delay: 240ms; }
        .tab-btn { transition: all 0.2s ease; }
        .sub-tab-btn { transition: all 0.2s ease; }
        .tab-content { animation: fadeIn 0.25s ease; }
        @keyframes fadeIn { from { opacity: 0; transform: translateY(6px); } to { opacity: 1; transform: translateY(0); } }
        @media (prefers-reduced-motion: reduce) { .reveal { opacity: 1; transform: none; transition: none; } }
      `}</style>

      <div className="absolute inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute left-1/4 top-1/2 -translate-y-1/2 w-[700px] h-[700px] rounded-full blur-[140px] opacity-10"
          style={{ background: '#FF9500' }} />
      </div>

      <div className="max-w-7xl mx-auto px-5">
        <div className="grid lg:grid-cols-2 gap-16 items-center">

          {/* LEFT */}
          <div>
            <p className="reveal text-xs font-bold uppercase tracking-widest mb-4" style={{ color: '#FF9500' }}>
              Réseau Social
            </p>
            <h2 className="reveal reveal-d1 text-4xl md:text-5xl font-black tracking-tight text-white leading-tight mb-5">
              MyUnivers —<br />
              <span style={{ color: '#FF9500' }}>le Strava des pilotes.</span>
            </h2>
            <p className="reveal reveal-d2 text-lg mb-8 leading-relaxed" style={{ color: 'rgba(255,255,255,0.55)' }}>
              Partage tes vols, suis d'autres pilotes, découvre les évènements aviation près de chez toi. La communauté MyFlyPath t'attend.
            </p>

            {/* Tabs principaux */}
            <div className="reveal reveal-d3">
              <div className="flex gap-2 mb-4 p-1 rounded-2xl" style={{ background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.08)' }}>
                {TABS.map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className="tab-btn flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-sm font-semibold"
                    style={{
                      background: activeTab === tab.id ? '#FF9500' : 'transparent',
                      color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.45)',
                    }}
                  >
                    <span>{tab.icon}</span>
                    <span className="hidden sm:inline">{tab.label}</span>
                  </button>
                ))}
              </div>

              <div className="rounded-2xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>

                {/* ── EXPLORER ── */}
                {activeTab === "explorer" && (
                  <div className="tab-content">
                    {/* Header */}
                    <div className="flex items-center gap-3 p-4 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      <div className="w-9 h-9 rounded-xl flex items-center justify-center text-lg"
                        style={{ background: 'rgba(255,149,0,0.15)' }}>🌍</div>
                      <div>
                        <p className="font-bold text-white text-sm">Explorer</p>
                        <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Le pouls de la communauté MyFlyPath</p>
                      </div>
                    </div>

                    {/* Sous-tabs */}
                    <div className="flex gap-1.5 p-3 border-b" style={{ borderColor: 'rgba(255,255,255,0.06)' }}>
                      {EXPLORER_TABS.map((t) => (
                        <button
                          key={t.id}
                          onClick={() => setActiveExplorerTab(t.id)}
                          className="sub-tab-btn flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold"
                          style={{
                            background: activeExplorerTab === t.id ? '#FF9500' : 'rgba(255,255,255,0.06)',
                            color: activeExplorerTab === t.id ? '#000' : 'rgba(255,255,255,0.45)',
                          }}
                        >
                          <span>{t.icon}</span>
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>

                    {/* Vue d'ensemble */}
                    {activeExplorerTab === "overview" && (
                      <div className="p-4 space-y-3 tab-content">

                        {/* Label date */}
                        <div className="flex items-center justify-between">
                          <p className="text-xs font-bold uppercase tracking-wider flex items-center gap-2" style={{ color: 'rgba(255,255,255,0.5)' }}>
                            <span className="w-2 h-2 rounded-full bg-red-500 inline-block"></span>
                            Statistiques du jour
                          </p>
                          <p className="text-xs font-bold" style={{ color: 'rgba(255,255,255,0.3)' }}>{todayLabel}</p>
                        </div>

                        {/* Carte hero heures */}
                        <div className="relative rounded-2xl p-4 overflow-hidden"
                          style={{ background: 'linear-gradient(135deg, rgba(34,100,30,0.8) 0%, rgba(20,80,20,0.6) 100%)', border: '1px solid rgba(34,197,94,0.3)' }}>
                          <div className="flex items-start justify-between">
                            <div>
                              <p className="text-4xl font-black text-white">16<span className="text-2xl">h</span> 21</p>
                              <p className="text-sm mt-1" style={{ color: 'rgba(255,255,255,0.7)' }}>de vol partagées aujourd'hui</p>
                              <div className="flex items-center gap-2 mt-2">
                                <span className="text-xs px-2 py-1 rounded-full" style={{ background: 'rgba(255,255,255,0.15)', color: 'rgba(255,255,255,0.8)' }}>
                                  👥 4 pilotes · 21 vols
                                </span>
                                <span className="text-xs px-2 py-1 rounded-full font-bold" style={{ background: 'rgba(76,175,80,0.3)', color: '#4CAF50' }}>
                                  ↗ 69%
                                </span>
                              </div>
                            </div>
                            <img src="/images/mascotte/focus_compass.PNG" alt="Checklou"
                              className="w-16 h-16 object-contain"
                              style={{ filter: 'drop-shadow(0 4px 12px rgba(34,197,94,0.4))' }} />
                          </div>
                        </div>

                        {/* Récap d'hier */}
                        <div className="flex items-center justify-between rounded-xl p-3"
                          style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.07)' }}>
                          <div className="flex items-center gap-3">
                            <div className="w-9 h-9 rounded-full flex items-center justify-center"
                              style={{ background: 'rgba(255,149,0,0.2)' }}>
                              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="1 4 1 10 7 10"/><path d="M3.51 15a9 9 0 102.13-9.36L1 10"/></svg>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white">Le récap d'hier</p>
                              <p className="text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>Disponible dès demain matin</p>
                            </div>
                          </div>
                          <span style={{ color: '#FF9500' }}>›</span>
                        </div>

                        {/* Grid 4 stats */}
                        <div className="grid grid-cols-2 gap-2">
                          {/* Vols partagés */}
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                              style={{ background: 'rgba(255,149,0,0.15)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#FF9500" stroke-width="2" strokeLinecap="round"><path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z"/></svg>
                            </div>
                            <p className="text-2xl font-black text-white">21</p>
                            <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Vols partagés</p>
                          </div>

                          {/* Pilotes actifs */}
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                              style={{ background: 'rgba(74,127,224,0.15)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#4A7FE0" stroke-width="2" strokeLinecap="round"><path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.87M16 3.13a4 4 0 010 7.75"/></svg>
                            </div>
                            <p className="text-2xl font-black text-white">4</p>
                            <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Pilotes actifs</p>
                          </div>

                          {/* Heures volées */}
                          <div className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                              style={{ background: 'rgba(34,197,94,0.15)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#22c55e" stroke-width="2" strokeLinecap="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                            </div>
                            <p className="text-2xl font-black text-white">16h21</p>
                            <p className="text-xs uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Heures volées</p>
                          </div>

                          {/* Aéroclub du jour — avec bordure dorée */}
                          <div className="rounded-xl p-3 relative overflow-hidden"
                            style={{
                              background: 'rgba(255,215,0,0.06)',
                              border: '1.5px solid rgba(255,215,0,0.35)',
                            }}>
                            <div className="w-8 h-8 rounded-lg flex items-center justify-center mb-2"
                              style={{ background: 'rgba(255,215,0,0.15)' }}>
                              <svg width="14" height="14" viewBox="0 0 24 24" fill="#FFD700"><path d="M12 2l2.4 6.6H21l-5.6 4.1 2.1 6.6L12 15.4l-5.5 3.9 2.1-6.6L3 8.6h6.6z"/></svg>
                            </div>
                            <p className="text-sm font-black uppercase tracking-wide" style={{ color: '#FFD700' }}>
                              {TOP_CLUB.nom}
                            </p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>
                              {TOP_CLUB.pilotes} pilote actif
                            </p>
                            {/* Badge "Aéroclub du jour" */}
                            <div className="absolute top-2 right-2">
                              <span className="text-xs px-1.5 py-0.5 rounded-full font-bold"
                                style={{ background: 'rgba(255,215,0,0.2)', color: '#FFD700', fontSize: '9px', letterSpacing: '0.5px' }}>
                                👑 DU JOUR
                              </span>
                            </div>
                          </div>
                        </div>

                      </div>
                    )}

                    {/* Activité */}
                    {activeExplorerTab === "activity" && (
                      <div className="p-4 tab-content">
                        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          ✈️ Vols publics récents
                        </p>
                        {feedPosts.map((post) => (
                          <div key={post.title} className="rounded-xl p-3 mb-2" style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="flex items-center gap-2 mb-1">
                              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                                style={{ background: post.color }}>{post.emoji}</div>
                              <span className="text-sm font-bold text-white">{post.pilot}</span>
                              <span className="text-xs" style={{ color: 'rgba(255,255,255,0.35)' }}>{post.time}</span>
                            </div>
                            <p className="text-sm font-bold text-white">{post.title}</p>
                            <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{post.desc}</p>
                          </div>
                        ))}
                      </div>
                    )}

                    {/* Événements */}
                    {activeExplorerTab === "events" && (
                      <div className="p-4 space-y-2 tab-content">
                        <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                          🗓️ Évènements aviation
                        </p>
                        {events.map((ev) => (
                          <div key={ev.title} className="flex items-center gap-3 rounded-xl p-3"
                            style={{ background: 'rgba(255,255,255,0.04)' }}>
                            <div className="flex-shrink-0 w-11 h-11 rounded-xl flex flex-col items-center justify-center"
                              style={{ background: 'rgba(255,149,0,0.15)', border: '1px solid rgba(255,149,0,0.3)' }}>
                              <span className="text-sm font-black leading-none" style={{ color: '#FF9500' }}>{ev.day}</span>
                              <span className="text-[9px] font-bold" style={{ color: 'rgba(255,149,0,0.7)' }}>{ev.month}</span>
                            </div>
                            <div>
                              <p className="text-sm font-bold text-white leading-tight">{ev.title}</p>
                              <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.4)' }}>{ev.location}</p>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

                {/* ── MON FIL ── */}
                {activeTab === "fil" && (
                  <div className="tab-content p-4 space-y-3">
                    <p className="text-xs font-bold uppercase tracking-wider mb-3" style={{ color: 'rgba(255,255,255,0.35)' }}>
                      ✈️ Activité récente
                    </p>
                    {feedPosts.map((post) => (
                      <div key={post.title} className="rounded-xl p-3" style={{ background: 'rgba(255,255,255,0.04)' }}>
                        <div className="flex items-center gap-2 mb-2">
                          <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-black"
                            style={{ background: post.color }}>{post.emoji}</div>
                          <div>
                            <span className="text-sm font-bold text-white">{post.pilot}</span>
                            <span className="text-xs ml-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{post.time}</span>
                          </div>
                        </div>
                        <p className="text-sm font-bold text-white">{post.title}</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.45)' }}>{post.desc}</p>
                      </div>
                    ))}
                  </div>
                )}

                {/* ── PROFIL ── */}
                {activeTab === "profil" && (
                  <div className="tab-content p-4">
                    <div className="flex items-center gap-3 mb-4 p-3 rounded-xl" style={{ background: 'rgba(255,255,255,0.04)' }}>
                      <div className="w-12 h-12 rounded-full flex items-center justify-center text-lg font-black"
                        style={{ background: '#FF9500' }}>AY</div>
                      <div>
                        <p className="font-bold text-white">Aymeric</p>
                        <p className="text-xs" style={{ color: '#FF9500' }}>🌍 Profil public</p>
                        <p className="text-xs mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>Code : 001851.1</p>
                      </div>
                    </div>
                    <div className="grid grid-cols-3 gap-2 mb-4">
                      {profileStats.map((s) => (
                        <div key={s.label} className="rounded-xl p-3 text-center" style={{ background: 'rgba(255,255,255,0.04)' }}>
                          <p className="text-lg font-black text-white">{s.value}</p>
                          <p className="text-[10px] uppercase tracking-wider mt-0.5" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
                        </div>
                      ))}
                    </div>
                    <div className="rounded-xl p-3" style={{ background: 'rgba(255,149,0,0.1)', border: '1px solid rgba(255,149,0,0.2)' }}>
                      <p className="text-xs font-bold uppercase tracking-wider mb-1" style={{ color: '#FF9500' }}>Objectif de carrière</p>
                      <p className="text-sm font-bold text-white">PPL(A) — Licence de Pilote Privé</p>
                    </div>
                  </div>
                )}

              </div>
            </div>
          </div>

          {/* RIGHT : iPhone */}
          <div className="reveal reveal-d2 flex justify-center" style={{ position: 'relative', overflow: 'visible' }}>
            <div className="absolute -inset-10 rounded-full blur-[80px] opacity-15 pointer-events-none"
              style={{ background: '#FF9500' }} />
            <div style={{ position: 'relative', overflow: 'visible', paddingTop: '3rem', paddingRight: '3rem' }}>
              <div className="iphone-frame animate-float" style={{ width: 280 }}>
                <img src={SCREEN_MYUNIVERS} alt="MyUnivers" className="w-full block" />
              </div>
              <img
                src="/images/mascotte/happy_jump.PNG"
                alt="Checklou"
                style={{ position: 'absolute', top: 0, right: 0, width: '7rem', zIndex: 20,
                  filter: 'drop-shadow(0 8px 32px rgba(255,149,0,0.5))' }}
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}