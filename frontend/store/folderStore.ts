import { create } from 'zustand';
import { fetchApi } from '../services/api';

export interface FolderItem {
  _id: string;
  name: string;
  parentFolderId: string | null;
  icon?: string;
  color?: string;
  createdAt?: string;
}

interface FolderState {
  folders: FolderItem[];
  activeFolderId: string | null;
  expandedFolderIds: Set<string>;
  isLoading: boolean;
  error: string | null;
  
  fetchFolders: () => Promise<void>;
  setActiveFolder: (folderId: string | null) => void;
  toggleExpand: (folderId: string) => void;
  createFolder: (name: string, parentFolderId?: string | null, icon?: string, color?: string) => Promise<boolean>;
  updateFolder: (id: string, updates: { name?: string; icon?: string; color?: string }) => Promise<boolean>;
  deleteFolder: (id: string) => Promise<boolean>;
}

export const useFolderStore = create<FolderState>((set, get) => ({
  folders: [],
  activeFolderId: null,
  expandedFolderIds: new Set<string>(),
  isLoading: false,
  error: null,

  fetchFolders: async () => {
    set({ isLoading: true, error: null });

    const res = await fetchApi<{ folders: FolderItem[] }>('/folders');
    if (res.success && res.data) {
      set({ folders: res.data.folders, isLoading: false });
    } else {
      set({ error: res.message || 'Failed to fetch folders', isLoading: false });
    }
  },

  setActiveFolder: (folderId) => {
    set({ activeFolderId: folderId });
  },

  toggleExpand: (folderId) => {
    const current = new Set(get().expandedFolderIds);
    if (current.has(folderId)) {
      current.delete(folderId);
    } else {
      current.add(folderId);
    }
    set({ expandedFolderIds: current });
  },

  createFolder: async (name, parentFolderId = null, icon = 'folder', color = '#7F6DF2') => {
    const res = await fetchApi<{ folder: FolderItem }>('/folders', {
      method: 'POST',
      body: JSON.stringify({ name, parentFolderId, icon, color }),
    });

    if (res.success && res.data) {
      const newFolder = res.data.folder;
      set((state) => ({
        folders: [...state.folders, newFolder],
        activeFolderId: newFolder._id,
        error: null,
      }));
      return true;
    } else {
      set({ error: res.message || 'Failed to create folder' });
      return false;
    }
  },

  updateFolder: async (id, updates) => {
    const res = await fetchApi<{ folder: FolderItem }>(`/folders/${id}`, {
      method: 'PUT',
      body: JSON.stringify(updates),
    });

    if (res.success && res.data) {
      const updated = res.data.folder;
      set((state) => ({
        folders: state.folders.map((f) => (f._id === id ? updated : f)),
      }));
      return true;
    }
    return false;
  },

  deleteFolder: async (id) => {
    const res = await fetchApi<{ deletedFolderIds: string[] }>(`/folders/${id}`, {
      method: 'DELETE',
    });

    if (res.success && res.data) {
      const deletedIds = new Set(res.data.deletedFolderIds);
      set((state) => ({
        folders: state.folders.filter((f) => !deletedIds.has(f._id)),
        activeFolderId: state.activeFolderId && deletedIds.has(state.activeFolderId) ? null : state.activeFolderId,
      }));
      return true;
    }
    return false;
  },
}));
