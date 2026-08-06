import { create } from 'zustand';
import { fetchApi, getApiBaseUrl } from '../services/api';

export interface ChapterItem {
  _id: string;
  folderId: string;
  title: string;
  subject: string;
  description?: string;
  content: string;
  createdAt: string;
}

interface ChapterState {
  chapters: ChapterItem[];
  activeChapter: ChapterItem | null;
  isLoading: boolean;
  error: string | null;

  fetchChapters: (folderId?: string) => Promise<void>;
  fetchChapterById: (id: string) => Promise<void>;
  createChapterText: (folderId: string, title: string, subject: string, content: string, description?: string) => Promise<boolean>;
  createChapterFile: (folderId: string, title: string, subject: string, file: File, description?: string) => Promise<boolean>;
  deleteChapter: (id: string) => Promise<boolean>;
}

export const useChapterStore = create<ChapterState>((set, get) => ({
  chapters: [],
  activeChapter: null,
  isLoading: false,
  error: null,

  fetchChapters: async (folderId) => {
    set({ isLoading: true, error: null });
    const endpoint = folderId ? `/chapters?folderId=${folderId}` : '/chapters';
    const res = await fetchApi<{ chapters: ChapterItem[] }>(endpoint);
    if (res.success && res.data) {
      set({ chapters: res.data.chapters, isLoading: false });
    } else {
      set({ error: res.message || 'Failed to fetch chapters', isLoading: false });
    }
  },

  fetchChapterById: async (id) => {
    set({ isLoading: true, error: null });
    const res = await fetchApi<{ chapter: ChapterItem }>(`/chapters/${id}`);
    if (res.success && res.data) {
      set({ activeChapter: res.data.chapter, isLoading: false });
    } else {
      set({ error: res.message || 'Failed to fetch chapter', isLoading: false });
    }
  },

  createChapterText: async (folderId, title, subject, content, description = '') => {
    const res = await fetchApi<{ chapter: ChapterItem }>('/chapters', {
      method: 'POST',
      body: JSON.stringify({ folderId, title, subject, content, description }),
    });

    if (res.success && res.data) {
      const newChapter = res.data.chapter;
      set((state) => ({ chapters: [newChapter, ...state.chapters] }));
      return true;
    }
    return false;
  },

  createChapterFile: async (folderId, title, subject, file, description = '') => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('examprep_token') : null;
    const formData = new FormData();
    formData.append('folderId', folderId);
    formData.append('title', title);
    formData.append('subject', subject);
    formData.append('description', description);
    formData.append('file', file);

    try {
      const response = await fetch(`${getApiBaseUrl()}/chapters`, {
        method: 'POST',
        headers: {
          ...(token ? { Authorization: `Bearer ${token}` } : {}),
        },
        body: formData,
      });

      const data = await response.json();
      if (response.ok && data.success) {
        set((state) => ({ chapters: [data.chapter, ...state.chapters], error: null }));
        return true;
      }
      set({ error: data.message || 'Failed to parse uploaded document file.' });
      return false;
    } catch (error: any) {
      console.error('File chapter upload error:', error);
      set({ error: error.message || 'Network error during file upload.' });
      return false;
    }
  },

  deleteChapter: async (id) => {
    const res = await fetchApi<{ message: string }>(`/chapters/${id}`, {
      method: 'DELETE',
    });

    if (res.success) {
      set((state) => ({
        chapters: state.chapters.filter((c) => c._id !== id),
        activeChapter: state.activeChapter?._id === id ? null : state.activeChapter,
      }));
      return true;
    }
    return false;
  },
}));
