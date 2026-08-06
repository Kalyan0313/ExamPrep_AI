import { create } from 'zustand';
import { fetchApi } from '../services/api';

export interface QuestionItem {
  _id: string;
  quizId: string;
  chapterId: string;
  question: string;
  options: string[];
  correctAnswer: number;
  explanation: string;
  conceptTag: string;
  difficulty: 'easy' | 'medium' | 'hard';
  userAnswer?: number | null;
  isCorrect?: boolean | null;
}

export interface QuizItem {
  _id: string;
  chapterId: string | { _id: string; title: string; subject: string };
  title: string;
  type: string;
  difficulty: string;
  questionCount: number;
  score?: number | null;
  accuracy?: number | null;
  timeTakenSeconds?: number;
}

interface QuizState {
  currentQuiz: QuizItem | null;
  questions: QuestionItem[];
  currentQuestionIndex: number;
  userAnswers: Record<string, number>; // questionId -> optionIndex
  bookmarkedQuestionIds: Set<string>;
  flaggedQuestionIds: Set<string>;
  elapsedSeconds: number;
  isSubmitting: boolean;
  isLoading: boolean;
  error: string | null;

  generateQuiz: (chapterId: string, questionCount: number, difficulty: string, questionTypes: string[]) => Promise<string | null>;
  loadQuiz: (quizId: string) => Promise<void>;
  selectAnswer: (questionId: string, optionIndex: number) => void;
  toggleBookmark: (questionId: string) => void;
  toggleFlag: (questionId: string) => void;
  setCurrentIndex: (index: number) => void;
  incrementTimer: () => void;
}

export const useQuizStore = create<QuizState>((set, get) => ({
  currentQuiz: null,
  questions: [],
  currentQuestionIndex: 0,
  userAnswers: {},
  bookmarkedQuestionIds: new Set<string>(),
  flaggedQuestionIds: new Set<string>(),
  elapsedSeconds: 0,
  isSubmitting: false,
  isLoading: false,
  error: null,

  generateQuiz: async (chapterId, questionCount, difficulty, questionTypes) => {
    set({ isLoading: true, error: null });
    const res = await fetchApi<{ quiz: QuizItem; questions: QuestionItem[] }>('/quizzes/generate', {
      method: 'POST',
      body: JSON.stringify({ chapterId, questionCount, difficulty, questionTypes }),
    });

    if (res.success && res.data) {
      set({
        currentQuiz: res.data.quiz,
        questions: res.data.questions,
        currentQuestionIndex: 0,
        userAnswers: {},
        bookmarkedQuestionIds: new Set<string>(),
        flaggedQuestionIds: new Set<string>(),
        elapsedSeconds: 0,
        isLoading: false,
      });
      return res.data.quiz._id;
    } else {
      set({ error: res.message || 'Failed to generate quiz', isLoading: false });
      return null;
    }
  },

  loadQuiz: async (quizId) => {
    set({ isLoading: true, error: null });
    const res = await fetchApi<{ quiz: QuizItem; questions: QuestionItem[] }>(`/quizzes/${quizId}`);

    if (res.success && res.data) {
      const answers: Record<string, number> = {};
      res.data.questions.forEach((q) => {
        if (q.userAnswer !== undefined && q.userAnswer !== null) {
          answers[q._id] = q.userAnswer;
        }
      });

      set({
        currentQuiz: res.data.quiz,
        questions: res.data.questions,
        currentQuestionIndex: 0,
        userAnswers: answers,
        isLoading: false,
      });
    } else {
      set({ error: res.message || 'Failed to load quiz', isLoading: false });
    }
  },

  selectAnswer: (questionId, optionIndex) => {
    set((state) => ({
      userAnswers: { ...state.userAnswers, [questionId]: optionIndex },
    }));
  },

  toggleBookmark: (questionId) => {
    const current = new Set(get().bookmarkedQuestionIds);
    if (current.has(questionId)) current.delete(questionId);
    else current.add(questionId);
    set({ bookmarkedQuestionIds: current });
  },

  toggleFlag: (questionId) => {
    const current = new Set(get().flaggedQuestionIds);
    if (current.has(questionId)) current.delete(questionId);
    else current.add(questionId);
    set({ flaggedQuestionIds: current });
  },

  setCurrentIndex: (index) => {
    if (index >= 0 && index < get().questions.length) {
      set({ currentQuestionIndex: index });
    }
  },

  incrementTimer: () => {
    set((state) => ({ elapsedSeconds: state.elapsedSeconds + 1 }));
  },
}));
