'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useQuizStore } from '../../store/quizStore';
import { Sparkles, X, Brain, Sliders, CheckSquare } from 'lucide-react';

interface GenerateQuizModalProps {
  isOpen: boolean;
  onClose: () => void;
  chapterId: string;
  chapterTitle: string;
}

export const GenerateQuizModal: React.FC<GenerateQuizModalProps> = ({
  isOpen,
  onClose,
  chapterId,
  chapterTitle,
}) => {
  const router = useRouter();
  const { generateQuiz } = useQuizStore();

  const [questionCount, setQuestionCount] = useState<number>(10);
  const [difficulty, setDifficulty] = useState<string>('mixed');
  const [selectedTypes, setSelectedTypes] = useState<string[]>(['MCQ']);
  const [isGenerating, setIsGenerating] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleTypeToggle = (type: string) => {
    if (selectedTypes.includes(type)) {
      if (selectedTypes.length > 1) {
        setSelectedTypes(selectedTypes.filter((t) => t !== type));
      }
    } else {
      setSelectedTypes([...selectedTypes, type]);
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    setErrorMsg('');

    const quizId = await generateQuiz(chapterId, questionCount, difficulty, selectedTypes);
    setIsGenerating(false);

    if (quizId) {
      onClose();
      router.push(`/quiz/${quizId}`);
    } else {
      setErrorMsg('Failed to generate quiz. Please try again.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-obsidian-sidebar border border-obsidian-border w-full max-w-lg rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-6 py-4 border-b border-obsidian-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Sparkles className="text-obsidian-purple" size={20} />
            <span>Generate AI Quiz</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6 space-y-5">
          <div className="bg-obsidian-card p-3 rounded-lg border border-obsidian-border text-xs text-obsidian-muted">
            Chapter: <span className="text-white font-medium">{chapterTitle}</span>
          </div>

          {errorMsg && (
            <div className="p-3 bg-obsidian-danger/20 border border-obsidian-danger text-obsidian-danger text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Number of Questions */}
          <div>
            <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-2">
              Number of Questions
            </label>
            <div className="grid grid-cols-5 gap-2">
              {[10, 15, 20, 30, 50].map((count) => (
                <button
                  key={count}
                  type="button"
                  onClick={() => setQuestionCount(count)}
                  className={`py-2 text-xs font-medium rounded-lg border transition-colors ${
                    questionCount === count
                      ? 'bg-obsidian-purple text-white border-obsidian-purple'
                      : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                  }`}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <div>
            <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-2">
              Difficulty Level
            </label>
            <div className="grid grid-cols-4 gap-2">
              {['easy', 'medium', 'hard', 'mixed'].map((diff) => (
                <button
                  key={diff}
                  type="button"
                  onClick={() => setDifficulty(diff)}
                  className={`py-2 text-xs font-medium rounded-lg border capitalize transition-colors ${
                    difficulty === diff
                      ? 'bg-obsidian-purple text-white border-obsidian-purple'
                      : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                  }`}
                >
                  {diff}
                </button>
              ))}
            </div>
          </div>

          {/* Question Types */}
          <div>
            <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-2">
              Question Types
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              {[
                'MCQ',
                'True/False',
                'Assertion & Reason',
                'Statement Based',
              ].map((type) => {
                const isSelected = selectedTypes.includes(type);
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => handleTypeToggle(type)}
                    className={`py-2 px-3 rounded-lg border text-left flex items-center justify-between transition-colors ${
                      isSelected
                        ? 'bg-obsidian-card text-white border-obsidian-purple'
                        : 'bg-obsidian-card/50 text-obsidian-muted border-obsidian-border'
                    }`}
                  >
                    <span>{type}</span>
                    <CheckSquare
                      size={14}
                      className={isSelected ? 'text-obsidian-purple' : 'text-obsidian-muted/40'}
                    />
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Actions */}
        <div className="px-6 py-4 border-t border-obsidian-border flex justify-end gap-3 bg-obsidian-sidebar">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 rounded-lg text-xs font-medium text-obsidian-muted hover:text-white bg-obsidian-card border border-obsidian-border transition-colors"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGenerate}
            disabled={isGenerating}
            className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-obsidian-purple hover:bg-obsidian-purpleHover border border-obsidian-border transition-colors flex items-center gap-1.5 disabled:opacity-50"
          >
            <Sparkles size={14} />
            <span>{isGenerating ? 'Generating Unique Questions...' : 'Generate & Start Quiz'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
