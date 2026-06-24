import React, { useState } from "react";

const FILTERS = [
  { id: "all", label: "Tous" },
  { id: "quarter", label: "Dernier trimestre" },
  { id: "year", label: "Annee en cours" },
];

function filterOrders(orders, filter) {
  if (filter === "all") return orders;
  const now = new Date();
  return orders.filter((o) => {
    const d = new Date(o.sentAt);
    if (filter === "year") return d.getFullYear() === now.getFullYear();
    if (filter === "quarter") {
      const q = Math.floor(now.getMonth() / 3);
      const oq = Math.floor(d.getMonth() / 3);
      return d.getFullYear() === now.getFullYear() && oq === q;
    }
    return true;
  });
}

function exportCSV(orders) {
  const header = ["Code Apple", "Email", "Club", "Montant (EUR)", "Date"];
  const rows = orders.map((o) => [
    o.code, o.sentTo, o.club || "", o.amount ? o.amount.toFixed(2) : "",
    o.sentAt ? new Date(o.sentAt).toLocaleDateString("fr-FR") : "",
  ]);
  const csv = [header, ...rows].map((r) => r.join(";")).join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = `myflypath-ventes-${new Date().toISOString().slice(0, 10)}.csv`;
  a.click();
  URL.revokeObjectURL(url);
}

export default function AdminDashboard() {
  const [password, setPassword] = useState("");
  const [authed, setAuthed] = useState(false);
  const [authError, setAuthError] = useState("");
  const [clubs, setClubs] = useState([]);
  const [codesData, setCodesData] = useState(null);
  const [logbookCodesData, setLogbookCodesData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState("clubs");
  const [filter, setFilter] = useState("all");
  const [clubFilter, setClubFilter] = useState("all");

  // Clubs form
  const [newSlug, setNewSlug] = useState("");
  const [newNom, setNewNom] = useState("");
  const [addMsg, setAddMsg] = useState("");

  // Codes form
  const [newCodesText, setNewCodesText] = useState("");
  const [expiresAt, setExpiresAt] = useState("");
  const [loadingCodes, setLoadingCodes] = useState(false);
  const [loadMsg, setLoadMsg] = useState("");

  // Selection codes
  const [selectedCodes, setSelectedCodes] = useState([]);
  const [deletingCodes, setDeletingCodes] = useState(false);

  const fetchAll = async (pwd) => {
    setLoading(true);
    try {
      const [statsRes, codesRes, logbookRes] = await Promise.all([
        fetch("/.netlify/functions/club-stats", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd }),
        }),
        fetch("/.netlify/functions/get-codes-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd, type: "pro" }),
        }),
        fetch("/.netlify/functions/get-codes-admin", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ password: pwd, type: "logbook" }),
        }),
      ]);
      const statsData = await statsRes.json();
      const codesJson = codesRes.ok ? await codesRes.json() : { codes: [] };
      const logbookJson = logbookRes.ok ? await logbookRes.json() : { codes: [] };
      if (statsRes.ok) {
        setClubs(statsData.clubs || []);
        setCodesData(codesJson);
        setLogbookCodesData(logbookJson);
        setAuthed(true);
        setAuthError("");
      } else {
        setAuthError("Mot de passe incorrect");
      }
    } catch {
      setAuthError("Erreur reseau");
    }
    setLoading(false);
  };

  const handleLogin = (e) => { e.preventDefault(); fetchAll(password); };

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
      setAddMsg(`Club "${newNom}" cree ! URL : myflypath.fr/club/${newSlug.toLowerCase()}`);
      setNewSlug(""); setNewNom("");
      fetchAll(password);
    } else {
      setAddMsg(`Erreur : ${data.error}`);
    }
  };

  const handleToggle = async (slug) => {
    await fetch("/.netlify/functions/club-manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "toggle", slug }),
    });
    fetchAll(password);
  };

  const handleDelete = async (slug) => {
    if (!confirm(`Supprimer le club "${slug}" ?`)) return;
    await fetch("/.netlify/functions/club-manage", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ password, action: "delete", slug }),
    });
    fetchAll(password);
  };

  const handleLoadCodes = async () => {
    setLoadingCodes(true);
    setLoadMsg("");
    try {
      const res = await fetch("/.netlify/functions/load-apple-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, codes: newCodesText, expiresAt: expiresAt || null, type: codesType }),
      });
      const data = await res.json();
      if (data.ok) {
        setLoadMsg(`${data.added} codes ajoutes ! Disponibles : ${data.available}`);
        setNewCodesText(""); setExpiresAt("");
        fetchAll(password);
      } else {
        setLoadMsg(`Erreur : ${data.error}`);
      }
    } catch {
      setLoadMsg("Erreur reseau");
    }
    setLoadingCodes(false);
  };

  const handleDeleteSelected = async () => {
    if (!confirm(`Supprimer ${selectedCodes.length} code(s) ?`)) return;
    setDeletingCodes(true);
    try {
      const res = await fetch("/.netlify/functions/delete-apple-codes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ password, codes: selectedCodes, type: codesType }),
      });
      const data = await res.json();
      if (data.ok) {
        setSelectedCodes([]);
        fetchAll(password);
      }
    } catch {}
    setDeletingCodes(false);
  };

  const toggleSelectCode = (code) => {
    setSelectedCodes(prev =>
      prev.includes(code) ? prev.filter(c => c !== code) : [...prev, code]
    );
  };

  const toggleSelectAll = (codes) => {
    if (selectedCodes.length === codes.length) {
      setSelectedCodes([]);
    } else {
      setSelectedCodes(codes.map(c => c.code));
    }
  };

  const now = new Date();

  // Type de codes lié à l'onglet actif (pro = abo annuel, logbook = 6 mois)
  const codesType = (activeTab === "codes-logbook" || activeTab === "stock-logbook") ? "logbook" : "pro";
  const isLogbookTab = codesType === "logbook";

  // Compteurs par type pour les libellés d'onglets
  const proAll = codesData?.codes || [];
  const logbookAll = logbookCodesData?.codes || [];
  const proUsed = proAll.filter(c => c.used).length;
  const logbookUsed = logbookAll.filter(c => c.used).length;
  const proValid = proAll.filter(c => !c.used && (!c.expiresAt || new Date(c.expiresAt) >= now)).length;
  const logbookValid = logbookAll.filter(c => !c.used && (!c.expiresAt || new Date(c.expiresAt) >= now)).length;

  // Dataset actif
  const allCodes = isLogbookTab ? logbookAll : proAll;
  const usedCodes = allCodes.filter(c => c.used);
  const availableCodes = allCodes.filter(c => !c.used);
  const expiredCodes = availableCodes.filter(c => c.expiresAt && new Date(c.expiresAt) < now);
  const validCodes = availableCodes.filter(c => !c.expiresAt || new Date(c.expiresAt) >= now);
  const codeTypeLabel = isLogbookTab ? "Logbook 6 mois" : "Pro annuel";

  const totalVisites = clubs.reduce((s, c) => s + c.visites, 0);
  const totalAchats = clubs.reduce((s, c) => s + c.achats, 0);
  const globalConversion = totalVisites > 0 ? ((totalAchats / totalVisites) * 100).toFixed(1) : "0.0";
  const allClubNames = [...new Set(usedCodes.map(c => c.club).filter(Boolean))];
  const filteredByTime = filterOrders(usedCodes, filter);
  const filteredOrders = clubFilter === "all" ? filteredByTime : filteredByTime.filter(o => o.club === clubFilter);
  const filteredRevenue = filteredOrders.reduce((s, o) => s + (o.amount || 0), 0);

  const s = { background: '#13141f', color: '#fff' };
  const card = { background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.08)' };
  const inp = { background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', outline: 'none' };

  if (!authed) {
    return (
      <div className="min-h-screen flex items-center justify-center px-5" style={s}>
        <div className="w-full max-w-sm">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-black text-white mb-2">Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>Dashboard partenaires</p>
          </div>
          <form onSubmit={handleLogin} className="space-y-4">
            <input type="password" value={password} onChange={(e) => setPassword(e.target.value)}
              placeholder="Mot de passe" required className="w-full rounded-2xl px-4 py-3" style={inp} />
            {authError && <p className="text-sm text-center" style={{ color: '#FF6B6B' }}>{authError}</p>}
            <button type="submit" disabled={loading} className="w-full font-black py-3.5 rounded-2xl"
              style={{ background: '#FF9500', color: '#000' }}>
              {loading ? "Verification..." : "Acceder →"}
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen font-sans px-6 py-8" style={s}>
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1 className="text-3xl font-black text-white">Dashboard Admin</h1>
            <p style={{ color: 'rgba(255,255,255,0.4)' }}>MyFlyPath</p>
          </div>
          <button onClick={() => fetchAll(password)} className="px-4 py-2 rounded-xl text-sm font-bold"
            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
            Actualiser
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 mb-8 p-1 rounded-2xl w-fit" style={{ background: 'rgba(255,255,255,0.05)' }}>
          {[
            { id: "clubs", label: "Clubs" },
            { id: "codes-pro", label: `Ventes Pro (${proUsed})` },
            { id: "stock-pro", label: `Stock Pro (${proValid})` },
            { id: "codes-logbook", label: `Ventes Logbook (${logbookUsed})` },
            { id: "stock-logbook", label: `Stock Logbook (${logbookValid})` },
          ].map((tab) => (
            <button key={tab.id} onClick={() => { setActiveTab(tab.id); setSelectedCodes([]); }}
              className="px-5 py-2.5 rounded-xl text-sm font-bold transition-all"
              style={{ background: activeTab === tab.id ? '#FF9500' : 'transparent', color: activeTab === tab.id ? '#000' : 'rgba(255,255,255,0.5)' }}>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── CLUBS ── */}
        {activeTab === "clubs" && (
          <>
            <div className="grid grid-cols-4 gap-4 mb-8">
              {[
                { label: "Clubs actifs", value: clubs.filter(c => c.actif).length, color: '#22c55e' },
                { label: "Visites", value: totalVisites, color: '#38bdf8' },
                { label: "Achats", value: totalAchats, color: '#FF9500' },
                { label: "Conversion", value: `${globalConversion}%`, color: '#a855f7' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5" style={card}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                  <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl p-6 mb-8" style={card}>
              <h2 className="text-lg font-black text-white mb-4">Ajouter un club</h2>
              <form onSubmit={handleAddClub} className="flex gap-3 flex-wrap">
                <input type="text" value={newSlug} onChange={(e) => setNewSlug(e.target.value)}
                  placeholder="slug (ex: capaero)" required className="flex-1 min-w-40 rounded-xl px-4 py-2.5 text-sm text-white" style={inp} />
                <input type="text" value={newNom} onChange={(e) => setNewNom(e.target.value)}
                  placeholder="Nom affiche (ex: CapAero)" required className="flex-1 min-w-40 rounded-xl px-4 py-2.5 text-sm text-white" style={inp} />
                <button type="submit" className="px-6 py-2.5 rounded-xl text-sm font-black" style={{ background: '#FF9500', color: '#000' }}>Creer</button>
              </form>
              {addMsg && <p className="mt-3 text-sm" style={{ color: addMsg.startsWith('Club') ? '#22c55e' : '#FF6B6B' }}>{addMsg}</p>}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {["Club", "URL", "Visites", "Achats", "Conversion", "Revenus", "Statut", "Actions"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {clubs.length === 0 ? (
                    <tr><td colSpan={8} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun club</td></tr>
                  ) : clubs.map((club, i) => (
                    <tr key={club.slug} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td className="px-4 py-3 font-bold text-white">{club.nom}</td>
                      <td className="px-4 py-3 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>/club/{club.slug}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#38bdf8' }}>{club.visites}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#FF9500' }}>{club.achats}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#a855f7' }}>{club.conversion}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{club.revenue.toFixed(2)}€</td>
                      <td className="px-4 py-3">
                        <span className="px-2 py-1 rounded-full text-xs font-bold"
                          style={{ background: club.actif ? 'rgba(34,197,94,0.15)' : 'rgba(255,100,100,0.15)', color: club.actif ? '#22c55e' : '#FF6B6B' }}>
                          {club.actif ? "Actif" : "Inactif"}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex gap-2">
                          <button onClick={() => handleToggle(club.slug)} className="px-3 py-1 rounded-lg text-xs font-bold"
                            style={{ background: 'rgba(255,255,255,0.08)', color: 'rgba(255,255,255,0.6)' }}>
                            {club.actif ? "Desactiver" : "Activer"}
                          </button>
                          <button onClick={() => handleDelete(club.slug)} className="px-3 py-1 rounded-lg text-xs font-bold"
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
          </>
        )}

        {/* ── VENTES ── */}
        {(activeTab === "codes-pro" || activeTab === "codes-logbook") && (
          <>
            <div className="mb-4">
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={{ background: 'rgba(255,149,0,0.15)', color: '#FF9500' }}>
                {codeTypeLabel}
              </span>
            </div>
            <div className="flex items-center gap-3 mb-6 flex-wrap">
              <div className="flex gap-2 p-1 rounded-xl" style={{ background: 'rgba(255,255,255,0.05)' }}>
                {FILTERS.map((f) => (
                  <button key={f.id} onClick={() => setFilter(f.id)}
                    className="px-4 py-2 rounded-lg text-sm font-bold transition-all"
                    style={{ background: filter === f.id ? '#FF9500' : 'transparent', color: filter === f.id ? '#000' : 'rgba(255,255,255,0.5)' }}>
                    {f.label}
                  </button>
                ))}
              </div>
              <select value={clubFilter} onChange={(e) => setClubFilter(e.target.value)}
                className="rounded-xl px-4 py-2 text-sm font-bold" style={{ ...inp, background: 'rgba(255,255,255,0.06)' }}>
                <option value="all">Tous les clubs</option>
                {allClubNames.map(c => <option key={c} value={c}>{c}</option>)}
              </select>
              <button onClick={() => exportCSV(filteredOrders)}
                className="ml-auto px-5 py-2 rounded-xl text-sm font-black flex items-center gap-2"
                style={{ background: '#22c55e', color: '#000' }}>
                <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" y1="15" x2="12" y2="3"/>
                </svg>
                Exporter CSV
              </button>
            </div>

            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: "Ventes", value: filteredOrders.length, color: '#FF9500' },
                { label: "Revenu", value: `${filteredRevenue.toFixed(2)}€`, color: '#22c55e' },
                { label: "Codes restants", value: validCodes.length, color: '#38bdf8' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5" style={card}>
                  <p className="text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                  <p className="text-3xl font-black" style={{ color: stat.color }}>{stat.value}</p>
                </div>
              ))}
            </div>

            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.04)' }}>
                    {["Code Apple", "Email", "Club", "Montant", "Date"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filteredOrders.length === 0 ? (
                    <tr><td colSpan={5} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucune vente</td></tr>
                  ) : filteredOrders.map((o, i) => (
                    <tr key={i} style={{ borderTop: '1px solid rgba(255,255,255,0.06)', background: i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)' }}>
                      <td className="px-4 py-3 font-mono text-sm font-bold" style={{ color: '#FF9500' }}>{o.code}</td>
                      <td className="px-4 py-3 text-sm text-white">{o.sentTo}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>{o.club || "—"}</td>
                      <td className="px-4 py-3 font-bold" style={{ color: '#22c55e' }}>{o.amount ? `${o.amount.toFixed(2)}€` : "—"}</td>
                      <td className="px-4 py-3 text-sm" style={{ color: 'rgba(255,255,255,0.4)' }}>
                        {o.sentAt ? new Date(o.sentAt).toLocaleDateString("fr-FR") : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </>
        )}

        {/* ── STOCK ── */}
        {(activeTab === "stock-pro" || activeTab === "stock-logbook") && (
          <div className="space-y-6">

            <div>
              <span className="px-3 py-1 rounded-full text-xs font-black uppercase tracking-wider"
                style={{ background: 'rgba(255,149,0,0.15)', color: '#FF9500' }}>
                {codeTypeLabel}
              </span>
            </div>

            {/* Compteurs */}
            <div className="grid grid-cols-3 gap-4">
              {[
                { label: "Disponibles", value: validCodes.length, color: '#22c55e' },
                { label: "Expires", value: expiredCodes.length, color: '#FF6B6B' },
                { label: "Utilises", value: usedCodes.length, color: 'rgba(255,255,255,0.4)' },
              ].map((stat) => (
                <div key={stat.label} className="rounded-2xl p-5 text-center" style={card}>
                  <p className="text-4xl font-black mb-1" style={{ color: stat.color }}>{stat.value}</p>
                  <p className="text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{stat.label}</p>
                </div>
              ))}
            </div>

            {validCodes.length <= 10 && (
              <div className="rounded-xl p-4" style={{ background: 'rgba(255,100,100,0.1)', border: '1px solid rgba(255,100,100,0.3)' }}>
                <p className="font-bold text-center" style={{ color: '#FF6B6B' }}>Stock faible — rechargez vos codes !</p>
              </div>
            )}

            {/* Tableau codes disponibles */}
            <div className="rounded-2xl overflow-hidden" style={{ border: '1px solid rgba(255,255,255,0.08)' }}>
              <div className="flex items-center justify-between px-4 py-3" style={{ background: 'rgba(255,255,255,0.04)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
                <div className="flex items-center gap-3">
                  <input
                    type="checkbox"
                    checked={selectedCodes.length === availableCodes.length && availableCodes.length > 0}
                    onChange={() => toggleSelectAll(availableCodes)}
                    className="w-4 h-4 rounded"
                    style={{ accentColor: '#FF9500' }}
                  />
                  <span className="text-sm font-bold text-white">
                    {selectedCodes.length > 0 ? `${selectedCodes.length} selectionne(s)` : `${availableCodes.length} codes disponibles`}
                  </span>
                </div>
                {selectedCodes.length > 0 && (
                  <button onClick={handleDeleteSelected} disabled={deletingCodes}
                    className="px-4 py-1.5 rounded-lg text-xs font-black"
                    style={{ background: 'rgba(255,100,100,0.2)', color: '#FF6B6B', border: '1px solid rgba(255,100,100,0.3)' }}>
                    {deletingCodes ? "Suppression..." : `Supprimer (${selectedCodes.length})`}
                  </button>
                )}
              </div>
              <table className="w-full">
                <thead>
                  <tr style={{ background: 'rgba(255,255,255,0.02)' }}>
                    <th className="px-4 py-3 w-10"></th>
                    {["Code Apple", "Expiration", "Statut"].map(h => (
                      <th key={h} className="px-4 py-3 text-left text-xs font-bold uppercase tracking-wider" style={{ color: 'rgba(255,255,255,0.35)' }}>{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {availableCodes.length === 0 ? (
                    <tr><td colSpan={4} className="px-4 py-8 text-center text-sm" style={{ color: 'rgba(255,255,255,0.3)' }}>Aucun code disponible</td></tr>
                  ) : availableCodes.map((c, i) => {
                    const expired = c.expiresAt && new Date(c.expiresAt) < now;
                    const isSelected = selectedCodes.includes(c.code);
                    return (
                      <tr key={i} style={{
                        borderTop: '1px solid rgba(255,255,255,0.06)',
                        background: isSelected ? 'rgba(255,149,0,0.06)' : i % 2 === 0 ? 'transparent' : 'rgba(255,255,255,0.02)',
                      }}>
                        <td className="px-4 py-3">
                          <input type="checkbox" checked={isSelected} onChange={() => toggleSelectCode(c.code)}
                            className="w-4 h-4 rounded" style={{ accentColor: '#FF9500' }} />
                        </td>
                        <td className="px-4 py-3 font-mono font-bold text-sm" style={{ color: expired ? 'rgba(255,255,255,0.3)' : '#fff' }}>
                          {c.code}
                        </td>
                        <td className="px-4 py-3 text-sm" style={{ color: expired ? '#FF6B6B' : 'rgba(255,255,255,0.5)' }}>
                          {c.expiresAt ? new Date(c.expiresAt).toLocaleDateString("fr-FR") : "—"}
                        </td>
                        <td className="px-4 py-3">
                          <span className="px-2 py-1 rounded-full text-xs font-bold"
                            style={{
                              background: expired ? 'rgba(255,100,100,0.15)' : 'rgba(34,197,94,0.15)',
                              color: expired ? '#FF6B6B' : '#22c55e',
                            }}>
                            {expired ? "Expire" : "Disponible"}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>

            {/* Formulaire ajout codes */}
            <div className="rounded-2xl p-6" style={card}>
              <h2 className="text-lg font-black text-white mb-1">Charger de nouveaux codes — {codeTypeLabel}</h2>
              <p className="text-sm mb-4" style={{ color: 'rgba(255,255,255,0.4)' }}>Collez vos codes Apple ({codeTypeLabel}), un par ligne</p>
              <div className="space-y-4">
                <textarea value={newCodesText} onChange={(e) => setNewCodesText(e.target.value)}
                  placeholder={"XXXX-XXXX-XXXX-XXXX\nXXXX-XXXX-XXXX-XXXX\nXXXX-XXXX-XXXX-XXXX"}
                  rows={8} className="w-full rounded-2xl px-4 py-3 text-sm font-mono text-white"
                  style={{ ...inp, resize: 'vertical' }} />
                <div className="flex gap-4 items-end">
                  <div className="flex-1">
                    <label className="block text-xs font-bold uppercase tracking-wider mb-2" style={{ color: 'rgba(255,255,255,0.4)' }}>
                      Date d'expiration
                    </label>
                    <input type="date" value={expiresAt} onChange={(e) => setExpiresAt(e.target.value)}
                      className="w-full rounded-xl px-4 py-2.5" style={{ ...inp, colorScheme: 'dark' }} />
                  </div>
                  <button onClick={handleLoadCodes} disabled={!newCodesText.trim() || loadingCodes}
                    className="px-6 py-2.5 rounded-xl font-black text-sm"
                    style={{
                      background: (!newCodesText.trim() || loadingCodes) ? 'rgba(255,149,0,0.4)' : '#FF9500',
                      color: '#000',
                      cursor: (!newCodesText.trim() || loadingCodes) ? 'not-allowed' : 'pointer',
                    }}>
                    {loadingCodes ? "Chargement..." : "Charger les codes"}
                  </button>
                </div>
                {loadMsg && (
                  <p className="text-sm font-bold" style={{ color: loadMsg.includes('ajoutes') ? '#22c55e' : '#FF6B6B' }}>
                    {loadMsg}
                  </p>
                )}
              </div>
            </div>
          </div>
        )}

        <p className="mt-8 text-center text-xs" style={{ color: 'rgba(255,255,255,0.2)' }}>
          MyFlyPath Admin · <a href="/" style={{ color: '#FF9500' }}>Retour au site</a>
        </p>
      </div>
    </div>
  );
}
