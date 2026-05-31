import React, { useEffect, useState } from "react";

const STANDARD = "/images/mascotte/Standard.png";

export default function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const t = setTimeout(() => setVisible(true), 50);
    const onScroll = () => setScrolled(window.scrollY > 30);
    window.addEventListener("scroll", onScroll);
    return () => {
      clearTimeout(t);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <header
      className={`fixed top-0 inset-x-0 z-50 transition-all duration-500 ${
        scrolled ? "glass-dark border-b border-white/8" : "bg-transparent"
      }`}
      style={{
        opacity: visible ? 1 : 0,
        transform: visible ? 'translateY(0)' : 'translateY(-20px)',
        transition: 'opacity 0.6s ease, transform 0.6s ease, background 0.5s ease',
        willChange: 'opacity, transform',
      }}
    >
      <nav className="max-w-7xl mx-auto px-5 h-16 flex items-center justify-between">
        <a href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB" className="flex items-center gap-2.5">
          <img src={STANDARD} alt="Checklou" className="w-9 h-9 object-contain" />
          <span className="font-bold text-xl tracking-tight text-white">
            My<span style={{ color: '#FF9500' }}>Fly</span>Path
          </span>
        </a>

        <ul className="hidden md:flex items-center gap-7">
          {[
            ["PPL", "#training"],
            ["IFR", "#ifr"],
            ["LogBook", "#logbook"],
            ["My Univers", "#myunivers"],
            ["Tarifs", "#pricing"],
            ["Contact", "#contact"],
          ].map(([label, href]) => (
            <li key={href}>
              <a href={href} className="text-sm text-white/60 hover:text-white transition-colors duration-200 font-medium">
                {label}
              </a>
            </li>
          ))}
        </ul>

        <a
          href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
          className="inline-flex items-center gap-2 text-sm font-semibold px-5 py-2.5 rounded-full transition-transform duration-200 hover:scale-[1.04] active:scale-[0.97]"
          style={{ background: '#FF9500', color: '#000' }}
        >
          <svg viewBox="0 0 24 24" className="w-4 h-4" fill="currentColor">
            <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z"/>
          </svg>
          App Store
        </a>
      </nav>
    </header>
  );
}
