'use client';

import React, { useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useFolderStore, FolderItem } from '../../store/folderStore';
import { RenderFolderIcon, ICON_OPTIONS } from '../ui/FolderIcon';
import { ConfirmModal } from '../ui/ConfirmModal';
import {
  ChevronRight,
  ChevronDown,
  ChevronLeft,
  Folder,
  Plus,
  Trash2,
  FolderPlus,
  Home,
  BarChart3,
  Lightbulb,
  Briefcase,
  Settings,
  LayoutGrid,
  Calendar,
  FileText,
  GripVertical,
} from 'lucide-react';

interface FolderNodeProps {
  folder: FolderItem;
  level: number;
}

export const FolderNode: React.FC<FolderNodeProps> = ({ folder, level }) => {
  const {
    folders,
    activeFolderId,
    expandedFolderIds,
    setActiveFolder,
    toggleExpand,
    createFolder,
    deleteFolder,
  } = useFolderStore();

  const [isCreatingSub, setIsCreatingSub] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [subName, setSubName] = useState('');
  const [subIcon, setSubIcon] = useState('folder');
  const [subColor, setSubColor] = useState('#6366F1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const children = folders.filter((f) => f.parentFolderId === folder._id);
  const isExpanded = expandedFolderIds.has(folder._id);
  const isActive = activeFolderId === folder._id;

  const handleCreateSubfolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!subName.trim()) return;
    setIsSubmitting(true);
    const success = await createFolder(subName.trim(), folder._id, subIcon, subColor);
    setIsSubmitting(false);
    if (success) {
      setSubName('');
      setIsCreatingSub(false);
      if (!isExpanded) toggleExpand(folder._id);
    }
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    await deleteFolder(folder._id);
    setIsDeleting(false);
    setIsDeleteModalOpen(false);
  };

  return (
    <div className="select-none">
      <div
        className={`flex items-center justify-between px-3 py-2 rounded-xl cursor-pointer transition-all text-xs font-medium ${
          isActive
            ? 'bg-[#1E293B] text-white font-semibold shadow-sm border border-slate-700/60'
            : 'text-slate-400 hover:bg-[#1E293B]/50 hover:text-slate-200'
        }`}
        style={{ paddingLeft: `${Math.max(level * 12 + 12, 12)}px` }}
        onClick={() => {
          setActiveFolder(folder._id);
          if (children.length > 0) toggleExpand(folder._id);
        }}
      >
        <div className="flex items-center gap-2 overflow-hidden flex-1">
          {children.length > 0 ? (
            <button
              onClick={(e) => {
                e.stopPropagation();
                toggleExpand(folder._id);
              }}
              className="p-0.5 rounded text-slate-400 hover:text-white"
            >
              {isExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
            </button>
          ) : (
            <span className="w-3" />
          )}

          <RenderFolderIcon name={folder.icon || 'folder'} color={folder.color || '#6366F1'} size={15} />
          <span className="truncate">{folder.name}</span>
        </div>

        <div className="flex items-center gap-1 opacity-0 hover:opacity-100 transition-opacity">
          <button
            title="Create Subfolder"
            onClick={(e) => {
              e.stopPropagation();
              setIsCreatingSub(true);
            }}
            className="p-1 text-slate-400 hover:text-white hover:bg-slate-700/50 rounded"
          >
            <Plus size={12} />
          </button>
          <button
            title="Delete Folder"
            onClick={(e) => {
              e.stopPropagation();
              setIsDeleteModalOpen(true);
            }}
            className="p-1 text-slate-400 hover:text-rose-400 hover:bg-slate-700/50 rounded"
          >
            <Trash2 size={12} />
          </button>
        </div>
      </div>

      {/* Inline New Subfolder Form */}
      {isCreatingSub && (
        <form onSubmit={handleCreateSubfolder} className="ml-6 mr-2 py-2 px-2.5 flex flex-col gap-2 bg-[#1E293B] my-1 rounded-xl border border-indigo-500/40 shadow-lg">
          <div className="flex gap-1.5 items-center">
            <select
              value={subIcon}
              onChange={(e) => setSubIcon(e.target.value)}
              className="bg-[#0F172A] text-xs border border-slate-700 rounded-lg p-1 text-white focus:outline-none"
            >
              {ICON_OPTIONS.map((opt) => (
                <option key={opt.id} value={opt.id}>
                  {opt.label}
                </option>
              ))}
            </select>
            <input
              type="text"
              placeholder="Subfolder name..."
              value={subName}
              onChange={(e) => setSubName(e.target.value)}
              className="w-full bg-[#0F172A] border border-slate-700 text-xs text-white px-2.5 py-1 rounded-lg focus:outline-none focus:border-indigo-500"
              autoFocus
            />
          </div>
          <div className="flex justify-between items-center pt-0.5">
            <div className="flex gap-1">
              {['#6366F1', '#10B981', '#06B6D4', '#F59E0B', '#EC4899'].map((c) => (
                <button
                  key={c}
                  type="button"
                  onClick={() => setSubColor(c)}
                  className={`w-3.5 h-3.5 rounded-full border ${subColor === c ? 'ring-2 ring-white border-transparent' : 'border-slate-700'}`}
                  style={{ backgroundColor: c }}
                />
              ))}
            </div>
            <div className="flex gap-1">
              <button
                type="button"
                onClick={() => setIsCreatingSub(false)}
                className="text-[11px] text-slate-400 px-2 py-0.5 rounded hover:text-white"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="text-[11px] bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg hover:bg-indigo-500 font-medium disabled:opacity-50"
              >
                Save
              </button>
            </div>
          </div>
        </form>
      )}

      {/* Render Nested Children */}
      {isExpanded && children.length > 0 && (
        <div className="space-y-0.5 mt-0.5">
          {children.map((child) => (
            <FolderNode key={child._id} folder={child} level={level + 1} />
          ))}
        </div>
      )}

      {/* Confirmation Modal */}
      <ConfirmModal
        isOpen={isDeleteModalOpen}
        title="Delete Directory Folder"
        message={`Are you sure you want to delete "${folder.name}"? All nested subfolders and study chapters inside will be permanently removed.`}
        confirmText="Delete Folder"
        isLoading={isDeleting}
        onConfirm={handleConfirmDelete}
        onClose={() => setIsDeleteModalOpen(false)}
      />
    </div>
  );
};

export const FolderTree: React.FC = () => {
  const router = useRouter();
  const pathname = usePathname();
  const { folders, activeFolderId, setActiveFolder, createFolder, error } = useFolderStore();

  const [isNavPanelCollapsed, setIsNavPanelCollapsed] = useState(false);
  const [isFoldersExpanded, setIsFoldersExpanded] = useState(true);
  const [isCreatingRoot, setIsCreatingRoot] = useState(false);
  const [rootName, setRootName] = useState('');
  const [rootIcon, setRootIcon] = useState('folder');
  const [rootColor, setRootColor] = useState('#6366F1');
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Resizable Panel Width State (Min 160px, Max 480px, Default 240px)
  const [navPanelWidth, setNavPanelWidth] = useState(240);
  const [isResizing, setIsResizing] = useState(false);

  const rootFolders = folders.filter((f) => !f.parentFolderId);

  const handleCreateRoot = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!rootName.trim()) return;
    setIsSubmitting(true);
    const success = await createFolder(rootName.trim(), null, rootIcon, rootColor);
    setIsSubmitting(false);
    if (success) {
      setRootName('');
      setIsCreatingRoot(false);
    }
  };

  const handleMouseDownResize = (e: React.MouseEvent) => {
    e.preventDefault();
    setIsResizing(true);
    const startX = e.clientX;
    const startWidth = navPanelWidth;

    const handleMouseMove = (moveEvent: MouseEvent) => {
      const delta = moveEvent.clientX - startX;
      const newWidth = Math.max(160, Math.min(480, startWidth + delta));
      setNavPanelWidth(newWidth);
    };

    const handleMouseUp = () => {
      setIsResizing(false);
      window.removeEventListener('mousemove', handleMouseMove);
      window.removeEventListener('mouseup', handleMouseUp);
    };

    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  };

  return (
    <aside className="h-full flex shrink-0 select-none relative">
      {/* 1. Leftmost Narrow Icon Rail */}
      <div className="w-[60px] bg-[#090D16] border-r border-slate-800/80 h-full flex flex-col items-center py-4 justify-between shrink-0 z-20">
        {/* Top Logo */}
        <div className="flex flex-col items-center gap-6">
          <div
            onClick={() => router.push('/')}
            className="w-9 h-9 rounded-2xl bg-gradient-to-tr from-indigo-600 to-indigo-400 p-0.5 cursor-pointer shadow-lg shadow-indigo-600/30 hover:scale-105 transition-transform"
          >
            <div className="w-full h-full bg-[#090D16] rounded-[14px] flex items-center justify-center text-indigo-400">
              <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                <circle cx="12" cy="12" r="9" fill="none" stroke="currentColor" strokeWidth="2" strokeDasharray="4 2" />
                <path d="M8 12h8M12 8v8" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </div>
          </div>

          {/* Navigation Icon Shortcuts */}
          <nav className="flex flex-col gap-3">
            <button
              onClick={() => {
                setActiveFolder(null);
                if (pathname !== '/dashboard') router.push('/dashboard');
              }}
              className={`p-2.5 rounded-xl transition-all relative group ${
                pathname === '/dashboard' && activeFolderId === null
                  ? 'bg-[#1E293B] text-indigo-400 shadow-md border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Dashboard Overview"
            >
              <LayoutGrid size={18} />
            </button>

            <button
              onClick={() => setIsNavPanelCollapsed((prev) => !prev)}
              className={`p-2.5 rounded-xl transition-all relative group ${
                !isNavPanelCollapsed
                  ? 'bg-slate-800/80 text-white'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Toggle Study Folders Panel"
            >
              <Folder size={18} />
            </button>

            <button
              onClick={() => router.push('/analytics')}
              className={`p-2.5 rounded-xl transition-all relative group ${
                pathname === '/analytics'
                  ? 'bg-[#1E293B] text-cyan-400 shadow-md border border-slate-700/60'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/60'
              }`}
              title="Performance Analytics"
            >
              <BarChart3 size={18} />
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              title="AI Recommendations"
            >
              <Lightbulb size={18} />
            </button>

            <button
              onClick={() => router.push('/dashboard')}
              className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
              title="Exam Collections"
            >
              <Briefcase size={18} />
            </button>
          </nav>
        </div>

        {/* Bottom Gear Settings */}
        <button
          onClick={() => router.push('/dashboard')}
          className="p-2.5 rounded-xl text-slate-400 hover:text-white hover:bg-slate-800/60 transition-all"
          title="Workspace Settings"
        >
          <Settings size={18} />
        </button>
      </div>

      {/* 2. Right Expandable & Draggable Navigation Rail Panel */}
      {!isNavPanelCollapsed && (
        <div
          style={{ width: `${navPanelWidth}px` }}
          className="bg-[#0E131F] border-r border-slate-800/80 h-full flex flex-col p-4 text-slate-300 relative transition-[width] duration-75 ease-out z-10"
        >
          {/* Header Bar: Brand Title & Collapse Arrow */}
          <div className="flex items-center justify-between pb-4 border-b border-slate-800/80 mb-4">
            <span className="font-extrabold text-sm text-white tracking-tight">ExamPrep AI</span>
            <button
              onClick={() => setIsNavPanelCollapsed(true)}
              className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
              title="Collapse Panel"
            >
              <ChevronLeft size={16} />
            </button>
          </div>

          {/* Nav List */}
          <div className="flex-1 overflow-y-auto space-y-4 pr-1">
            {/* Home Navigation Item */}
            <div
              onClick={() => {
                setActiveFolder(null);
                if (pathname !== '/dashboard') router.push('/dashboard');
              }}
              className={`flex items-center gap-2.5 px-3 py-2 rounded-xl cursor-pointer text-xs font-medium transition-all ${
                activeFolderId === null && pathname === '/dashboard'
                  ? 'text-white bg-slate-800/60 font-semibold'
                  : 'text-slate-300 hover:bg-slate-800/40 hover:text-white'
              }`}
            >
              <Home size={16} className="text-slate-400" />
              <span>Home</span>
            </div>

            {/* Study Folders Section Accordion */}
            <div className="space-y-1">
              <div className="flex items-center justify-between px-2 py-1">
                <button
                  onClick={() => setIsFoldersExpanded((prev) => !prev)}
                  className="flex items-center gap-1.5 text-xs font-semibold text-slate-400 hover:text-white transition-colors"
                >
                  <span>Study Folders</span>
                  {isFoldersExpanded ? <ChevronDown size={13} /> : <ChevronRight size={13} />}
                </button>

                <button
                  onClick={() => setIsCreatingRoot((prev) => !prev)}
                  className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800/60 transition-colors"
                  title="Create New Folder"
                >
                  <Plus size={14} />
                </button>
              </div>

              {error && (
                <div className="p-2 bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs rounded-xl">
                  {error}
                </div>
              )}

              {/* Root Creation Form */}
              {isCreatingRoot && (
                <form onSubmit={handleCreateRoot} className="my-2 flex flex-col gap-2 bg-[#1E293B] p-3 rounded-xl border border-indigo-500/40 shadow-lg">
                  <div className="text-xs font-bold text-white flex items-center gap-1">
                    <FolderPlus size={13} className="text-indigo-400" /> Add Folder
                  </div>
                  <div className="flex gap-1.5 items-center">
                    <select
                      value={rootIcon}
                      onChange={(e) => setRootIcon(e.target.value)}
                      className="bg-[#0F172A] text-xs border border-slate-700 rounded-lg p-1 text-white focus:outline-none"
                    >
                      {ICON_OPTIONS.map((opt) => (
                        <option key={opt.id} value={opt.id}>
                          {opt.label}
                        </option>
                      ))}
                    </select>
                    <input
                      type="text"
                      placeholder="Folder name (e.g. JEE Main)"
                      value={rootName}
                      onChange={(e) => setRootName(e.target.value)}
                      className="w-full bg-[#0F172A] border border-slate-700 text-xs text-white px-2 py-1 rounded-lg focus:outline-none focus:border-indigo-500"
                      autoFocus
                    />
                  </div>
                  <div className="flex justify-between items-center pt-1">
                    <div className="flex gap-1">
                      {['#6366F1', '#10B981', '#06B6D4', '#F59E0B', '#EC4899'].map((c) => (
                        <button
                          key={c}
                          type="button"
                          onClick={() => setRootColor(c)}
                          className={`w-3.5 h-3.5 rounded-full border ${rootColor === c ? 'ring-2 ring-white border-transparent' : 'border-slate-700'}`}
                          style={{ backgroundColor: c }}
                        />
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <button
                        type="button"
                        onClick={() => setIsCreatingRoot(false)}
                        className="text-xs text-slate-400 px-2 py-0.5 rounded hover:text-white"
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSubmitting}
                        className="text-xs bg-indigo-600 text-white px-2.5 py-0.5 rounded-lg hover:bg-indigo-500 font-medium disabled:opacity-50"
                      >
                        Create
                      </button>
                    </div>
                  </div>
                </form>
              )}

              {/* Folders List */}
              {isFoldersExpanded && (
                <div className="space-y-0.5 pt-1">
                  {rootFolders.length === 0 && !isCreatingRoot ? (
                    <div className="text-xs text-slate-500 py-3 px-2 text-center border border-dashed border-slate-800 rounded-xl my-1">
                      No folders created yet.
                    </div>
                  ) : (
                    rootFolders.map((folder) => (
                      <FolderNode key={folder._id} folder={folder} level={0} />
                    ))
                  )}
                </div>
              )}
            </div>

            {/* Divider Line */}
            <div className="border-t border-slate-800/80 my-3" />

            {/* Bottom Extra Navigation Items */}
            <div className="space-y-1">
              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 cursor-pointer transition-colors">
                <Calendar size={16} className="text-slate-400" />
                <span>Calendar</span>
              </div>

              <div className="flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-slate-400 hover:text-white hover:bg-slate-800/40 cursor-pointer transition-colors">
                <FileText size={16} className="text-slate-400" />
                <span>Notes</span>
              </div>
            </div>
          </div>

          {/* Draggable Resize Handle */}
          <div
            onMouseDown={handleMouseDownResize}
            onDoubleClick={() => setNavPanelWidth(240)}
            className={`absolute right-0 top-0 bottom-0 w-1.5 cursor-col-resize hover:bg-indigo-500/80 transition-colors z-30 flex items-center justify-center ${
              isResizing ? 'bg-indigo-500 shadow-lg' : 'bg-transparent'
            }`}
            title="Drag to resize sidebar width (Double click to reset)"
          />
        </div>
      )}
    </aside>
  );
};
