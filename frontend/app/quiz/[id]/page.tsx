'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useQuizStore } from '../../../store/quizStore';
import {
  Clock,
  Bookmark,
  Flag,
  ChevronLeft,
  ChevronRight,
  CheckCircle2,
  ArrowLeft,
  AlertTriangle,
  HelpCircle,
} from 'lucide-react';

// ─── Submit Confirmation Modal ───────────────────────────────────────────────

interface SubmitModalProps {
  totalQuestions: number;
  answeredCount: number;
  flaggedCount: number;
  unansweredCount: number;
  onConfirm: () => void;
  onCancel: () => void;
}

function SubmitModal({
  totalQuestions,
  answeredCount,
  flaggedCount,
  unansweredCount,
  onConfirm,
  onCancel,
}: SubmitModalProps) {
  const allAnswered = unansweredCount === 0;
  const hasFlagged = flaggedCount > 0;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-[#0E1420] border border-slate-700/60 w-full max-w-md rounded-2xl shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="px-6 py-4 border-b border-slate-800 flex items-center gap-3">
          <div className="w-9 h-9 rounded-xl bg-indigo-600/15 border border-indigo-500/30 flex items-center justify-center shrink-0">
            <CheckCircle2 size={18} className="text-indigo-400" />
          </div>
          <div>
            <h2 className="text-sm font-bold text-white">Submit Quiz</h2>
            <p className="text-[11px] text-slate-400 mt-0.5">Review your progress before submitting</p>
          </div>
        </div>

        {/* Stats grid */}
        <div className="px-6 py-5 space-y-4">
          <div className="grid grid-cols-3 gap-3">
            <div className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 text-center">
              <div className="text-2xl font-bold text-white">{answeredCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Answered</div>
            </div>
            <div className={`border rounded-xl p-3.5 text-center ${unansweredCount > 0 ? 'bg-amber-500/10 border-amber-500/30' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className={`text-2xl font-bold ${unansweredCount > 0 ? 'text-amber-400' : 'text-slate-500'}`}>{unansweredCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Unanswered</div>
            </div>
            <div className={`border rounded-xl p-3.5 text-center ${flaggedCount > 0 ? 'bg-rose-500/10 border-rose-500/30' : 'bg-slate-900/80 border-slate-800'}`}>
              <div className={`text-2xl font-bold ${flaggedCount > 0 ? 'text-rose-400' : 'text-slate-500'}`}>{flaggedCount}</div>
              <div className="text-[10px] uppercase tracking-wider text-slate-400 mt-0.5">Flagged</div>
            </div>
          </div>

          {/* Progress bar */}
          <div>
            <div className="flex items-center justify-between text-xs text-slate-400 mb-1.5">
              <span>Completion</span>
              <span className="font-semibold text-white">{Math.round((answeredCount / totalQuestions) * 100)}%</span>
            </div>
            <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
              <div
                className="h-full bg-gradient-to-r from-indigo-600 to-indigo-400 rounded-full transition-all duration-500"
                style={{ width: `${(answeredCount / totalQuestions) * 100}%` }}
              />
            </div>
          </div>

          {/* Warnings */}
          {!allAnswered && (
            <div className="flex items-start gap-2.5 p-3 bg-amber-500/10 border border-amber-500/25 rounded-xl">
              <AlertTriangle size={15} className="text-amber-400 shrink-0 mt-0.5" />
              <p className="text-xs text-amber-300">
                You have <span className="font-bold">{unansweredCount} unanswered question{unansweredCount > 1 ? 's' : ''}</span>. Skipped questions will be marked incorrect.
              </p>
            </div>
          )}
          {hasFlagged && (
            <div className="flex items-start gap-2.5 p-3 bg-rose-500/10 border border-rose-500/25 rounded-xl">
              <HelpCircle size={15} className="text-rose-400 shrink-0 mt-0.5" />
              <p className="text-xs text-rose-300">
                You have <span className="font-bold">{flaggedCount} flagged question{flaggedCount > 1 ? 's' : ''}</span> marked for review. You can still go back and answer them.
              </p>
            </div>
          )}
          {allAnswered && !hasFlagged && (
            <div className="flex items-start gap-2.5 p-3 bg-emerald-500/10 border border-emerald-500/25 rounded-xl">
              <CheckCircle2 size={15} className="text-emerald-400 shrink-0 mt-0.5" />
              <p className="text-xs text-emerald-300 font-medium">All questions answered. You're ready to submit!</p>
            </div>
          )}
        </div>

        {/* Footer actions */}
        <div className="px-6 pb-5 flex gap-3">
          <button
            onClick={onCancel}
            className="flex-1 py-2.5 rounded-xl text-xs font-semibold text-slate-300 hover:text-white bg-slate-800/60 hover:bg-slate-800 border border-slate-700 transition-colors"
          >
            Keep Reviewing
          </button>
          <button
            onClick={onConfirm}
            className="flex-1 py-2.5 rounded-xl text-xs font-bold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 transition-colors shadow-lg shadow-indigo-900/30"
          >
            Submit Quiz
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── Quiz Runner Page ────────────────────────────────────────────────────────

export default function QuizRunnerPage() {
  const params = useParams();
  const router = useRouter();
  const quizId = params.id as string;

  const {
    currentQuiz,
    questions,
    currentQuestionIndex,
    userAnswers,
    bookmarkedQuestionIds,
    flaggedQuestionIds,
    elapsedSeconds,
    isLoading,
    loadQuiz,
    selectAnswer,
    toggleBookmark,
    toggleFlag,
    setCurrentIndex,
    incrementTimer,
  } = useQuizStore();

  const [showSubmitModal, setShowSubmitModal] = useState(false);

  useEffect(() => {
    if (quizId) {
      loadQuiz(quizId);
    }
  }, [quizId, loadQuiz]);

  // Timer Interval
  useEffect(() => {
    const timer = setInterval(() => {
      incrementTimer();
    }, 1000);
    return () => clearInterval(timer);
  }, [incrementTimer]);

  if (isLoading || !currentQuiz || questions.length === 0) {
    return (
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-obsidian-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-obsidian-muted">Loading Quiz Runner Engine...</p>
        </div>
      </div>
    );
  }

  const currentQ = questions[currentQuestionIndex];
  const selectedOption = userAnswers[currentQ._id];
  const isBookmarked = bookmarkedQuestionIds.has(currentQ._id);
  const isFlagged = flaggedQuestionIds.has(currentQ._id);

  const answeredCount = Object.keys(userAnswers).length;
  const unansweredCount = questions.length - answeredCount;
  const flaggedCount = flaggedQuestionIds.size;

  // Time format helper
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleConfirmSubmit = () => {
    setShowSubmitModal(false);
    router.push(`/quiz/${quizId}/result`);
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col h-screen overflow-hidden">

      {/* Submit Confirmation Modal */}
      {showSubmitModal && (
        <SubmitModal
          totalQuestions={questions.length}
          answeredCount={answeredCount}
          flaggedCount={flaggedCount}
          unansweredCount={unansweredCount}
          onConfirm={handleConfirmSubmit}
          onCancel={() => setShowSubmitModal(false)}
        />
      )}

      {/* Top Runner Header */}
      <header className="h-14 border-b border-obsidian-border bg-obsidian-sidebar px-6 flex items-center justify-between shrink-0">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.back()}
            className="p-1.5 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div>
            <h1 className="text-sm font-bold text-white truncate max-w-sm">
              {currentQuiz.title}
            </h1>
            <span className="text-[11px] text-obsidian-muted uppercase tracking-wider">
              {currentQuiz.difficulty} Difficulty
            </span>
          </div>
        </div>

        {/* Live Timer & Controls */}
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-obsidian-card border border-obsidian-border text-xs font-mono text-white">
            <Clock size={14} className="text-obsidian-purple" />
            <span>{formatTime(elapsedSeconds)}</span>
          </div>

          <button
            onClick={() => setShowSubmitModal(true)}
            className="px-4 py-1.5 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-medium rounded-lg border border-obsidian-border transition-colors shadow-sm"
          >
            Submit Quiz
          </button>
        </div>
      </header>

      {/* Main Runner Body */}
      <div className="flex-1 flex overflow-hidden">
        {/* Left Side Question Canvas */}
        <main className="flex-1 p-8 overflow-y-auto flex flex-col justify-between max-w-4xl mx-auto">
          <div className="space-y-6">
            {/* Progress & Quick Tools */}
            <div className="flex items-center justify-between border-b border-obsidian-border pb-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 bg-obsidian-card border border-obsidian-border text-obsidian-purple text-xs font-bold rounded-lg">
                  Question {currentQuestionIndex + 1} of {questions.length}
                </span>
                <span className="text-xs text-obsidian-muted px-2 py-0.5 rounded bg-obsidian-card/50 border border-obsidian-border">
                  {currentQ.conceptTag}
                </span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => toggleBookmark(currentQ._id)}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    isBookmarked
                      ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                      : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                  }`}
                  title="Bookmark Question"
                >
                  <Bookmark size={14} fill={isBookmarked ? 'currentColor' : 'none'} />
                </button>

                <button
                  onClick={() => toggleFlag(currentQ._id)}
                  className={`p-2 rounded-lg border text-xs flex items-center gap-1 transition-colors ${
                    isFlagged
                      ? 'bg-rose-500/20 text-rose-400 border-rose-500/40'
                      : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                  }`}
                  title="Flag for Review"
                >
                  <Flag size={14} fill={isFlagged ? 'currentColor' : 'none'} />
                </button>
              </div>
            </div>

            {/* Question Text Card */}
            <div className="bg-obsidian-card border border-obsidian-border p-6 rounded-xl space-y-3">
              <h2 className="text-base font-semibold text-white leading-relaxed">
                {currentQ.question}
              </h2>
            </div>

            {/* Options List */}
            <div className="space-y-3">
              {currentQ.options.map((optionText, idx) => {
                const isSelected = selectedOption === idx;
                const optionLabel = String.fromCharCode(65 + idx);

                return (
                  <div
                    key={idx}
                    onClick={() => selectAnswer(currentQ._id, idx)}
                    className={`p-4 rounded-xl border cursor-pointer transition-all flex items-center gap-4 ${
                      isSelected
                        ? 'bg-obsidian-hover border-obsidian-purple text-white shadow-md'
                        : 'bg-obsidian-card hover:bg-obsidian-hover border-obsidian-border text-obsidian-text'
                    }`}
                  >
                    <div
                      className={`w-7 h-7 rounded-lg flex items-center justify-center font-semibold text-xs transition-colors ${
                        isSelected
                          ? 'bg-obsidian-purple text-white'
                          : 'bg-obsidian-bg text-obsidian-muted border border-obsidian-border'
                      }`}
                    >
                      {optionLabel}
                    </div>
                    <div className="text-sm flex-1">{optionText}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Navigation Controls */}
          <div className="pt-6 border-t border-obsidian-border flex items-center justify-between mt-8">
            <button
              onClick={() => setCurrentIndex(currentQuestionIndex - 1)}
              disabled={currentQuestionIndex === 0}
              className="px-4 py-2 bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border text-xs font-medium rounded-lg text-white disabled:opacity-30 flex items-center gap-1.5 transition-colors"
            >
              <ChevronLeft size={16} /> Previous
            </button>

            <span className="text-xs text-obsidian-muted font-medium">
              {answeredCount} / {questions.length} Answered
            </span>

            {currentQuestionIndex < questions.length - 1 ? (
              <button
                onClick={() => setCurrentIndex(currentQuestionIndex + 1)}
                className="px-5 py-2 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-medium rounded-lg border border-obsidian-border flex items-center gap-1.5 transition-colors"
              >
                Next <ChevronRight size={16} />
              </button>
            ) : (
              <button
                onClick={() => setShowSubmitModal(true)}
                className="px-5 py-2 bg-obsidian-success text-white text-xs font-medium rounded-lg border border-obsidian-border flex items-center gap-1.5 transition-colors"
              >
                Submit Quiz <CheckCircle2 size={16} />
              </button>
            )}
          </div>
        </main>

        {/* Right Side Question Palette Grid */}
        <aside className="w-72 bg-obsidian-sidebar border-l border-obsidian-border p-4 flex flex-col shrink-0 overflow-y-auto">
          <h3 className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-3">
            Question Palette
          </h3>

          <div className="grid grid-cols-5 gap-2 mb-6">
            {questions.map((q, idx) => {
              const isAns = userAnswers[q._id] !== undefined;
              const isCurr = currentQuestionIndex === idx;
              const isBm = bookmarkedQuestionIds.has(q._id);
              const isFl = flaggedQuestionIds.has(q._id);

              let badgeStyle = 'bg-obsidian-card border-obsidian-border text-obsidian-muted';
              if (isAns) badgeStyle = 'bg-obsidian-success/20 border-obsidian-success text-obsidian-success';
              if (isFl) badgeStyle = 'bg-rose-500/20 border-rose-500 text-rose-400';
              if (isCurr) badgeStyle = 'bg-obsidian-purple text-white font-bold border-obsidian-purple ring-2 ring-obsidian-purple/40';

              return (
                <button
                  key={q._id}
                  onClick={() => setCurrentIndex(idx)}
                  className={`h-9 rounded-lg border text-xs font-medium flex items-center justify-center relative transition-all ${badgeStyle}`}
                >
                  <span>{idx + 1}</span>
                  {isBm && (
                    <span className="absolute -top-1 -right-1 w-2 h-2 rounded-full bg-amber-400" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Palette Legend */}
          <div className="mt-auto space-y-2 pt-4 border-t border-obsidian-border text-xs text-obsidian-muted">
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-obsidian-success/20 border border-obsidian-success" />
              <span>Answered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-obsidian-card border border-obsidian-border" />
              <span>Unanswered</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-3 h-3 rounded bg-rose-500/20 border border-rose-500" />
              <span>Flagged</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-amber-400" />
              <span>Bookmarked</span>
            </div>
          </div>

          {/* Sidebar submit shortcut */}
          <button
            onClick={() => setShowSubmitModal(true)}
            className="mt-4 w-full py-2 rounded-xl text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 transition-colors shadow-md"
          >
            Submit Quiz
          </button>
        </aside>
      </div>
    </div>
  );
}
