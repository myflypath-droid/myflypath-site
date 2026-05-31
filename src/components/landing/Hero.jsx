import React from "react";
import { Star } from "lucide-react";

const MASCOT_CELEBRATE = "/images/mascotte/happy_jump.png";
const SCREEN_HOME = "/images/screen/ACCUEIL.jpeg";
const SCREEN_PPL  = "/images/screen/PPL.jpeg";

export default function Hero() {
  return (
    <section className="relative min-h-screen flex items-center pt-16 overflow-hidden">
      <div className="absolute inset-0 -z-10 pointer-events-none">
        <div className="absolute top-0 left-0 w-full h-full bg-grid-dark opacity-100" />
        <div className="absolute top-[-10%] left-[10%] w-[400px] h-[400px] md:w-[700px] md:h-[700px] rounded-full blur-[120px] opacity-20"
          style={{ background: 'radial-gradient(circle, #FF9500 0%, transparent 70%)' }} />
        <div className="absolute top-[20%] right-[5%] w-[300px] h-[300px] md:w-[500px] md:h-[500px] rounded-full blur-[100px] opacity-15"
          style={{ background: 'radial-gradient(circle, #4A7FE0 0%, transparent 70%)' }} />
        <div className="absolute bottom-0 left-[30%] w-[300px] h-[200px] md:w-[600px] md:h-[400px] rounded-full blur-[100px] opacity-10"
          style={{ background: 'radial-gradient(circle, #4CAF50 0%, transparent 70%)' }} />
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-12 md:py-20 w-full">
        <div className="grid lg:grid-cols-2 gap-8 md:gap-12 items-center">

          {/* Left copy */}
          <div className="relative z-10 text-center lg:text-left">
            <div
              className="inline-flex items-center gap-2.5 rounded-full px-4 py-2 mb-6 text-xs font-semibold uppercase tracking-widest"
              style={{ background: 'rgba(255,149,0,0.12)', border: '1px solid rgba(255,149,0,0.3)', color: '#FF9500' }}
            >
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75" style={{ background: '#FF9500' }} />
                <span className="relative inline-flex rounded-full h-2 w-2" style={{ background: '#FF9500' }} />
              </span>
              Disponible sur l'App Store
            </div>

            <h1 className="text-4xl sm:text-5xl lg:text-[4.5rem] font-black leading-[1.05] tracking-tight text-white">
              Deviens pilote,
              <br />
              <span className="gradient-text-orange">chaque jour un peu plus.</span>
            </h1>

            <p
              className="mt-5 text-base md:text-xl leading-relaxed max-w-lg mx-auto lg:mx-0"
              style={{ color: 'rgba(255,255,255,0.65)' }}
            >
              Micro-apprentissage <strong className="text-white">PPL</strong> & <strong className="text-white">IFR</strong>, parcours gamifié, fiches de révision, et LogBook digital complet. Tout ce qu'il te faut dans la poche.
            </p>

            <div className="mt-8 flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <a
                href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
                id="download"
                className="group inline-flex items-center gap-3 rounded-2xl px-6 py-4 font-semibold transition-all duration-300 hover:scale-[1.04] active:scale-[0.97] shadow-xl"
                style={{ background: '#FF9500', color: '#000' }}
              >
                <svg viewBox="0 0 24 24" className="w-7 h-7 flex-shrink-0" fill="currentColor">
                  <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
                </svg>
                <span className="text-lg font-bold tracking-tight">App Store</span>
              </a>

              <a
                href="#training"
                className="text-sm font-semibold flex items-center gap-1.5 hover:gap-2.5 transition-all"
                style={{ color: 'rgba(255,255,255,0.7)' }}
              >
                Voir les fonctionnalités →
              </a>
            </div>

            {/* Social proof */}
            <div className="mt-8 flex items-center gap-4 justify-center lg:justify-start">
              <div className="flex items-center gap-0.5">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4" style={{ fill: '#FF9500', color: '#FF9500' }} />
                ))}
              </div>
              <p className="text-sm" style={{ color: 'rgba(255,255,255,0.5)' }}>
                <span className="text-white font-semibold">4.9/5</span> · Note des pilotes sur l'App Store
              </p>
            </div>
          </div>

          {/* Right: phones + mascotte */}
          <div className="relative flex justify-center items-end mt-8 lg:mt-0"
            style={{ paddingTop: '4rem', paddingRight: '5rem' }}>

            {/* Halo orange derrière les phones */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-48 h-48 md:w-72 md:h-72 rounded-full blur-[80px] opacity-30" style={{ background: '#FF9500' }} />
            </div>

            {/* iPhone gauche (PPL) — en retrait */}
            <div
              className="relative iphone-frame animate-float-slow"
              style={{ width: 'clamp(120px, 28vw, 220px)', marginRight: 'clamp(-20px, -4vw, -40px)', marginBottom: -30, zIndex: 1, opacity: 0.85 }}
            >
              <img src={SCREEN_PPL} alt="Parcours PPL" className="w-full h-full object-cover block" />
            </div>

            {/* iPhone droit (Accueil) — au premier plan */}
            <div
              className="relative iphone-frame animate-float"
              style={{ width: 'clamp(140px, 33vw, 260px)', zIndex: 2 }}
            >
              <img src={SCREEN_HOME} alt="Accueil MyFlyPath" className="w-full h-full object-cover block" />
            </div>

            {/* Mascotte — coin haut droit, hors des iPhones */}
            <img
              src={MASCOT_CELEBRATE}
              alt="Checklou"
              className="animate-float drop-shadow-2xl"
              style={{
                position: 'absolute',
                top: 0,
                right: 0,
                width: 'clamp(80px, 10vw, 130px)',
                zIndex: 10,
                filter: 'drop-shadow(0 8px 24px rgba(255,149,0,0.4))',
              }}
            />
          </div>

        </div>
      </div>
    </section>
  );
}