'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { useChapterStore } from '../../../store/chapterStore';
import { GenerateQuizModal } from '../../../components/quiz/GenerateQuizModal';
import { ConfirmModal } from '../../../components/ui/ConfirmModal';
import { fetchApi } from '../../../services/api';
import {
  FileText, Brain, ArrowLeft, Trash2, Calendar, BookOpen, Clock,
  Sparkles, Zap, Copy, Check, RefreshCw, ChevronRight,
} from 'lucide-react';

interface QuizSummary {
  _id: string;
  title: string;
  type: string;
  difficulty: string;
  questionCount: number;
  score: number | null;
  accuracy: number | null;
  createdAt: string;
}

interface QuickNote {
  en: string;
  bn: string;
}

// ─── Quick Notes Tab ────────────────────────────────────────────────────────

function QuickNotesTab({ chapterId, cachedNotes }: { chapterId: string; cachedNotes: QuickNote[] }) {
  const [notes, setNotes] = useState<QuickNote[]>(cachedNotes);
  const [lang, setLang] = useState<'en' | 'bn'>('en');
  const [isGenerating, setIsGenerating] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    setError(null);
    const res = await fetchApi<{ notes: QuickNote[] }>(`/chapters/${chapterId}/quick-notes`, {
      method: 'POST',
    });
    setIsGenerating(false);
    if (res.success && res.data?.notes) {
      setNotes(res.data.notes);
    } else {
      setError(res.message || 'Failed to generate notes. Try again.');
    }
  };

  const handleCopy = (text: string, idx: number) => {
    navigator.clipboard.writeText(text);
    setCopiedIndex(idx);
    setTimeout(() => setCopiedIndex(null), 1800);
  };

  const handleCopyAll = () => {
    const all = notes.map((n, i) => `${i + 1}. ${lang === 'en' ? n.en : n.bn}`).join('\n');
    navigator.clipboard.writeText(all);
  };

  return (
    <div className="space-y-4">
      {/* Header row */}
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div className="flex items-center gap-2">
          <Zap size={16} className="text-amber-400" />
          <span className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider">
            Quick Revision Notes
          </span>
          {notes.length > 0 && (
            <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-400/10 border border-amber-400/30 text-amber-400 font-semibold">
              {notes.length} notes
            </span>
          )}
        </div>

        <div className="flex items-center gap-2">
          {/* Language Toggle */}
          {notes.length > 0 && (
            <>
              <div className="flex items-center bg-obsidian-bg border border-obsidian-border rounded-lg p-0.5 text-xs">
                <button
                  onClick={() => setLang('en')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${lang === 'en' ? 'bg-obsidian-purple text-white' : 'text-obsidian-muted hover:text-white'}`}
                >
                  EN
                </button>
                <button
                  onClick={() => setLang('bn')}
                  className={`px-3 py-1.5 rounded-md font-semibold transition-all ${lang === 'bn' ? 'bg-indigo-500 text-white' : 'text-obsidian-muted hover:text-white'}`}
                >
                  বাং
                </button>
              </div>

              <button
                onClick={handleCopyAll}
                className="flex items-center gap-1.5 px-3 py-1.5 text-xs text-obsidian-muted hover:text-white bg-obsidian-card border border-obsidian-border rounded-lg hover:border-obsidian-purple transition-all"
              >
                <Copy size={12} /> Copy All
              </button>
            </>
          )}

          {/* Generate / Regenerate button */}
          <button
            onClick={handleGenerate}
            disabled={isGenerating}
            className="flex items-center gap-1.5 px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg transition-all disabled:opacity-50 shadow-sm"
          >
            {isGenerating ? (
              <><RefreshCw size={13} className="animate-spin" /> Generating...</>
            ) : notes.length > 0 ? (
              <><RefreshCw size={13} /> Regenerate</>
            ) : (
              <><Zap size={13} /> Generate Notes</>
            )}
          </button>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="p-3 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
          {error}
        </div>
      )}

      {/* Generating skeleton */}
      {isGenerating && (
        <div className="space-y-2">
          {Array.from({ length: 8 }).map((_, i) => (
            <div
              key={i}
              className="h-10 bg-obsidian-card border border-obsidian-border rounded-xl animate-pulse"
              style={{ opacity: 1 - i * 0.08 }}
            />
          ))}
        </div>
      )}

      {/* Empty state */}
      {!isGenerating && notes.length === 0 && (
        <div className="bg-obsidian-card border border-obsidian-border border-dashed rounded-xl p-10 text-center space-y-3">
          <div className="w-12 h-12 mx-auto rounded-2xl bg-amber-400/10 border border-amber-400/20 flex items-center justify-center">
            <Zap size={22} className="text-amber-400" />
          </div>
          <div className="text-sm font-semibold text-white">No quick notes yet</div>
          <p className="text-xs text-obsidian-muted max-w-xs mx-auto">
            Click <strong className="text-amber-400">Generate Notes</strong> and the AI will extract 15 key one-liners from this chapter — in English and Bengali — perfect for last-minute revision.
          </p>
        </div>
      )}

      {/* Notes list */}
      {!isGenerating && notes.length > 0 && (
        <div className="space-y-2">
          {lang === 'bn' && (
            <div className="flex items-center gap-2 p-2.5 bg-indigo-500/10 border border-indigo-500/20 rounded-lg text-[10px] text-indigo-300 font-medium">
              🇧🇩 বাংলায় দেখানো হচ্ছে
            </div>
          )}
          {notes.map((note, i) => (
            <div
              key={i}
              className="group flex items-start gap-3 p-3.5 bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border hover:border-amber-400/40 rounded-xl transition-all"
            >
              {/* Index badge */}
              <div className="shrink-0 w-6 h-6 rounded-md bg-amber-400/10 border border-amber-400/20 flex items-center justify-center text-[10px] font-bold text-amber-400">
                {i + 1}
              </div>

              {/* Note text */}
              <p className={`flex-1 text-sm text-obsidian-text leading-relaxed ${lang === 'bn' ? 'font-normal' : ''}`}
                style={lang === 'bn' ? { lineHeight: '1.75' } : {}}>
                {lang === 'en' ? note.en : note.bn}
              </p>

              {/* Copy icon */}
              <button
                onClick={() => handleCopy(lang === 'en' ? note.en : note.bn, i)}
                className="shrink-0 opacity-0 group-hover:opacity-100 p-1 rounded-md text-obsidian-muted hover:text-white transition-all"
                title="Copy note"
              >
                {copiedIndex === i ? (
                  <Check size={13} className="text-emerald-400" />
                ) : (
                  <Copy size={13} />
                )}
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// ─── Chapter Hub Page ────────────────────────────────────────────────────────

export default function ChapterHubPage() {
  const params = useParams();
  const router = useRouter();
  const chapterId = params.id as string;

  const { activeChapter, fetchChapterById, deleteChapter, isLoading } = useChapterStore();
  const [activeTab, setActiveTab] = useState<'notes' | 'quicknotes' | 'quizzes'>('notes');
  const [quizzes, setQuizzes] = useState<QuizSummary[]>([]);
  const [cachedNotes, setCachedNotes] = useState<QuickNote[]>([]);
  const [isQuizModalOpen, setIsQuizModalOpen] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [stats, setStats] = useState<{ totalQuizzes: number; completedQuizzes: number; averageScore: number | null }>({
    totalQuizzes: 0,
    completedQuizzes: 0,
    averageScore: null,
  });

  useEffect(() => {
    if (chapterId) {
      fetchChapterById(chapterId);

      fetchApi<{ chapter: any; stats: any; quizzes: QuizSummary[] }>(`/chapters/${chapterId}`).then((res) => {
        if (res.success && res.data) {
          setQuizzes(res.data.quizzes);
          setStats(res.data.stats);
          // Pre-load cached quick notes if they exist
          if (res.data.chapter?.quickNotes?.length > 0) {
            setCachedNotes(res.data.chapter.quickNotes);
          }
        }
      });
    }
  }, [chapterId, fetchChapterById]);

  if (isLoading || !activeChapter) {
    return (
      <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex items-center justify-center p-6">
        <div className="text-center space-y-3">
          <div className="w-8 h-8 border-2 border-obsidian-purple border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-sm text-obsidian-muted">Loading Chapter Hub...</p>
        </div>
      </div>
    );
  }

  const handleConfirmDeleteChapter = async () => {
    setIsDeleting(true);
    const success = await deleteChapter(activeChapter._id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
    if (success) {
      router.push('/dashboard');
    }
  };

  return (
    <div className="min-h-screen bg-obsidian-bg text-obsidian-text flex flex-col">
      {/* Top Header Navigation */}
      <header className="h-14 border-b border-obsidian-border bg-obsidian-sidebar px-6 flex items-center justify-between sticky top-0 z-10">
        <div className="flex items-center gap-3">
          <button
            onClick={() => router.push('/dashboard')}
            className="p-1.5 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <ArrowLeft size={18} />
          </button>
          <div className="flex items-center gap-2 text-sm text-obsidian-muted">
            <span>Chapter Hub</span>
            <span>/</span>
            <span className="text-white font-medium truncate max-w-xs">{activeChapter.title}</span>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => { setActiveTab('quicknotes'); }}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-black text-xs font-bold rounded-lg flex items-center gap-1.5 transition-colors"
          >
            <Zap size={14} />
            <span>Quick Notes</span>
          </button>
          <button
            onClick={() => setIsQuizModalOpen(true)}
            className="px-3.5 py-1.5 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-medium rounded-lg border border-obsidian-border flex items-center gap-1.5 transition-colors"
          >
            <Sparkles size={14} />
            <span>Generate AI Quiz</span>
          </button>
          <button
            onClick={() => setIsDeleteModalOpen(true)}
            className="p-1.5 text-obsidian-muted hover:text-obsidian-danger hover:bg-obsidian-hover rounded-lg transition-colors"
            title="Delete Chapter"
          >
            <Trash2 size={16} />
          </button>
        </div>
      </header>

      {/* Main Chapter Canvas */}
      <main className="flex-1 max-w-5xl w-full mx-auto p-6 space-y-6">
        {/* Chapter Header Banner */}
        <div className="bg-obsidian-card border border-obsidian-border p-6 rounded-xl space-y-4">
          <div className="flex items-start justify-between">
            <div className="space-y-1">
              <span className="inline-block px-2.5 py-0.5 rounded-full text-xs font-medium bg-obsidian-purple/20 text-obsidian-purple border border-obsidian-purple/30">
                {activeChapter.subject}
              </span>
              <h1 className="text-2xl font-bold text-white pt-1">{activeChapter.title}</h1>
              {activeChapter.description && (
                <p className="text-sm text-obsidian-muted">{activeChapter.description}</p>
              )}
            </div>

            {/* Quick Metrics */}
            <div className="flex gap-4 text-center">
              <div className="bg-obsidian-bg px-4 py-2 rounded-lg border border-obsidian-border">
                <div className="text-lg font-bold text-white">{stats.totalQuizzes}</div>
                <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider">Quizzes</div>
              </div>
              <div className="bg-obsidian-bg px-4 py-2 rounded-lg border border-obsidian-border">
                <div className="text-lg font-bold text-obsidian-success">
                  {stats.averageScore !== null ? `${stats.averageScore}%` : 'N/A'}
                </div>
                <div className="text-[10px] uppercase text-obsidian-muted font-medium tracking-wider">Avg Accuracy</div>
              </div>
            </div>
          </div>

          {/* Navigation Tabs */}
          <div className="flex border-b border-obsidian-border pt-2 gap-6 text-sm">
            <button
              onClick={() => setActiveTab('notes')}
              className={`pb-3 flex items-center gap-2 font-medium transition-colors border-b-2 ${
                activeTab === 'notes'
                  ? 'border-obsidian-purple text-white'
                  : 'border-transparent text-obsidian-muted hover:text-white'
              }`}
            >
              <FileText size={16} /> Study Notes
            </button>

            <button
              onClick={() => setActiveTab('quicknotes')}
              className={`pb-3 flex items-center gap-2 font-medium transition-colors border-b-2 ${
                activeTab === 'quicknotes'
                  ? 'border-amber-400 text-amber-400'
                  : 'border-transparent text-obsidian-muted hover:text-white'
              }`}
            >
              <Zap size={16} />
              Quick Notes
              {cachedNotes.length > 0 && (
                <span className="text-[9px] px-1.5 py-0.5 rounded-full bg-amber-400/20 border border-amber-400/30 text-amber-400 font-bold">
                  {cachedNotes.length}
                </span>
              )}
            </button>

            <button
              onClick={() => setActiveTab('quizzes')}
              className={`pb-3 flex items-center gap-2 font-medium transition-colors border-b-2 ${
                activeTab === 'quizzes'
                  ? 'border-obsidian-purple text-white'
                  : 'border-transparent text-obsidian-muted hover:text-white'
              }`}
            >
              <Brain size={16} /> AI Quizzes ({quizzes.length})
            </button>
          </div>
        </div>

        {/* Tab Body */}
        {activeTab === 'notes' && (
          <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6 space-y-4">
            <h2 className="text-sm font-semibold text-obsidian-muted uppercase tracking-wider flex items-center gap-2">
              <BookOpen size={16} className="text-obsidian-purple" /> Chapter Text Content
            </h2>
            <div className="bg-obsidian-bg border border-obsidian-border p-5 rounded-lg text-sm text-obsidian-text leading-relaxed whitespace-pre-wrap font-mono overflow-x-auto max-h-[60vh]">
              {activeChapter.content}
            </div>
          </div>
        )}

        {activeTab === 'quicknotes' && (
          <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-6">
            <QuickNotesTab chapterId={activeChapter._id} cachedNotes={cachedNotes} />
          </div>
        )}

        {activeTab === 'quizzes' && (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h2 className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider">
                Generated Quizzes
              </h2>
              <button
                onClick={() => setIsQuizModalOpen(true)}
                className="px-3 py-1 bg-obsidian-purple text-white text-xs rounded-lg hover:bg-obsidian-purpleHover transition-colors flex items-center gap-1"
              >
                <Sparkles size={12} /> New Quiz
              </button>
            </div>

            {quizzes.length === 0 ? (
              <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-8 text-center text-xs text-obsidian-muted space-y-2">
                <Brain className="mx-auto text-obsidian-purple opacity-60" size={32} />
                <div>No quizzes generated for this chapter yet.</div>
                <p>Click "Generate AI Quiz" to create your first question set.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {quizzes.map((q) => (
                  <div
                    key={q._id}
                    onClick={() => router.push(`/quiz/${q._id}`)}
                    className="bg-obsidian-card border border-obsidian-border p-4 rounded-xl hover:border-obsidian-purple cursor-pointer transition-all space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-medium px-2 py-0.5 rounded bg-obsidian-hover text-obsidian-purple border border-obsidian-border uppercase">
                        {q.difficulty}
                      </span>
                      <span className="text-xs text-obsidian-muted flex items-center gap-1">
                        <Clock size={12} /> {new Date(q.createdAt).toLocaleDateString()}
                      </span>
                    </div>

                    <div className="text-sm font-semibold text-white">{q.title}</div>
                    <div className="text-xs text-obsidian-muted flex justify-between pt-2 border-t border-obsidian-border">
                      <span>{q.questionCount} Questions</span>
                      <span className="font-semibold text-obsidian-success">
                        {q.score !== null ? `${q.score}% Score` : 'Take Quiz'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </main>

      {/* Quiz Modal */}
      <GenerateQuizModal
        isOpen={isQuizModalOpen}
        onClose={() => setIsQuizModalOpen(false)}
        chapterId={activeChapter._id}
        chapterTitle={activeChapter.title}
      />

      {/* Delete Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Chapter"
        message={`Are you sure you want to delete chapter "${activeChapter.title}"? All generated AI quizzes and topic analytics for this chapter will be permanently removed.`}
        confirmText="Delete Chapter"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteChapter}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
}
