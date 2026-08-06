'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { HeroSpinningEmblem } from '../components/ui/HeroSpinningEmblem';
import { DemoModal } from '../components/ui/DemoModal';
import {
  Brain,
  Sparkles,
  FileText,
  RefreshCw,
  BarChart3,
  CheckCircle,
  ArrowRight,
  ShieldCheck,
  Zap,
  BookOpen,
  Folder,
  CheckCircle2,
  ChevronRight,
  Flame,
  Award,
  Play,
  X,
  Target,
  FolderTree,
  Bot,
  TrendingUp,
  Layers,
  Sparkle,
} from 'lucide-react';

export default function LandingPage() {
  const [isDemoModalOpen, setIsDemoModalOpen] = useState(false);
  const [mousePos, setMousePos] = useState({ x: -1000, y: -1000 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <div
      onMouseMove={handleMouseMove}
      className="min-h-screen bg-[#0B0F17] text-[#F8FAFC] flex flex-col font-sans selection:bg-indigo-600 selection:text-white relative overflow-hidden group"
    >
      {/* Interactive Cursor Spotlight Glow */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300 opacity-0 group-hover:opacity-100"
        style={{
          background: `radial-gradient(650px circle at ${mousePos.x}px ${mousePos.y}px, rgba(99, 102, 241, 0.14), rgba(6, 182, 212, 0.07) 40%, transparent 80%)`,
        }}
      />

      {/* Subtle Grid Background Pattern Overlay */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#1e293b20_1px,transparent_1px),linear-gradient(to_bottom,#1e293b20_1px,transparent_1px)] bg-[size:3.5rem_3.5rem] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none" />

      {/* Blurred Ambient Colorful Orbs */}
      <div className="absolute top-[-10%] left-[-5%] w-[650px] h-[500px] bg-indigo-600/15 rounded-full blur-[140px] pointer-events-none" />
      <div className="absolute top-[5%] right-[-5%] w-[600px] h-[500px] bg-cyan-500/10 rounded-full blur-[150px] pointer-events-none" />
      <div className="absolute top-[35%] left-[25%] w-[500px] h-[400px] bg-emerald-500/10 rounded-full blur-[160px] pointer-events-none" />

      {/* Navigation Bar */}
      <header className="border-b border-slate-800/80 bg-[#0F172A]/70 backdrop-blur-xl sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          {/* Left: Logo */}
          <Link href="/" className="flex items-center gap-2.5 font-bold text-lg text-white hover:opacity-95 transition-opacity">
            <div className="w-9 h-9 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 shadow-md shadow-indigo-500/10">
              <Brain size={20} />
            </div>
            <span className="tracking-tight font-extrabold text-xl">
              ExamPrep <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">AI</span>
            </span>
          </Link>

          {/* Center: Nav Items */}
          <nav className="hidden md:flex items-center gap-8 text-xs font-semibold text-slate-400">
            <a href="#features" className="hover:text-white transition-colors">Features</a>
            <a href="#pricing" className="hover:text-white transition-colors">Pricing</a>
            <a href="#roadmap" className="hover:text-white transition-colors">Roadmap</a>
            <a href="#documentation" className="hover:text-white transition-colors">Documentation</a>
          </nav>

          {/* Right: Auth Action Buttons */}
          <div className="flex items-center gap-3">
            <Link
              href="/login"
              className="px-4 py-2 rounded-xl text-xs font-semibold text-slate-300 hover:text-white hover:bg-slate-800/60 transition-colors border border-transparent hover:border-slate-700"
            >
              Login
            </Link>
            <Link
              href="/register"
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-bold border border-indigo-500/50 shadow-md shadow-indigo-600/20 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
            >
              <span>Get Started</span>
              <ArrowRight size={13} className="group-hover:translate-x-0.5 transition-transform" />
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-12 lg:pt-16 pb-20 px-6 z-10 max-w-7xl mx-auto w-full">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          {/* Left Side: Copy & CTAs */}
          <div className="lg:col-span-6 space-y-7 text-left">
            {/* Large Headline */}
            <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl font-extrabold text-white leading-[1.08] tracking-tight">
              Master Government Exams with{' '}
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-cyan-400 to-emerald-400">
                AI
              </span>
            </h1>

            {/* Supporting Text */}
            <p className="text-base sm:text-lg text-slate-400 leading-relaxed font-normal max-w-xl">
              Paste your study notes, generate unlimited unique quizzes, track your progress, and master every concept with personalized AI-powered revision.
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap gap-4 pt-1">
              <Link
                href="/register"
                className="inline-flex items-center gap-2.5 px-7 py-3.5 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-sm font-bold border border-indigo-500/60 shadow-xl shadow-indigo-600/25 hover:scale-[1.02] active:scale-[0.98] transition-all duration-200 group"
              >
                <span>Start Learning Free</span>
                <ArrowRight size={17} className="group-hover:translate-x-1 transition-transform" />
              </Link>

              <button
                onClick={() => setIsDemoModalOpen(true)}
                className="px-6 py-3.5 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs sm:text-sm font-medium border border-slate-700 transition-all flex items-center gap-2 hover:border-slate-500 group"
              >
                <div className="w-5 h-5 rounded-full bg-indigo-600/20 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
                  <Play size={10} className="fill-indigo-400 ml-0.5" />
                </div>
                <span>Watch Demo</span>
              </button>
            </div>

            {/* Small Trust Indicators Grid */}
            <div className="pt-4 grid grid-cols-2 gap-3 max-w-md text-xs text-slate-400 font-medium">
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Unlimited Quiz Generation</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Adaptive Revision</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>Free AI Powered</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                <span>No Credit Card Required</span>
              </div>
            </div>
          </div>

          {/* Right Side: Infinite Spinning Geometric Flower Emblem with Center Brand Core */}
          <div className="lg:col-span-6 relative flex justify-center items-center py-6">
            <HeroSpinningEmblem />
          </div>
        </div>
      </section>

      {/* Feature Cards Grid Section */}
      <section id="features" className="py-20 px-6 max-w-7xl mx-auto w-full space-y-12">
        <div className="text-center space-y-3 max-w-2xl mx-auto">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-indigo-600/10 border border-indigo-500/30 text-indigo-400 text-xs font-bold uppercase tracking-wider">
            <Sparkles size={13} /> Features Built for Aspirants
          </div>
          <h2 className="font-display text-3xl sm:text-4xl font-extrabold text-white tracking-tight">
            Engineered for Maximum Score & Retention
          </h2>
          <p className="text-xs sm:text-sm text-slate-400">
            Everything you need to transform static study notes into personalized competitive exam practice.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {/* Card 1 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-indigo-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <Brain size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">AI Quiz Generation</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Paste raw study notes or upload files to generate fresh, challenging multiple-choice questions matching exam paper standards.
            </p>
          </div>

          {/* Card 2 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-cyan-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <RefreshCw size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Smart Retry</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Target failed questions automatically with brand new reframed questions without repeating previous failed questions.
            </p>
          </div>

          {/* Card 3 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Target size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Concept Mastery</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Track concept-level accuracy tags across every subject chapter to pinpoint exact weak spots before the actual exam.
            </p>
          </div>

          {/* Card 4 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-indigo-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center text-indigo-400 group-hover:scale-110 transition-transform">
              <BarChart3 size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Progress Analytics</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Monitor daily test history, accuracy percentage, time spent per question, and maintain daily study streak badges.
            </p>
          </div>

          {/* Card 5 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-cyan-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-cyan-400 group-hover:scale-110 transition-transform">
              <FolderTree size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Folder Workspace</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Organize your preparation into hierarchical subject trees, nested sub-folders, and dedicated chapter learning hubs.
            </p>
          </div>

          {/* Card 6 */}
          <div className="bg-slate-900/80 border border-slate-800 p-7 rounded-2xl space-y-3 hover:border-emerald-500/60 transition-all hover:scale-[1.01] group">
            <div className="w-12 h-12 rounded-xl bg-emerald-500/20 border border-emerald-500/40 flex items-center justify-center text-emerald-400 group-hover:scale-110 transition-transform">
              <Bot size={22} />
            </div>
            <h3 className="text-lg font-bold text-white">Revision Assistant</h3>
            <p className="text-xs text-slate-400 leading-relaxed">
              Get personalized AI revision suggestions based on spaced repetition and weak topic tags to optimize study time.
            </p>
          </div>
        </div>
      </section>

      {/* Demo Modal */}
      {isDemoModalOpen && <DemoModal onClose={() => setIsDemoModalOpen(false)} />}

      {/* Footer */}
      <footer className="mt-auto border-t border-slate-800/80 bg-[#0F172A] py-8 px-6">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-4 text-xs text-slate-400">
          <div className="flex items-center gap-2 font-extrabold text-white text-sm">
            <Brain size={18} className="text-indigo-400" />
            <span>ExamPrep AI</span>
          </div>

          <div>© 2026 ExamPrep AI. All rights reserved.</div>

          <div className="flex gap-6 font-medium">
            <Link href="/login" className="hover:text-white transition-colors">Workspace</Link>
            <Link href="/login" className="hover:text-white transition-colors">Login</Link>
            <Link href="/register" className="hover:text-white transition-colors">Register</Link>
          </div>
        </div>
      </footer>
    </div>
  );
}
