import React, { useState } from "react";

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [clubs, setClubs] = useState([]);
  const [loading, setLoading] = useState(false);

  // Formulaire nouveau club
  const [newSlug, setNewSlug] = useState("");
  const [newNom, setNewNom] = useState("");
  const [addMsg, setAddMsg] = useState("");

  const fetchStats = async (pwd) => {
    setLoading(true);
    try {
      const res = await fetch("/.netlify/functions/club-stats", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password: pwd }),
      });
      const data = await res.json();
      if (res.ok) {
        setClubs(data.clubs || []);
        setAuthed(true);
        setAuthError("");
      } else {
        setAuthError("Mot de passe incorrect");
      }
    } catch {
      setAuthError("Erreur réseau");
    }
    setLoading(false);
  };

  const handleLogin = (e) => {
    e.preventDefault();
    fetchStats(password);
  };

  const handleAddClub = async (e) => {
    e.preventDefault();
    setAddMsg("");
    const res = await fetch("/.netlify/functions/club-manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "upsert", slug: newSlug.toLowerCase().replace(/\s+/g, "-"), nom: newNom }),
    });
    const data = await res.json();
    if (data.ok) {
      setAddMsg(`✅ Club "${newNom}" créé ! URL : myflypath.fr/club/${newSlug.toLowerCase()}`);
      setNewSlug(""); setNewNom("");
      fetchStats(password);
    } else {
      setAddMsg(`❌ ${data.error}`);
    }
  };

  const handleToggle = async (slug) => {
    await fetch("/.netlify/functions/club-manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "toggle", slug }),
    });
    fetchStats(password);
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Supprimer le club "${slug}" ?`)) return;
    await fetch("/.netlify/functions/club-manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "delete", slug }),
    });
    fetchStats(password);
  };

  const totalVisites = clubs.reduce((s, c) => s + c.visites, 0);
  const totalAchats = clubs.reduce((s, c) => s + c.achats, 0);
  const totalRevenue = clubs.reduce((s, c) => s + c.revenue, 0);
  const globalConversion = totalVisites > 0 ? ((totalAchats / totalVisites) * 100).toFixed(1) : "0.0";

  // Login screen
  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={{ background: '#13141f' }}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Dashboard partenaires</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe"
              required
              className="w-full rounded-2xl px-4 py-3 text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)', outline: 'none' }}
            />
            {authError && <p className="text-sm text-center" style={{ color: '#FF6B6B' }}>{authError}</p>}
            <button type="submit" disabled={loading}
              className="w-full font-black py-3.5 rounded-2xl"
              style={{ background: '#FF9500', color: '#000', cursor: loading ? 'wait' : 'pointer' }}>
              {loading ? "Vérification…" : "Accéder →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans px-6 py-8" style={{ background: '#13141f', color: '#fff' }}>
      <div className="max-w-5xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard Partenaires</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>MyFlyPath Admin</p>
          </div>
          <button onClick={() => fetchStats(password)}
            className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            Actualiser
          </button>
        </div>

        {/* Stats globales */}
        <div className="grid grid-cols-4 gap-4 mb-8">
          {[
            { label: "Clubs actifs", value: clubs.filter(c => c.actif).length, color: '#22c55e' },
            { label: "Visites totales", value: totalVisites, color: '#38bdf8' },
            { label: "Achats totaux", value: totalAchats, color: '#FF9500' },
            { label: "Conversion globale", value: `${globalConversion}%`, color: '#a855f7' },
          ].map((s) => (
            <div key={s.label} className="rounded-2xl p-5"
              style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
              <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{s.label}</p>
              <p className="text-3xl font-black" style={{ color: s.color }}>{s.value}</p>
            </div>
          ))}
        </div>

        {/* Ajouter un club */}
        <div className="rounded-2xl p-6 mb-8" style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' }}>
          <h2 className="text-lg font-black text-white mb-4">Ajouter un club partenaire</h2>
          <form onSubmit={handleAddClub} className="flex gap-3 flex-wrap">
            <input
              type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
              placeholder="slug (ex: capaero)" required
              className="flex-1 min-w-40 rounded-xl px-4 py-2.5 text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
            />
            <input
              type="text" value={newNom} onChange={(e) => setNewNom(e.target.value)}
              placeholder="Nom affiché (ex: CapAero)" required
              className="flex-1 min-w-40 rounded-xl px-4 py-2.5 text-sm text-white"
              style={{ background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', outline: 'none' }}
            />
            <button type="submit"
              className="px-6 py-2.5 rounded-xl text-sm font-black"
              style={{ background: '#FF9500', color: '#000' }}>
              Créer
            </button>
          </form>
          {addMsg && <p className="mt-3 text-sm" style={{ color: addMsg.startsWith('✅') ? '#22c55e' : '#FF6B6B' }}>{addMsg}</p>}
        </div>

        {/* Tableau clubs */}
        <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
          <table className="w-full">
            <thead>
              <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                {["Club", "URL", "Visites", "Achats", "Conversion", "Revenus", "Statut", "Actions"].map((h) => (
                  <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider"
                    style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {clubs.length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-4 py-8 text-center text-sm"
                    style={{ color: 'rgba(255,255,255,0.3)' }}>
                    Aucun club pour l'instant — ajoutez le premier !
                  </td>
                </tr>
              ) : clubs.map((club, i) => (
                <tr key={club.slug}
                  style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                  <td className="px-4 py-3 font-bold text-white">{club.nom}</td>
                  <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
                    /club/{club.slug}
                  </td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#38bdf8' }}>{club.visites}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#FF9500' }}>{club.achats}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#a855f7' }}>{club.conversion}</td>
                  <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{club.revenue.toFixed(2)}€</td>
                  <td className="px-4 py-3">
                    <span className="px-2 py-1 rounded-full text-xs font-bold"
                      style={{
                        background: club.actif ? 'rgba(34,197,94,0.15)' : 'rgba(255,100,100,0.15)',
                        color: club.actif ? '#22c55e' : '#FF6B6B',
                      }}>
                      {club.actif ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex gap-2">
                      <button onClick={() => handleToggle(club.slug)}
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                        {club.actif ? "Désactiver" : "Activer"}
                      </button>
                      <button onClick={() => handleDelete(club.slug)}
                        className="px-3 py-1 rounded-lg text-xs font-bold"
                        style={{ background: 'rgba(255,100,100,0.15)', color: '#FF6B6B' }}>
                        Suppr.
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <p className="mt-6 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          MyFlyPath Admin · <a href="/" style={{ color: '#FF9500' }}>Retour au site</a>
        </p>
      </div>
    </div>
  );
}
