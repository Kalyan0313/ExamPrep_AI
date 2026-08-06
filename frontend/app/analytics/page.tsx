'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { fetchApi } from '../../services/api';
import {
  Flame,
  BarChart3,
  CheckCircle2,
  AlertTriangle,
  BookOpen,
  Brain,
  ArrowLeft,
  Target,
  Clock,
} from 'lucide-react';

interface AnalyticsData {
  totalChapters: number;
  totalQuizzes: number;
  totalQuestionsSolved: number;
  overallAccuracy: number;
  currentStreak: number;
  weakSubjects: Array<{ conceptTag: string; accuracy: number; count: number }>;
  strongSubjects: Array<{ conceptTag: string; accuracy: number; count: number }>;
}

export default function AnalyticsPage() {
  const router = useRouter();
  const [data, setData] = useState<AnalyticsData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchApi<{ analytics: AnalyticsData }>('/analytics/dashboard').then((res) => {
      if (res.success && res.data) {
        setData(res.data.analytics);
      }
      setIsLoading(false);
    });
  }, []);

  if (isLoading || !data) {
    return (
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-obsidian-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-obsidian-muted">Loading Analytics Dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col">
      {/* Header */}
      <header className="h-14 border-b border-obsidian-border bg-obsidian-sidebar px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-bold text-white flex items-center gap-2">
            <BarChart3 className="text-obsidian-purple" size={18} /> Performance Analytics & Streaks
          </span>
        </div>

        <button
          onClick={() => router.push('/dashboard')}
          className="px-3.5 py-1.5 bg-obsidian-card hover:bg-obsidian-hover text-white text-xs font-medium rounded-lg border border-obsidian-border transition-colors"
        >
          Back to Workspace
        </button>
      </header>

      {/* Main Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Streak & Top Stats Banner */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {/* Streak Card */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-orange-500/20 text-orange-400 border border-orange-500/30">
              <Flame size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{data.currentStreak} Days</div>
              <div className="text-xs text-obsidian-muted font-medium">Daily Streak 🔥</div>
            </div>
          </div>

          {/* Overall Accuracy */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-obsidian-purple/20 text-obsidian-purple border border-obsidian-purple/30">
              <Target size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{data.overallAccuracy}%</div>
              <div className="text-xs text-obsidian-muted font-medium">Overall Accuracy</div>
            </div>
          </div>

          {/* Solved Count */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-obsidian-success/20 text-obsidian-success border border-obsidian-success/30">
              <CheckCircle2 size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{data.totalQuestionsSolved}</div>
              <div className="text-xs text-obsidian-muted font-medium">Questions Solved</div>
            </div>
          </div>

          {/* Total Chapters & Quizzes */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl flex items-center gap-4">
            <div className="p-3 rounded-xl bg-blue-500/20 text-blue-400 border border-blue-500/30">
              <Brain size={28} />
            </div>
            <div>
              <div className="text-2xl font-bold text-white">{data.totalQuizzes}</div>
              <div className="text-xs text-obsidian-muted font-medium">Quizzes Completed</div>
            </div>
          </div>
        </div>

        {/* Concept Mastery Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Weak Concepts */}
          <div className="bg-obsidian-card border border-obsidian-border p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-2">
                <AlertTriangle size={16} /> Weak Concept Areas ({data.weakSubjects.length})
              </h2>
            </div>

            {data.weakSubjects.length === 0 ? (
              <div className="text-xs text-obsidian-muted p-4 text-center bg-obsidian-bg rounded-lg border border-obsidian-border">
                No weak concepts identified! Keep up the practice.
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.weakSubjects.map((item) => (
                  <div
                    key={item.conceptTag}
                    className="p-3 bg-obsidian-bg border border-obsidian-border rounded-lg flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-white">{item.conceptTag}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-obsidian-muted">{item.count} Questions</span>
                      <span className="font-bold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                        {item.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Strong Concepts */}
          <div className="bg-obsidian-card border border-obsidian-border p-6 rounded-xl space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-sm font-semibold text-obsidian-success uppercase tracking-wider flex items-center gap-2">
                <CheckCircle2 size={16} /> Mastered Concept Areas ({data.strongSubjects.length})
              </h2>
            </div>

            {data.strongSubjects.length === 0 ? (
              <div className="text-xs text-obsidian-muted p-4 text-center bg-obsidian-bg rounded-lg border border-obsidian-border">
                Solve more quizzes to discover your mastered concepts.
              </div>
            ) : (
              <div className="space-y-2.5">
                {data.strongSubjects.map((item) => (
                  <div
                    key={item.conceptTag}
                    className="p-3 bg-obsidian-bg border border-obsidian-border rounded-lg flex items-center justify-between text-xs"
                  >
                    <span className="font-medium text-white">{item.conceptTag}</span>
                    <div className="flex items-center gap-3">
                      <span className="text-obsidian-muted">{item.count} Questions</span>
                      <span className="font-bold text-obsidian-success bg-obsidian-success/10 px-2 py-0.5 rounded border border-obsidian-success/20">
                        {item.accuracy}% Accuracy
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
