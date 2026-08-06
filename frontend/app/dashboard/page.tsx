'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { FolderTree } from '../../components/workspace/FolderTree';
import { CreateChapterModal } from '../../components/workspace/CreateChapterModal';
import { useFolderStore } from '../../store/folderStore';
import { useChapterStore } from '../../store/chapterStore';
import { useAuthStore } from '../../store/authStore';
import { RenderFolderIcon } from '../../components/ui/FolderIcon';
import { ConfirmModal } from '../../components/ui/ConfirmModal';
import { ProfileModal } from '../../components/user/ProfileModal';
import { Folder, FileText, Plus, BookOpen, Search, Clock, Trash2, ArrowRight, Home, LogOut, User as UserIcon, Flame, ChevronDown } from 'lucide-react';

export default function DashboardPage() {
  const router = useRouter();
  const { user, initAuth, logout } = useAuthStore();
  const { folders, activeFolderId, fetchFolders } = useFolderStore();
  const { chapters, fetchChapters, deleteChapter } = useChapterStore();

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [deleteChapterId, setDeleteChapterId] = useState<string | null>(null);
  const [deleteChapterTitle, setDeleteChapterTitle] = useState<string>('');
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    initAuth();
    fetchFolders();
  }, [initAuth, fetchFolders]);

  useEffect(() => {
    fetchChapters(activeFolderId || undefined);
  }, [activeFolderId, fetchChapters]);

  const activeFolder = folders.find((f) => f._id === activeFolderId);
  const childFolders = folders.filter((f) => f.parentFolderId === (activeFolderId || null));

  const handleConfirmDeleteChapter = async () => {
    if (!deleteChapterId) return;
    setIsDeleting(true);
    await deleteChapter(deleteChapterId);
    setIsDeleting(false);
    setDeleteChapterId(null);
  };

  const handleLogout = () => {
    logout();
    router.push('/login');
  };

  return (
    <div className="flex h-screen bg-[#0B0F17] text-[#F8FAFC] overflow-hidden">
      {/* Dual-Rail Navigation Sidebar */}
      <FolderTree />

      {/* Main Workspace Canvas */}
      <div className="flex-1 flex flex-col h-full bg-[#0B0F17] overflow-y-auto">
        {/* Top Header Bar */}
        <header className="h-14 border-b border-slate-800 flex items-center justify-between px-6 bg-[#0E131F] sticky top-0 z-10">
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-white font-semibold">Study Repository</span>
            <span>/</span>
            <span className="text-indigo-400 font-medium">
              {activeFolder ? activeFolder.name : 'All Subject Chapters'}
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 text-slate-400" size={14} />
              <input
                type="text"
                placeholder="Search study chapters or notes..."
                className="bg-slate-900 border border-slate-800 rounded-xl pl-8 pr-3 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500 w-52"
              />
            </div>

            <button
              onClick={() => setIsModalOpen(true)}
              className="flex items-center gap-1.5 px-3.5 py-1.5 bg-indigo-600 hover:bg-indigo-500 text-white text-xs font-semibold rounded-xl border border-indigo-500/50 transition-colors shadow-sm"
            >
              <Plus size={14} />
              <span>Add Chapter</span>
            </button>

            {/* User Profile Dropdown Button */}
            <div className="relative">
              <button
                onClick={() => setIsUserMenuOpen((prev) => !prev)}
                className="flex items-center gap-2 p-1.5 rounded-xl hover:bg-slate-800 border border-slate-800 text-xs font-medium transition-colors"
              >
                <div className="w-7 h-7 rounded-full bg-gradient-to-tr from-indigo-600 to-cyan-500 text-white font-bold flex items-center justify-center text-xs">
                  {user?.name ? user.name.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs text-white font-semibold hidden sm:inline">{user?.name || 'Student'}</span>
                <ChevronDown size={14} className="text-slate-400" />
              </button>

              {/* User Dropdown Menu */}
              {isUserMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-slate-900 border border-slate-800 rounded-xl shadow-2xl p-1.5 z-50 text-xs space-y-0.5">
                  <div className="px-3 py-2 border-b border-slate-800 mb-1">
                    <div className="font-bold text-white truncate">{user?.name || 'Student'}</div>
                    <div className="text-[10px] text-slate-400 truncate">{user?.email || 'student@examprep.ai'}</div>
                  </div>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      setIsProfileModalOpen(true);
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <UserIcon size={14} className="text-indigo-400" /> Profile & Settings
                  </button>

                  <button
                    onClick={() => {
                      setIsUserMenuOpen(false);
                      router.push('/analytics');
                    }}
                    className="w-full text-left px-3 py-2 rounded-lg text-slate-300 hover:text-white hover:bg-slate-800 flex items-center gap-2 transition-colors"
                  >
                    <Flame size={14} className="text-amber-400" /> My Analytics & Streaks
                  </button>

                  <div className="border-t border-slate-800 my-1" />

                  <button
                    onClick={handleLogout}
                    className="w-full text-left px-3 py-2 rounded-lg text-rose-400 hover:bg-rose-500/10 flex items-center gap-2 transition-colors"
                  >
                    <LogOut size={14} /> Log Out
                  </button>
                </div>
              )}
            </div>
          </div>
        </header>

        {/* Content Canvas Body */}
        <div className="p-6 max-w-6xl w-full mx-auto space-y-6">
          {/* Header Banner */}
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-xl font-bold text-white flex items-center gap-2">
                {activeFolder ? (
                  <RenderFolderIcon name={activeFolder.icon || 'folder'} color={activeFolder.color || '#6366F1'} size={24} />
                ) : (
                  <Home size={22} className="text-indigo-400" />
                )}
                <span>{activeFolder ? activeFolder.name : 'Exam Repository & Modules'}</span>
              </h1>
              <p className="text-xs text-slate-400 mt-1">
                {activeFolder
                  ? `Viewing study materials inside ${activeFolder.name}`
                  : 'Manage subject chapters, upload scanned PDFs, and generate targeted AI competitive exam quizzes.'}
              </p>
            </div>
          </div>

          {/* Subfolders Section */}
          <div>
            <h2 className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-3">
              Subject Directories ({childFolders.length})
            </h2>
            {childFolders.length === 0 ? (
              <div className="bg-slate-900/80 border border-slate-800 border-dashed rounded-xl p-5 text-center text-xs text-slate-400">
                No subfolders in this location. Use the sidebar to add subfolders.
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {childFolders.map((folder) => (
                  <div
                    key={folder._id}
                    onClick={() => useFolderStore.getState().setActiveFolder(folder._id)}
                    className="bg-slate-900/90 hover:bg-slate-800/80 border border-slate-800 p-3.5 rounded-xl cursor-pointer transition-all flex items-center gap-3 group"
                  >
                    <div className="p-2 rounded-lg bg-[#0B0F17] border border-slate-800">
                      <RenderFolderIcon name={folder.icon || 'folder'} color={folder.color || '#6366F1'} size={20} />
                    </div>
                    <div className="overflow-hidden">
                      <div className="text-sm font-medium text-white truncate group-hover:text-indigo-400 transition-colors">
                        {folder.name}
                      </div>
                      <div className="text-xs text-slate-500">Folder</div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Chapters List Section */}
          <div>
            <div className="flex items-center justify-between mb-3">
              <h2 className="text-xs font-semibold text-obsidian-muted uppercase tracking-wider">
                Chapters & Study Materials ({chapters.length})
              </h2>
              <button
                onClick={() => setIsModalOpen(true)}
                className="text-xs text-obsidian-purple hover:underline flex items-center gap-1"
              >
                <Plus size={12} /> Add Chapter
              </button>
            </div>

            {chapters.length === 0 ? (
              <div className="bg-obsidian-card border border-obsidian-border rounded-xl p-8 text-center space-y-3">
                <BookOpen className="mx-auto text-obsidian-purple opacity-80" size={32} />
                <div className="text-sm font-medium text-white">No chapters uploaded yet</div>
                <p className="text-xs text-obsidian-muted max-w-sm mx-auto">
                  Paste study text or upload PDF/DOCX materials to generate unique AI quizzes.
                </p>
                <button
                  onClick={() => setIsModalOpen(true)}
                  className="px-4 py-2 bg-obsidian-purple hover:bg-obsidian-purpleHover text-white text-xs font-medium rounded-lg border border-obsidian-border inline-flex items-center gap-1.5 transition-colors"
                >
                  <Plus size={14} /> Create Chapter
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {chapters.map((chapter) => (
                  <div
                    key={chapter._id}
                    onClick={() => router.push(`/chapters/${chapter._id}`)}
                    className="bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border p-4 rounded-xl cursor-pointer transition-all space-y-3 group flex flex-col justify-between"
                  >
                    <div className="space-y-1.5">
                      <div className="flex items-center justify-between">
                        <span className="text-[10px] font-semibold uppercase px-2 py-0.5 rounded bg-obsidian-purple/20 text-obsidian-purple border border-obsidian-purple/30">
                          {chapter.subject}
                        </span>
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            setDeleteChapterId(chapter._id);
                            setDeleteChapterTitle(chapter.title);
                          }}
                          className="text-obsidian-muted hover:text-obsidian-danger p-1 rounded opacity-0 group-hover:opacity-100 transition-opacity"
                        >
                          <Trash2 size={13} />
                        </button>
                      </div>
                      <h3 className="text-sm font-bold text-white group-hover:text-obsidian-purple transition-colors line-clamp-1">
                        {chapter.title}
                      </h3>
                      <p className="text-xs text-obsidian-muted line-clamp-2">
                        {chapter.content}
                      </p>
                    </div>

                    <div className="pt-2 border-t border-obsidian-border flex items-center justify-between text-[11px] text-obsidian-muted">
                      <span className="flex items-center gap-1">
                        <Clock size={11} /> {new Date(chapter.createdAt).toLocaleDateString()}
                      </span>
                      <span className="text-obsidian-purple flex items-center gap-1 font-medium group-hover:translate-x-0.5 transition-transform">
                        Open Hub <ArrowRight size={11} />
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal Dialogs */}
      <CreateChapterModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />

      <ProfileModal isOpen={isProfileModalOpen} onClose={() => setIsProfileModalOpen(false)} />

      <ConfirmModal
        isOpen={deleteChapterId !== null}
        title="Delete Study Chapter"
        message={`Are you sure you want to delete chapter "${deleteChapterTitle}"? All associated AI quizzes and performance data will be permanently deleted.`}
        confirmText="Delete Chapter"
        isLoading={isDeleting}
        onConfirm={handleConfirmDeleteChapter}
        onClose={() => setDeleteChapterId(null)}
      />
    </div>
  );
}
