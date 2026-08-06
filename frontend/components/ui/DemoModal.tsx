'use client';

import React, { useEffect, useRef, useState } from 'react';
import Link from 'next/link';
import { X, Brain, Sparkles, CheckCircle2, ChevronRight, ChevronLeft, BookOpen, RotateCcw, ArrowRight } from 'lucide-react';

interface DemoModalProps {
  onClose: () => void;
}

const DEMO_STEPS = ['Paste Notes', 'AI Generates', 'Take Quiz', 'Review & Retry'];

const SAMPLE_TEXT = `The Indian National Congress (INC) was founded in 1885 by A.O. Hume, a retired British civil servant. The first session was held in Bombay under the presidency of W.C. Bonnerjee. Initially, the Congress followed a policy of moderate politics, seeking reforms through constitutional means. The Partition of Bengal in 1905 by Lord Curzon proved to be a turning point, giving rise to the extremist faction led by Bal Gangadhar Tilak, Lala Lajpat Rai, and Bipin Chandra Pal — collectively known as the Lal-Bal-Pal trio. The Swadeshi Movement emerged as a direct response to the partition.`;

const GENERATED_QUESTIONS = [
  {
    q: 'Who founded the Indian National Congress in 1885?',
    options: ['Bal Gangadhar Tilak', 'W.C. Bonnerjee', 'A.O. Hume', 'Lala Lajpat Rai'],
    correct: 2,
    explanation: 'A.O. Hume, a retired British ICS officer, founded the INC in 1885 with the aim of creating a platform for civic and political dialogue.',
  },
  {
    q: 'The Partition of Bengal in 1905 was carried out by which Viceroy?',
    options: ['Lord Dalhousie', 'Lord Ripon', 'Lord Curzon', 'Lord Mountbatten'],
    correct: 2,
    explanation: 'Lord Curzon partitioned Bengal in 1905, claiming administrative reasons. The move ignited widespread nationalist outrage and the Swadeshi Movement.',
  },
  {
    q: 'Which movement emerged as a direct response to the Partition of Bengal?',
    options: ['Non-Cooperation Movement', 'Swadeshi Movement', 'Civil Disobedience Movement', 'Quit India Movement'],
    correct: 1,
    explanation: 'The Swadeshi Movement called for the boycott of British goods and promotion of Indian-made products as a protest against the partition.',
  },
];

export function DemoModal({ onClose }: DemoModalProps) {
  const [step, setStep] = useState(0);
  const [typedText, setTypedText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionsReady, setQuestionsReady] = useState(false);
  const [selectedAnswers, setSelectedAnswers] = useState<Record<number, number>>({});
  const [submitted, setSubmitted] = useState(false);
  const [showRetry, setShowRetry] = useState(false);
  const typingRef = useRef<ReturnType<typeof setInterval> | null>(null);

  // Step 0: auto-type the sample text
  useEffect(() => {
    if (step !== 0) return;
    setTypedText('');
    setIsTyping(true);
    let i = 0;
    typingRef.current = setInterval(() => {
      i++;
      setTypedText(SAMPLE_TEXT.slice(0, i));
      if (i >= SAMPLE_TEXT.length) {
        clearInterval(typingRef.current!);
        setIsTyping(false);
      }
    }, 18);
    return () => clearInterval(typingRef.current!);
  }, [step]);

  // Step 1: simulate AI generating
  useEffect(() => {
    if (step !== 1) return;
    setIsGenerating(true);
    setQuestionsReady(false);
    const t = setTimeout(() => {
      setIsGenerating(false);
      setQuestionsReady(true);
    }, 2200);
    return () => clearTimeout(t);
  }, [step]);

  // Step 3 retry reveal
  useEffect(() => {
    if (step !== 3) return;
    setShowRetry(false);
    const t = setTimeout(() => setShowRetry(true), 600);
    return () => clearTimeout(t);
  }, [step]);

  const score = GENERATED_QUESTIONS.filter((q, i) => selectedAnswers[i] === q.correct).length;
  const wrongIndices = GENERATED_QUESTIONS.map((q, i) => selectedAnswers[i] !== q.correct ? i : -1).filter(i => i !== -1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-3">
      <div className="bg-[#0E1420] border border-slate-700/60 w-full max-w-3xl rounded-2xl shadow-2xl flex flex-col overflow-hidden max-h-[92vh]">

        {/* Header */}
        <div className="flex items-center justify-between px-5 py-3.5 border-b border-slate-800 shrink-0">
          <div className="flex items-center gap-2">
            <div className="w-7 h-7 rounded-lg bg-indigo-600/20 border border-indigo-500/40 flex items-center justify-center">
              <Brain size={15} className="text-indigo-400" />
            </div>
            <span className="text-sm font-bold text-white">ExamPrep AI — Live Demo</span>
          </div>
          <div className="flex items-center gap-4">
            {/* Step pills */}
            <div className="hidden sm:flex items-center gap-1.5">
              {DEMO_STEPS.map((label, i) => (
                <button
                  key={i}
                  onClick={() => { if (i < step || (i === 1 && typedText.length > 10)) setStep(i); }}
                  className={`px-2.5 py-1 rounded-full text-[10px] font-semibold transition-all ${
                    i === step
                      ? 'bg-indigo-600 text-white'
                      : i < step
                        ? 'bg-slate-700 text-slate-300'
                        : 'bg-slate-800/60 text-slate-600'
                  }`}
                >
                  {i + 1}. {label}
                </button>
              ))}
            </div>
            <button onClick={onClose} className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800">
              <X size={16} />
            </button>
          </div>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto p-5">

          {/* ── STEP 0: Paste Notes ─────────────────────────────── */}
          {step === 0 && (
            <div className="space-y-3">
              <div className="flex items-center gap-2 mb-1">
                <BookOpen size={15} className="text-indigo-400" />
                <span className="text-xs font-semibold text-white">Step 1 — Paste your study notes</span>
              </div>
              <div className="bg-slate-950 border border-slate-800 rounded-xl p-4 min-h-[180px] font-mono text-xs text-slate-300 leading-relaxed relative">
                {typedText}
                {isTyping && <span className="inline-block w-0.5 h-3.5 bg-indigo-400 ml-0.5 animate-pulse align-middle" />}
              </div>
              <div className="flex items-center justify-between text-xs text-slate-500">
                <span>{typedText.length} / {SAMPLE_TEXT.length} chars</span>
                {!isTyping && <span className="text-emerald-400 font-medium flex items-center gap-1"><CheckCircle2 size={12} /> Ready to generate</span>}
              </div>

              {/* Chapter config row */}
              <div className="grid grid-cols-3 gap-2 pt-1">
                {[['Subject', 'Modern History'], ['Difficulty', 'Mixed'], ['Questions', '3']].map(([label, val]) => (
                  <div key={label} className="bg-slate-900 border border-slate-800 rounded-lg p-2.5">
                    <div className="text-[9px] font-semibold text-slate-500 uppercase mb-1">{label}</div>
                    <div className="text-xs font-semibold text-white">{val}</div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* ── STEP 1: AI Generating ───────────────────────────── */}
          {step === 1 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Sparkles size={15} className="text-indigo-400" />
                <span className="text-xs font-semibold text-white">Step 2 — AI generates unique questions</span>
              </div>

              {isGenerating ? (
                <div className="flex flex-col items-center justify-center py-12 gap-4">
                  <div className="relative w-14 h-14">
                    <div className="w-14 h-14 rounded-full border-2 border-indigo-600/20 border-t-indigo-500 animate-spin" />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Brain size={20} className="text-indigo-400" />
                    </div>
                  </div>
                  <div className="text-center space-y-1">
                    <p className="text-sm font-semibold text-white">Gemini AI is thinking...</p>
                    <p className="text-xs text-slate-400">Generating 3 unique questions from your notes</p>
                  </div>
                  <div className="flex gap-1.5 mt-2">
                    {['Analyzing context', 'Crafting distractors', 'Finalizing explanations'].map((t, i) => (
                      <span key={i} className="px-2 py-0.5 rounded-full bg-indigo-600/10 border border-indigo-500/20 text-[10px] text-indigo-300">{t}</span>
                    ))}
                  </div>
                </div>
              ) : questionsReady ? (
                <div className="space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 text-xs font-semibold">
                    <CheckCircle2 size={14} /> 3 questions generated in 2.1s
                  </div>
                  {GENERATED_QUESTIONS.map((q, i) => (
                    <div key={i} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2">
                      <p className="text-xs font-semibold text-white">{i + 1}. {q.q}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, j) => (
                          <div key={j} className={`px-2.5 py-1.5 rounded-lg text-[10px] border ${
                            j === q.correct
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-400'
                          }`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
          )}

          {/* ── STEP 2: Take Quiz ──────────────────────────────── */}
          {step === 2 && (
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-semibold text-white">Step 3 — Answer the quiz</span>
                {!submitted && (
                  <span className="text-[10px] text-slate-400">{Object.keys(selectedAnswers).length} / {GENERATED_QUESTIONS.length} answered</span>
                )}
                {submitted && (
                  <span className={`text-xs font-bold ${score === 3 ? 'text-emerald-400' : score >= 2 ? 'text-amber-400' : 'text-rose-400'}`}>
                    Score: {score} / {GENERATED_QUESTIONS.length}
                  </span>
                )}
              </div>

              <div className="space-y-3">
                {GENERATED_QUESTIONS.map((q, qi) => (
                  <div key={qi} className="bg-slate-900/80 border border-slate-800 rounded-xl p-3.5 space-y-2.5">
                    <p className="text-xs font-semibold text-white">{qi + 1}. {q.q}</p>
                    <div className="grid grid-cols-2 gap-1.5">
                      {q.options.map((opt, oi) => {
                        const isSelected = selectedAnswers[qi] === oi;
                        const isCorrect = oi === q.correct;
                        let cls = 'bg-slate-800/50 border-slate-700/50 text-slate-400 hover:border-indigo-500/50 hover:text-slate-200 cursor-pointer';
                        if (submitted) {
                          if (isCorrect) cls = 'bg-emerald-500/15 border-emerald-500/50 text-emerald-300 cursor-default';
                          else if (isSelected && !isCorrect) cls = 'bg-rose-500/15 border-rose-500/50 text-rose-300 cursor-default';
                          else cls = 'bg-slate-800/30 border-slate-800 text-slate-600 cursor-default';
                        } else if (isSelected) {
                          cls = 'bg-indigo-600/20 border-indigo-500/60 text-indigo-200 cursor-pointer';
                        }
                        return (
                          <button
                            key={oi}
                            onClick={() => !submitted && setSelectedAnswers(prev => ({ ...prev, [qi]: oi }))}
                            className={`px-2.5 py-2 rounded-lg text-[10px] border text-left transition-all ${cls}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                    {submitted && (
                      <p className="text-[10px] text-slate-400 italic border-t border-slate-800 pt-2">{q.explanation}</p>
                    )}
                  </div>
                ))}
              </div>

              {!submitted && (
                <button
                  onClick={() => { if (Object.keys(selectedAnswers).length === GENERATED_QUESTIONS.length) setSubmitted(true); }}
                  disabled={Object.keys(selectedAnswers).length < GENERATED_QUESTIONS.length}
                  className="w-full py-2 rounded-xl bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold transition-all disabled:opacity-40 disabled:cursor-not-allowed"
                >
                  Submit Answers
                </button>
              )}

              {submitted && wrongIndices.length > 0 && (
                <div className="flex items-center gap-3 p-3 bg-amber-500/10 border border-amber-500/30 rounded-xl">
                  <RotateCcw size={15} className="text-amber-400 shrink-0" />
                  <span className="text-xs text-amber-300 font-medium">
                    {wrongIndices.length} wrong answer{wrongIndices.length > 1 ? 's' : ''}. Smart Retry will generate reframed questions for these concepts.
                  </span>
                </div>
              )}
              {submitted && score === 3 && (
                <div className="flex items-center gap-3 p-3 bg-emerald-500/10 border border-emerald-500/30 rounded-xl">
                  <CheckCircle2 size={15} className="text-emerald-400 shrink-0" />
                  <span className="text-xs text-emerald-300 font-medium">Perfect score! Concept marked as mastered.</span>
                </div>
              )}
            </div>
          )}

          {/* ── STEP 3: Retry ─────────────────────────────────── */}
          {step === 3 && (
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <RotateCcw size={15} className="text-amber-400" />
                <span className="text-xs font-semibold text-white">Step 4 — Smart Retry: reframed questions on your weak spots</span>
              </div>

              <div className={`p-4 bg-amber-500/10 border border-amber-500/30 rounded-xl text-xs text-amber-200 space-y-1 transition-all duration-500 ${showRetry ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-2'}`}>
                <p className="font-semibold text-amber-300">Retry Session Generated</p>
                <p className="text-amber-400/80">AI detected 1 weak concept: <strong className="text-amber-200">Partition of Bengal</strong>. Generating 2 new questions — different framing, different options, same concept.</p>
              </div>

              {showRetry && (
                <div className="space-y-3">
                  {[
                    {
                      q: 'What was the OFFICIAL administrative justification Lord Curzon gave for partitioning Bengal in 1905?',
                      options: ['To weaken the Congress party', 'To ease administrative burden of a large province', 'To reward Muslim leaders', 'To test British military presence'],
                      correct: 1,
                    },
                    {
                      q: 'The slogan "Bande Mataram" became prominent during which movement that arose after the Bengal Partition?',
                      options: ['Non-Cooperation', 'Civil Disobedience', 'Swadeshi', 'Khilafat'],
                      correct: 2,
                    },
                  ].map((q, i) => (
                    <div key={i} className="bg-slate-900/80 border border-amber-500/20 rounded-xl p-3.5 space-y-2 animate-in slide-in-from-bottom-2 duration-300">
                      <div className="flex items-center gap-1.5 mb-1">
                        <span className="text-[9px] font-bold px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/30">RETRY Q{i + 1}</span>
                      </div>
                      <p className="text-xs font-semibold text-white">{q.q}</p>
                      <div className="grid grid-cols-2 gap-1.5">
                        {q.options.map((opt, j) => (
                          <div key={j} className={`px-2.5 py-1.5 rounded-lg text-[10px] border ${
                            j === q.correct
                              ? 'bg-emerald-500/10 border-emerald-500/40 text-emerald-300'
                              : 'bg-slate-800/50 border-slate-700/50 text-slate-500'
                          }`}>{opt}</div>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer nav */}
        <div className="shrink-0 px-5 py-3.5 border-t border-slate-800 flex items-center justify-between bg-slate-900/50">
          <button
            onClick={() => setStep(s => Math.max(0, s - 1))}
            disabled={step === 0}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-slate-800 border border-slate-700 disabled:opacity-30 disabled:cursor-not-allowed transition-colors"
          >
            <ChevronLeft size={13} /> Back
          </button>

          <span className="text-[10px] text-slate-500">{step + 1} / {DEMO_STEPS.length}</span>

          {step < DEMO_STEPS.length - 1 ? (
            <button
              onClick={() => setStep(s => s + 1)}
              disabled={step === 0 && isTyping}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {step === 0 ? 'Generate Quiz' : step === 1 ? 'Start Quiz' : 'See Retry'}
              <ChevronRight size={13} />
            </button>
          ) : (
            <Link
              href="/register"
              onClick={onClose}
              className="flex items-center gap-1.5 px-4 py-1.5 rounded-lg text-xs font-semibold text-white bg-indigo-600 hover:bg-indigo-500 border border-indigo-500/50 transition-colors"
            >
              Try it yourself <ArrowRight size={13} />
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
