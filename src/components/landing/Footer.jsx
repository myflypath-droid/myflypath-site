import React from "react";

const STANDARD = "/images/mascotte/Standard.png";

export default function Footer() {
  return (
    <footer style={{ borderTop: '1px solid rgba(255,255,255,0.07)', background: 'rgba(255,255,255,0.02)' }}>
      <div className="max-w-7xl mx-auto px-5 py-12">
        <div className="flex flex-col md:flex-row items-center justify-between gap-6">

          {/* Logo */}
          <div className="flex items-center gap-2.5">
            <img src={STANDARD} alt="Checklou" className="w-8 h-8 object-contain" />
            <span className="font-bold text-lg tracking-tight text-white">
              My<span style={{ color: '#FF9500' }}>Fly</span>Path
            </span>
          </div>

          {/* Liens légaux */}
          <div className="flex flex-wrap items-center justify-center gap-x-6 gap-y-2 text-xs" style={{ color: 'rgba(255,255,255,0.4)' }}>
            <a href="/cgu" className="hover:text-white transition-colors duration-200">Conditions d'utilisation</a>
            <a href="/cgv" className="hover:text-white transition-colors duration-200">Conditions générales de vente</a>
            <a href="/confidentialite" className="hover:text-white transition-colors duration-200">Confidentialité</a>
            <a href="mailto:contact@myflypath.fr" className="hover:text-white transition-colors duration-200">contact@myflypath.fr</a>
          </div>

          {/* Copyright */}
          <p className="text-xs" style={{ color: 'rgba(255,255,255,0.25)' }}>
            © {new Date().getFullYear()} MyFlyPath SAS
          </p>
        </div>
      </div>
    </footer>
  );
}