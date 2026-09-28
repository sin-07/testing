/**
 * National Testing Agency (NTA) & Govt of India Emblem Component
 * High-definition vector SVG assets for authentic national examination portal branding
 */

import React from 'react';

export function AshokaEmblem({ className = 'w-10 h-10', color = '#0f2942' }: { className?: string; color?: string }) {
  return (
    <svg viewBox="0 0 100 100" className={className} fill="none" xmlns="http://www.w3.org/2000/svg">
      {/* Outer decorative ring */}
      <circle cx="50" cy="50" r="46" stroke={color} strokeWidth="2.5" strokeDasharray="3 2" opacity="0.6" />
      <circle cx="50" cy="50" r="41" stroke={color} strokeWidth="1.5" />
      
      {/* 24-spoke Ashoka Chakra center */}
      <circle cx="50" cy="50" r="14" stroke={color} strokeWidth="2" fill="white" />
      <circle cx="50" cy="50" r="3" fill={color} />
      {Array.from({ length: 24 }).map((_, i) => {
        const angle = (i * 360) / 24;
        const rad = (angle * Math.PI) / 180;
        const x1 = 50 + 3 * Math.cos(rad);
        const y1 = 50 + 3 * Math.sin(rad);
        const x2 = 50 + 13 * Math.cos(rad);
        const y2 = 50 + 13 * Math.sin(rad);
        return <line key={i} x1={x1} y1={y1} x2={x2} y2={y2} stroke={color} strokeWidth="1" />;
      })}

      {/* Stylized National Emblem Base & Pillars */}
      <path
        d="M32 78H68C68 78 65 72 59 72H41C35 72 32 78 32 78Z"
        fill={color}
      />
      <rect x="36" y="80" width="28" height="4" rx="1" fill={color} />
      <circle cx="50" cy="75" r="2" fill="white" />
      
      {/* Stylized Emblem Crest Tops */}
      <path
        d="M44 26C44 22 47 18 50 18C53 18 56 22 56 26V32H44V26Z"
        fill={color}
      />
      <path
        d="M36 29C36 26 38 23 41 23C42 23 43 24 44 26V32H36V29Z"
        fill={color}
        opacity="0.85"
      />
      <path
        d="M64 29C64 26 62 23 59 23C58 23 57 24 56 26V32H64V29Z"
        fill={color}
        opacity="0.85"
      />
      
      {/* Subtle motto arc */}
      <path
        d="M30 87C42 90 58 90 70 87"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export function NtaLogoBadge({ className = 'h-11' }: { className?: string }) {
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <div className="relative flex items-center justify-center w-11 h-11 rounded-xl bg-gradient-to-br from-slate-900 via-blue-950 to-indigo-950 text-white shadow-md border border-white/20 shrink-0">
        <AshokaEmblem className="w-8 h-8" color="#f8fafc" />
        <span className="absolute -bottom-1 -right-1 px-1 py-0.2 bg-amber-500 text-slate-950 font-bold text-[8px] rounded font-mono leading-tight tracking-wider">
          NTA
        </span>
      </div>
      <div className="leading-tight">
        <div className="flex items-center gap-1.5">
          <span className="text-slate-900 font-extrabold text-sm sm:text-base tracking-tight font-heading">
            राष्ट्रीय परीक्षा एजेंसी
          </span>
          <span className="hidden sm:inline-block text-[10px] font-bold px-1.5 py-0.5 rounded bg-blue-100 text-blue-900">
            Govt. of India
          </span>
        </div>
        <div className="text-[11px] sm:text-xs font-semibold text-slate-600 tracking-tight">
          National Testing Agency
        </div>
        <div className="text-[9px] font-medium text-slate-400 uppercase tracking-widest hidden sm:block">
          Excellence in Assessment • JEE (Main) 2026
        </div>
      </div>
    </div>
  );
}

export function TricolorBar() {
  return (
    <div className="w-full h-1 flex">
      <div className="w-1/3 bg-[#FF9933]"></div>
      <div className="w-1/3 bg-white"></div>
      <div className="w-1/3 bg-[#138808]"></div>
    </div>
  );
}
