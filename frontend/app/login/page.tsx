'use client';

import React, { useEffect, useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../services/api';
import { useAuthStore, UserProfile } from '../../store/authStore';
import { Brain, ArrowRight, Lock, Mail, AlertCircle } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { setAuth, isAuthenticated, initAuth } = useAuthStore();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    initAuth();
  }, []);

  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/dashboard');
    }
  }, [isAuthenticated, router]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg(null);

    if (!email.trim() || !password.trim()) {
      setErrorMsg('Please fill in both email and password.');
      return;
    }

    setIsLoading(true);

    try {
      const res = await fetchApi<{ user: UserProfile & { token: string } }>('/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email: email.trim(), password }),
      });

      setIsLoading(false);

      if (res.success && res.data?.user?.token) {
        setAuth(res.data.user, res.data.user.token);
        router.push('/dashboard');
      } else {
        setErrorMsg(res.message || 'Invalid email or password. Please try again.');
      }
    } catch (err: any) {
      setIsLoading(false);
      setErrorMsg(err.message || 'An unexpected error occurred. Please check network.');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col items-center justify-center p-4 relative overflow-hidden">
      {/* Background Glow Accents */}
      <div className="absolute -top-40 -left-40 w-96 h-96 bg-obsidian-purple/15 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-40 -right-40 w-96 h-96 bg-emerald-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* Main Login Card */}
      <div className="w-full max-w-md bg-obsidian-sidebar border border-obsidian-border p-8 rounded-2xl shadow-2xl z-10 space-y-6">
        {/* Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center gap-2 font-bold text-xl text-white hover:opacity-90">
            <div className="w-9 h-9 rounded-xl bg-obsidian-purple/20 border border-obsidian-purple/40 flex items-center justify-center text-obsidian-purple">
              <Brain size={20} />
            </div>
            <span>EXAM PREP <span className="text-obsidian-purple">AI</span></span>
          </Link>
          <h1 className="text-lg font-semibold text-white pt-2">Welcome Back</h1>
          <p className="text-xs text-obsidian-muted">Sign in to access your study repository and adaptive quizzes</p>
        </div>

        {/* Error Alert */}
        {errorMsg && (
          <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-lg flex items-start gap-2">
            <AlertCircle size={16} className="shrink-0 mt-0.5" />
            <span>{errorMsg}</span>
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleLogin} className="space-y-4">
          <div className="space-y-1">
            <label className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider">Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-2.5 text-obsidian-muted" size={16} />
              <input
                type="email"
                placeholder="student@examprep.ai"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-obsidian-bg border border-obsidian-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-obsidian-muted focus:outline-none focus:border-obsidian-purple"
              />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex justify-between items-center">
              <label className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider">Password</label>
            </div>
            <div className="relative">
              <Lock className="absolute left-3 top-2.5 text-obsidian-muted" size={16} />
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-obsidian-bg border border-obsidian-border rounded-lg pl-9 pr-3 py-2 text-xs text-white placeholder-obsidian-muted focus:outline-none focus:border-obsidian-purple"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-2.5 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-semibold rounded-lg border border-obsidian-purple/50 transition-all flex items-center justify-center gap-2 shadow-md disabled:opacity-50"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight size={14} />
          </button>
        </form>

        {/* Footer */}
        <div className="text-center text-xs text-obsidian-muted pt-2">
          Don't have an account?{' '}
          <Link href="/register" className="text-obsidian-purple font-semibold hover:underline">
            Create Account
          </Link>
        </div>
      </div>
    </div>
  );
}
