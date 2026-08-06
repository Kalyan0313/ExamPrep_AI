'use client';

import React from 'react';
import { Brain, Sparkles } from 'lucide-react';

export const HeroSpinningEmblem: React.FC = () => {
  return (
    <div className="relative flex items-center justify-center w-full max-w-[500px] aspect-square mx-auto select-none pointer-events-none">
      {/* Background Soft Glow Orbs */}
      <div className="absolute inset-0 bg-gradient-to-tr from-indigo-600/30 via-cyan-500/20 to-emerald-500/20 rounded-full blur-[100px] animate-pulse" />

      {/* 1. Outer Slow Rotating Geometric Flower SVG */}
      <svg
        className="absolute inset-0 w-full h-full animate-[spin_45s_linear_infinite]"
        viewBox="0 0 500 500"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <defs>
          <linearGradient id="flowerGrad1" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#818CF8" stopOpacity="0.8" />
            <stop offset="50%" stopColor="#06B6D4" stopOpacity="0.8" />
            <stop offset="100%" stopColor="#10B981" stopOpacity="0.8" />
          </linearGradient>
          <linearGradient id="flowerGrad2" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#4F46E5" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#06B6D4" stopOpacity="0.2" />
          </linearGradient>
        </defs>

        {/* 12 Symmetrical Curved Flower Petals */}
        {[0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330].map((deg, i) => (
          <g key={deg} transform={`rotate(${deg} 250 250)`}>
            {/* Outer Petal Curve */}
            <path
              d="M250 250 C 220 100, 280 60, 250 20 C 220 60, 280 100, 250 250 Z"
              fill="url(#flowerGrad2)"
              stroke="url(#flowerGrad1)"
              strokeWidth="1.5"
              strokeLinecap="round"
            />
            {/* Inner Accent Leaf Arc */}
            <path
              d="M250 250 Q 200 140 250 80 Q 300 140 250 250 Z"
              fill="none"
              stroke="url(#flowerGrad1)"
              strokeWidth="1"
              strokeDasharray="4 4"
              opacity="0.6"
            />
          </g>
        ))}

        {/* Geometric Concentric Dashed Orbit Rings */}
        <circle cx="250" cy="250" r="210" stroke="url(#flowerGrad1)" strokeWidth="1" strokeDasharray="6 8" opacity="0.5" />
        <circle cx="250" cy="250" r="170" stroke="#06B6D4" strokeWidth="1" strokeDasharray="3 6" opacity="0.4" />
      </svg>

      {/* 2. Inner Counter-Rotating Lotus/Geometric Ring */}
      <svg
        className="absolute inset-12 w-[calc(100%-6rem)] h-[calc(100%-6rem)] animate-[spin_30s_linear_infinite_reverse]"
        viewBox="0 0 400 400"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {[0, 45, 90, 135, 180, 225, 270, 315].map((deg) => (
          <g key={deg} transform={`rotate(${deg} 200 200)`}>
            <circle cx="200" cy="90" r="45" stroke="#818CF8" strokeWidth="1.5" fill="none" opacity="0.35" />
            <path d="M200 200 L200 40" stroke="url(#flowerGrad1)" strokeWidth="1" opacity="0.3" />
          </g>
        ))}
      </svg>

      {/* 3. Center Static/Glow Brand Emblem */}
      <div className="relative z-10 w-36 h-36 sm:w-44 sm:h-44 rounded-full bg-[#0F172A]/90 border-2 border-indigo-500/50 flex flex-col items-center justify-center p-4 text-center shadow-2xl backdrop-blur-xl shadow-indigo-600/40 group">
        <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-tr from-indigo-600 to-cyan-500 p-0.5 shadow-lg shadow-indigo-600/40 mb-2 animate-bounce-subtle">
          <div className="w-full h-full bg-[#0B0F17] rounded-[14px] flex items-center justify-center text-indigo-400">
            <Brain size={30} className="text-indigo-400" />
          </div>
        </div>

        <div className="text-xs sm:text-sm font-extrabold text-white tracking-tight">
          ExamPrep <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">AI</span>
        </div>
        <div className="text-[10px] text-slate-400 font-semibold uppercase tracking-wider mt-0.5 flex items-center gap-1">
          <Sparkles size={10} className="text-cyan-400" /> Smart Learning
        </div>
      </div>
    </div>
  );
};
