import React from "react";

export default function AppStoreBadge({ className = "", dark = true }) {
  return (
    <a
      href="https://apps.apple.com/ch/app/myflypath/id6762458884?l=en-GB"
      aria-label="Télécharger sur l'App Store"
      className={`inline-flex items-center gap-3 rounded-2xl px-5 py-3 transition-all duration-300 hover:scale-[1.03] active:scale-[0.98] ${
        dark
          ? "bg-foreground text-background hover:bg-foreground/90"
          : "bg-white text-foreground border border-border hover:border-foreground/30"
      } ${className}`}
    >
      <svg viewBox="0 0 24 24" className="w-8 h-8" fill="currentColor" aria-hidden="true">
        <path d="M17.05 20.28c-.98.95-2.05.8-3.08.35-1.09-.46-2.09-.48-3.24 0-1.44.62-2.2.44-3.06-.35C2.79 15.25 3.51 7.59 9.05 7.31c1.35.07 2.29.74 3.08.8 1.18-.24 2.31-.93 3.57-.84 1.51.12 2.65.72 3.4 1.8-3.12 1.87-2.38 5.98.48 7.13-.57 1.5-1.31 2.99-2.54 4.09zM12.03 7.25c-.15-2.23 1.66-4.07 3.74-4.25.29 2.58-2.34 4.5-3.74 4.25z" />
      </svg>
      <div className="flex flex-col items-start leading-tight">
        <span className="text-[10px] opacity-80">Télécharger sur l'</span>
        <span className="text-lg font-semibold tracking-tight">App Store</span>
      </div>
    </a>
  );
}