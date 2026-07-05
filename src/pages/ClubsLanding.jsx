import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import {
  Users, GraduationCap, LineChart, BadgeCheck, Wallet,
  Headphones, CheckCircle2, Plane, Mail,
} from "lucide-react";
import Navbar from "../components/landing/Navbar";
import Footer from "../components/landing/Footer";

const FORMSPREE = "https://formspree.io/f/xrerdkoj";
const CONTACT_EMAIL = "contact@myflypath.fr";

const BENEFITS = [
  { icon: GraduationCap, title: "Tes élèves progressent plus vite", desc: "Parcours PPL & IFR gamifiés, micro-leçons et fiches de révision. Ils révisent entre deux vols, où qu'ils soient." },
  { icon: LineChart, title: "Suivi de progression", desc: "Visualise l'avancement théorique de tes élèves et repère ceux qui décrochent avant l'examen." },
  { icon: BadgeCheck, title: "LogBook EASA conforme", desc: "Carnet de vol digital FCL.050, statistiques et export PDF. Fini le papier pour ton club." },
  { icon: Wallet, title: "Tarif de groupe", desc: "Un prix préférentiel négocié pour l'ensemble de tes élèves, bien en dessous de l'abonnement individuel." },
  { icon: Users, title: "Aux couleurs de ton club", desc: "Un lien partenaire dédié pour inscrire tes élèves et suivre les adhésions de ton aéroclub." },
  { icon: Headphones, title: "Accompagnement dédié", desc: "Un interlocuteur pour la mise en place, la formation de ton équipe et le support au quotidien." },
];

const STEPS = [
  { n: 1, title: "On échange", desc: "Tu nous parles de ton club, tes effectifs et tes besoins." },
  { n: 2, title: "On met en place", desc: "Lien partenaire dédié, tarif de groupe et accès pour tes élèves." },
  { n: 3, title: "Tes élèves décollent", desc: "Ils révisent et loggent leurs vols dès le premier jour." },
];

function PartnerForm() {
  const [status, setStatus] = useState("idle");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus("sending");
    const data = new FormData(e.target);
    data.append("_sujet", "Partenariat Club");
    try {
      const res = await fetch(FORMSPREE, {
        method: "POST", body: data, headers: { Accept: "application/json" },
      });
      if (res.ok) { setStatus("success"); e.target.reset(); }
      else setStatus("error");
    } catch { setStatus("error"); }
  };

  if (status === "success") {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <div className="text-5xl mb-4">✈️</div>
        <p className="text-lg font-black text-white mb-2">Demande envoyée !</p>
        <p className="text-sm" style={{ color: "rgba(255,255,255,0.45)" }}>On revient vers toi très vite pour organiser tout ça. 📬</p>
      </div>
    );
  }

  const inputStyle = {
    width: "100%", background: "rgba(255,255,255,0.05)", border: "1px solid rgba(255,255,255,0.15)",
    borderRadius: 12, padding: "12px 14px", color: "#fff", outline: "none",
  };
  const labelCls = "block text-xs font-semibold mb-1.5 uppercase tracking-wider";
  const labelStyle = { color: "rgba(255,255,255,0.35)" };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls} style={labelStyle}>Nom du club / école</label>
          <input type="text" name="club" required placeholder="Aéroclub de..." style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Ton nom</label>
          <input type="text" name="nom" required placeholder="Prénom Nom" style={inputStyle} />
        </div>
      </div>
      <div className="grid sm:grid-cols-2 gap-3">
        <div>
          <label className={labelCls} style={labelStyle}>Email</label>
          <input type="email" name="email" required placeholder="toi@club.fr" style={inputStyle} />
        </div>
        <div>
          <label className={labelCls} style={labelStyle}>Nombre d'élèves (environ)</label>
          <input type="text" name="eleves" placeholder="ex : 25" style={inputStyle} />
        </div>
      </div>
      <div>
        <label className={labelCls} style={labelStyle}>Message</label>
        <textarea name="message" rows={4} placeholder="Parle-nous de ton club et de tes besoins..." style={{ ...inputStyle, resize: "none" }} />
      </div>
      {status === "error" && (
        <p className="text-xs text-center" style={{ color: "#FF4444" }}>
          Une erreur est survenue. Écris-nous à {CONTACT_EMAIL}
        </p>
      )}
      <button type="submit" disabled={status === "sending"}
        className="w-full font-bold py-3.5 rounded-2xl transition-transform hover:scale-[1.02] active:scale-[0.98]"
        style={{ background: status === "sending" ? "rgba(255,149,0,0.5)" : "#FF9500", color: "#000", cursor: status === "sending" ? "not-allowed" : "pointer" }}>
        {status === "sending" ? "Envoi…" : "Demander une présentation"}
      </button>
    </form>
  );
}

export default function ClubsLanding() {
  useEffect(() => { document.title = "MyFlyPath pour les clubs & écoles"; }, []);

  return (
    <div className="min-h-screen font-sans overflow-x-hidden" style={{ background: "#13141f", color: "#fff" }}>
      <Navbar />

      {/* HERO */}
      <section className="relative pt-32 pb-20 overflow-hidden">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute top-0 left-[15%] w-[500px] h-[500px] rounded-full blur-[130px] opacity-20"
            style={{ background: "#FF9500" }} />
          <div className="absolute top-[20%] right-[10%] w-[400px] h-[400px] rounded-full blur-[120px] opacity-15"
            style={{ background: "#4A7FE0" }} />
        </div>

        <div className="max-w-5xl mx-auto px-5 text-center">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
            <div className="inline-flex items-center gap-2 rounded-full px-4 py-2 mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)", color: "#FF9500" }}>
              <Users className="w-3.5 h-3.5" /> Aéroclubs & écoles de pilotage
            </div>
            <h1 className="text-4xl sm:text-5xl lg:text-[4rem] font-black leading-[1.05] tracking-tight text-white">
              Équipe ton club de<br />
              <span className="gradient-text-orange">la meilleure app de formation.</span>
            </h1>
            <p className="mt-6 text-lg md:text-xl max-w-2xl mx-auto" style={{ color: "rgba(255,255,255,0.6)" }}>
              Offre à tes élèves le PPL & l'IFR gamifiés, les fiches de révision et le LogBook digital EASA —
              à un tarif de groupe négocié pour ton aéroclub.
            </p>
            <div className="mt-9 flex flex-col sm:flex-row items-center justify-center gap-4">
              <a href="#contact-club" className="inline-flex items-center gap-2.5 rounded-2xl px-7 py-4 font-bold transition-transform hover:scale-[1.03]"
                style={{ background: "#FF9500", color: "#000" }}>
                Demander une présentation
              </a>
              <a href="#avantages" className="text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                style={{ color: "rgba(255,255,255,0.7)" }}>
                Voir les avantages →
              </a>
            </div>
          </motion.div>
        </div>
      </section>

      {/* AVANTAGES */}
      <section id="avantages" className="py-20 md:py-28 relative">
        <div className="max-w-6xl mx-auto px-5">
          <div className="max-w-2xl mb-14">
            <p className="text-xs font-bold uppercase tracking-widest mb-4" style={{ color: "#FF9500" }}>
              Pourquoi MyFlyPath
            </p>
            <h2 className="text-3xl md:text-5xl font-black tracking-tight text-white leading-tight">
              Un vrai atout pour<br /><span className="gradient-text-orange">tes élèves et ton club.</span>
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
            {BENEFITS.map((b) => {
              const Icon = b.icon;
              return (
                <div key={b.title} className="rounded-2xl p-6 transition-transform duration-200 hover:scale-[1.02]"
                  style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.07)" }}>
                  <div className="w-11 h-11 rounded-xl flex items-center justify-center mb-4"
                    style={{ background: "rgba(255,149,0,0.12)", border: "1px solid rgba(255,149,0,0.3)" }}>
                    <Icon className="w-5 h-5" style={{ color: "#FF9500" }} />
                  </div>
                  <div className="font-bold text-white mb-1.5">{b.title}</div>
                  <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{b.desc}</div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* COMMENT ÇA MARCHE */}
      <section className="py-16 md:py-20 relative">
        <div className="max-w-5xl mx-auto px-5">
          <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white text-center mb-14">
            Comment ça se met en place
          </h2>
          <div className="grid md:grid-cols-3 gap-6">
            {STEPS.map((s) => (
              <div key={s.n} className="text-center">
                <div className="w-14 h-14 rounded-2xl mx-auto mb-5 flex items-center justify-center text-2xl font-black"
                  style={{ background: "#FF9500", color: "#000" }}>
                  {s.n}
                </div>
                <div className="font-bold text-white text-lg mb-2">{s.title}</div>
                <div className="text-sm leading-relaxed" style={{ color: "rgba(255,255,255,0.5)" }}>{s.desc}</div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* OFFRE */}
      <section className="py-16 md:py-24 relative">
        <div className="max-w-3xl mx-auto px-5">
          <div className="rounded-3xl p-8 md:p-10 relative overflow-hidden"
            style={{ background: "rgba(255,149,0,0.06)", border: "1px solid rgba(255,149,0,0.25)" }}>
            <div className="absolute -top-16 -right-16 w-52 h-52 rounded-full blur-[80px] opacity-30 pointer-events-none"
              style={{ background: "#FF9500" }} />
            <p className="text-xs font-bold uppercase tracking-widest mb-3" style={{ color: "#FF9500" }}>Offre club</p>
            <h3 className="text-2xl md:text-3xl font-black text-white mb-2">Tarif de groupe négocié</h3>
            <p className="mb-6" style={{ color: "rgba(255,255,255,0.6)" }}>
              L'abonnement Pro (PPL + IFR + LogBook) est à 89,99 €/an en individuel.
              Pour un club, on construit un tarif dégressif selon le nombre d'élèves.
            </p>
            <ul className="space-y-2.5 mb-8">
              {[
                "Accès Pro complet pour chaque élève",
                "Tarif dégressif selon l'effectif",
                "Lien partenaire dédié à ton club",
                "Mises à jour et support inclus",
              ].map((f) => (
                <li key={f} className="flex items-center gap-3" style={{ color: "rgba(255,255,255,0.8)" }}>
                  <CheckCircle2 className="w-5 h-5 flex-shrink-0" style={{ color: "#4CAF50" }} />
                  {f}
                </li>
              ))}
            </ul>
            <a href="#contact-club" className="inline-flex items-center gap-2 rounded-2xl px-6 py-3.5 font-bold transition-transform hover:scale-[1.03]"
              style={{ background: "#FF9500", color: "#000" }}>
              Obtenir un devis club
            </a>
          </div>
        </div>
      </section>

      {/* CONTACT */}
      <section id="contact-club" className="py-16 md:py-24 relative">
        <div className="absolute inset-0 -z-10 pointer-events-none">
          <div className="absolute left-1/4 bottom-0 w-[500px] h-[400px] rounded-full blur-[120px] opacity-10"
            style={{ background: "#4A7FE0" }} />
        </div>
        <div className="max-w-2xl mx-auto px-5">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-black tracking-tight text-white">
              Parlons de ton <span className="gradient-text-orange">club</span>
            </h2>
            <p className="mt-4" style={{ color: "rgba(255,255,255,0.6)" }}>
              Remplis le formulaire, on te recontacte pour une présentation et un tarif adapté.
            </p>
          </div>
          <div className="rounded-3xl p-6 md:p-8"
            style={{ background: "rgba(255,255,255,0.04)", border: "1px solid rgba(255,255,255,0.08)" }}>
            <PartnerForm />
          </div>
          <p className="mt-6 text-center text-sm flex items-center justify-center gap-2" style={{ color: "rgba(255,255,255,0.4)" }}>
            <Mail className="w-4 h-4" /> Ou écris-nous directement à{" "}
            <a href={`mailto:${CONTACT_EMAIL}`} className="underline hover:text-white/70">{CONTACT_EMAIL}</a>
          </p>
        </div>
      </section>

      <Footer />
    </div>
  );
}
