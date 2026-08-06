'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuizStore } from '../../../../store/quizStore';
import { fetchApi } from '../../../../services/api';
import {
  Trophy,
  CheckCircle2,
  XCircle,
  Clock,
  RotateCcw,
  Sparkles,
  ArrowLeft,
  ChevronDown,
  ChevronUp,
  AlertTriangle,
} from 'lucide-react';

interface QuestionReview {
  _id: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  conceptTag: string;
  userAnswer?: number | null;
  isCorrect?: boolean | null;
}

interface ResultSummary {
  quizId: string;
  title: string;
  totalQuestions: number;
  correctCount: number;
  wrongCount: number;
  accuracy: number;
  score: number;
  timeTakenSeconds: number;
  weakConcepts: string[];
  strongConcepts: string[];
  currentStreak: number;
}

export default function QuizResultPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const { userAnswers, elapsedSeconds } = useQuizStore();

  const [summary, setSummary] = useState<ResultSummary | null>(null);
  const [questions, setQuestions] = useState<QuestionReview[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedQId, setExpandedQId] = useState<string | null>(null);
  const [isGeneratingRetry, setIsGeneratingRetry] = useState(false);

  useEffect(() => {
    if (quizId) {
      // Submit quiz answers to backend
      fetchApi<{ summary: ResultSummary; questions: QuestionReview[] }>('/quizzes/submit', {
        method: 'POST',
        body: JSON.stringify({
          quizId,
          userAnswers,
          timeTakenSeconds: elapsedSeconds,
        }),
      }).then((res) => {
        if (res.success && res.data) {
          setSummary(res.data.summary);
          setQuestions(res.data.questions);
        }
        setIsLoading(false);
      });
    }
  }, [quizId, userAnswers, elapsedSeconds]);

  if (isLoading || !summary) {
    return (
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-obsidian-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-obsidian-muted">Evaluating Quiz Answers & Computing Analytics...</p>
        </div>
      </div>
    );
  }

  const handleRetryQuiz = async () => {
    setIsGeneratingRetry(true);
    const res = await fetchApi<{ quiz: { _id: string } }>('/quizzes/retry', {
      method: 'POST',
      body: JSON.stringify({ quizId }),
    });

    setIsGeneratingRetry(false);
    if (res.success && res.data) {
      router.push(`/quiz/${res.data.quiz._id}`);
    } else {
      alert(res.message || 'Failed to generate retry quiz');
    }
  };

  const formatTime = (sec: number) => {
    const m = Math.floor(sec / 60);
    const s = sec % 60;
    return `${m}m ${s}s`;
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col">
      {/* Top Header */}
      <header className="h-14 border-b border-obsidian-border bg-obsidian-sidebar px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <span className="text-sm font-bold text-white">Quiz Result & Performance Analysis</span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => router.push('/dashboard')}
            className="px-3.5 py-1.5 bg-obsidian-card hover:bg-obsidian-hover text-white text-xs font-medium rounded-lg border border-obsidian-border transition-colors"
          >
            Back to Workspace
          </button>
        </div>
      </header>

      {/* Main Container */}
      <main className="flex-1 max-w-4xl w-full mx-auto p-6 space-y-6">
        {/* Banner Card */}
        <div className="bg-obsidian-card border border-obsidian-border p-6 rounded-xl space-y-4 text-center relative overflow-hidden">
          <div className="inline-flex items-center justify-center p-3 rounded-full bg-obsidian-purple/20 text-obsidian-purple mb-2">
            <Trophy size={32} />
          </div>

          <h1 className="text-2xl font-bold text-white">{summary.title}</h1>

          {/* Metrics Grid */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
            <div className="bg-obsidian-bg p-3.5 rounded-lg border border-obsidian-border">
              <div className="text-2xl font-bold text-obsidian-purple">{summary.score}%</div>
              <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider mt-0.5">Accuracy</div>
            </div>

            <div className="bg-obsidian-bg p-3.5 rounded-lg border border-obsidian-border">
              <div className="text-2xl font-bold text-obsidian-success">{summary.correctCount} / {summary.totalQuestions}</div>
              <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider mt-0.5">Correct Answers</div>
            </div>

            <div className="bg-obsidian-bg p-3.5 rounded-lg border border-obsidian-border">
              <div className="text-2xl font-bold text-rose-400">{summary.wrongCount}</div>
              <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider mt-0.5">Wrong / Skipped</div>
            </div>

            <div className="bg-obsidian-bg p-3.5 rounded-lg border border-obsidian-border">
              <div className="text-2xl font-bold text-white flex items-center justify-center gap-1">
                <Clock size={18} className="text-obsidian-muted" />
                <span>{formatTime(summary.timeTakenSeconds)}</span>
              </div>
              <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider mt-0.5">Time Taken</div>
            </div>
          </div>

          {/* Action Triggers */}
          <div className="pt-3 flex flex-wrap justify-center gap-3">
            <button
              onClick={handleRetryQuiz}
              disabled={isGeneratingRetry || summary.weakConcepts.length === 0}
              className="px-5 py-2.5 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-medium rounded-lg border border-obsidian-border flex items-center gap-2 transition-colors shadow-sm disabled:opacity-50"
            >
              <RotateCcw size={14} />
              <span>{isGeneratingRetry ? 'Generating Retry Quiz...' : 'Retry Weak Concepts'}</span>
            </button>
          </div>
        </div>

        {/* Concept Mastery Breakdown */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {/* Weak Concepts Card */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl space-y-3">
            <h2 className="text-xs font-semibold text-rose-400 uppercase tracking-wider flex items-center gap-1.5">
              <AlertTriangle size={15} /> Weak Concepts ({summary.weakConcepts.length})
            </h2>
            {summary.weakConcepts.length === 0 ? (
              <div className="text-xs text-obsidian-muted">Great job! No weak concepts identified.</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.weakConcepts.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>

          {/* Strong Concepts Card */}
          <div className="bg-obsidian-card border border-obsidian-border p-5 rounded-xl space-y-3">
            <h2 className="text-xs font-semibold text-obsidian-success uppercase tracking-wider flex items-center gap-1.5">
              <CheckCircle2 size={15} /> Strong Concepts ({summary.strongConcepts.length})
            </h2>
            {summary.strongConcepts.length === 0 ? (
              <div className="text-xs text-obsidian-muted">Keep practicing to build topic mastery!</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {summary.strongConcepts.map((tag) => (
                  <span
                    key={tag}
                    className="px-2.5 py-1 rounded bg-obsidian-success/10 border border-obsidian-success/30 text-obsidian-success text-xs"
                  >
                    {tag}
                  </span>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Detailed Question Explanations List */}
        <div className="space-y-4">
          <h2 className="text-sm font-bold text-white uppercase tracking-wider">
            Detailed Question Review & Explanations ({questions.length})
          </h2>

          <div className="space-y-3">
            {questions.map((q, idx) => {
              const isExpanded = expandedQId === q._id;
              const isCorrect = q.isCorrect;

              return (
                <div
                  key={q._id}
                  className={`bg-obsidian-card border rounded-xl overflow-hidden transition-all ${
                    isCorrect
                      ? 'border-obsidian-border'
                      : 'border-rose-500/40 bg-rose-500/5'
                  }`}
                >
                  <div
                    onClick={() => setExpandedQId(isExpanded ? null : q._id)}
                    className="p-4 flex items-center justify-between cursor-pointer hover:bg-obsidian-hover transition-colors"
                  >
                    <div className="flex items-center gap-3 overflow-hidden">
                      {isCorrect ? (
                        <CheckCircle2 className="text-obsidian-success shrink-0" size={18} />
                      ) : (
                        <XCircle className="text-rose-400 shrink-0" size={18} />
                      )}

                      <div className="overflow-hidden">
                        <div className="text-sm font-medium text-white truncate">
                          Q{idx + 1}. {q.question}
                        </div>
                        <span className="text-[11px] text-obsidian-muted">{q.conceptTag}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`text-xs font-semibold px-2 py-0.5 rounded ${
                          isCorrect ? 'bg-obsidian-success/20 text-obsidian-success' : 'bg-rose-500/20 text-rose-400'
                        }`}
                      >
                        {isCorrect ? 'Correct' : 'Incorrect'}
                      </span>
                      {isExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                    </div>
                  </div>

                  {/* Expanded Explanation Panel */}
                  {isExpanded && (
                    <div className="p-4 border-t border-obsidian-border bg-obsidian-bg space-y-3">
                      <div className="space-y-2">
                        {q.options.map((optText, optIdx) => {
                          const isUserPick = q.userAnswer === optIdx;
                          const isCorrectAns = q.correctAnswer === optIdx;

                          let style = 'border-obsidian-border text-obsidian-muted bg-obsidian-card';
                          if (isCorrectAns) style = 'border-obsidian-success text-obsidian-success bg-obsidian-success/10 font-semibold';
                          if (isUserPick && !isCorrectAns) style = 'border-rose-500 text-rose-400 bg-rose-500/10 font-semibold';

                          return (
                            <div key={optIdx} className={`p-3 rounded-lg border text-xs flex items-center justify-between ${style}`}>
                              <span>
                                {String.fromCharCode(65 + optIdx)}. {optText}
                              </span>
                              {isCorrectAns && <span className="text-[10px] uppercase font-bold">Correct Answer</span>}
                              {isUserPick && !isCorrectAns && <span className="text-[10px] uppercase font-bold">Your Choice</span>}
                            </div>
                          );
                        })}
                      </div>

                      <div className="p-3 bg-obsidian-card border border-obsidian-border rounded-lg text-xs space-y-1">
                        <div className="font-semibold text-obsidian-purple uppercase tracking-wider">AI Step-by-Step Explanation:</div>
                        <p className="text-obsidian-text leading-relaxed">{q.explanation}</p>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </main>
    </div>
  );
}
