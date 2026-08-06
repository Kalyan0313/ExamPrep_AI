'use client';

import React, { useState } from 'react';
import { useChapterStore } from '../../store/chapterStore';
import { useFolderStore } from '../../store/folderStore';
import { X, Upload, FileText, CheckCircle } from 'lucide-react';

interface CreateChapterModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const CreateChapterModal: React.FC<CreateChapterModalProps> = ({ isOpen, onClose }) => {
  const { folders, activeFolderId } = useFolderStore();
  const { createChapterText, createChapterFile } = useChapterStore();

  const [inputMode, setInputMode] = useState<'text' | 'file'>('text');
  const [selectedFolderId, setSelectedFolderId] = useState<string>(activeFolderId || (folders[0]?._id || ''));
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('');
  const [description, setDescription] = useState('');
  const [content, setContent] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    const folderToUse = selectedFolderId || activeFolderId;
    if (!folderToUse) {
      setErrorMsg('Please select or create a folder first.');
      return;
    }

    if (!title.trim() || !subject.trim()) {
      setErrorMsg('Title and Subject are required.');
      return;
    }

    setIsSubmitting(true);
    let success = false;

    if (inputMode === 'text') {
      if (!content.trim()) {
        setErrorMsg('Please paste chapter text content.');
        setIsSubmitting(false);
        return;
      }
      success = await createChapterText(folderToUse, title.trim(), subject.trim(), content.trim(), description.trim());
    } else {
      if (!file) {
        setErrorMsg('Please select a PDF, DOCX, TXT, or Image file.');
        setIsSubmitting(false);
        return;
      }

      // Client-side file size check (50MB MAX)
      const MAX_SIZE = 50 * 1024 * 1024; // 50MB
      if (file.size > MAX_SIZE) {
        setErrorMsg(`Selected file is ${(file.size / (1024 * 1024)).toFixed(1)}MB. Maximum allowed upload size is 50MB.`);
        setIsSubmitting(false);
        return;
      }

      success = await createChapterFile(folderToUse, title.trim(), subject.trim(), file, description.trim());
    }

    setIsSubmitting(false);
    if (success) {
      setTitle('');
      setSubject('');
      setDescription('');
      setContent('');
      setFile(null);
      onClose();
    } else {
      const storeErr = useChapterStore.getState().error;
      setErrorMsg(storeErr || 'Failed to create chapter. Please check file size or format.');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm p-4">
      <div className="bg-obsidian-sidebar border border-obsidian-border w-full max-w-2xl rounded-xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        {/* Header */}
        <div className="px-6 py-4 border-b border-obsidian-border flex items-center justify-between">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <FileText className="text-obsidian-purple" size={20} />
            <span>Create New Study Chapter</span>
          </h2>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto space-y-4 flex-1">
          {errorMsg && (
            <div className="p-3 bg-obsidian-danger/20 border border-obsidian-danger text-obsidian-danger text-xs rounded-lg">
              {errorMsg}
            </div>
          )}

          {/* Folder & Subject Row */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-1">
                Target Folder *
              </label>
              <select
                value={selectedFolderId}
                onChange={(e) => setSelectedFolderId(e.target.value)}
                className="w-full bg-obsidian-card border border-obsidian-border rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-obsidian-purple"
              >
                {folders.map((f) => (
                  <option key={f._id} value={f._id}>
                    {f.icon || '📁'} {f.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-1">
                Subject Name *
              </label>
              <input
                type="text"
                placeholder="e.g. Ancient History, General Science"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
                className="w-full bg-obsidian-card border border-obsidian-border rounded-lg px-3 py-2 text-sm text-white placeholder-obsidian-muted focus:outline-none focus:border-obsidian-purple"
                required
              />
            </div>
          </div>

          {/* Chapter Title */}
          <div>
            <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-1">
              Chapter Title *
            </label>
            <input
              type="text"
              placeholder="e.g. Chapter 1: Indus Valley Civilization"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full bg-obsidian-card border border-obsidian-border rounded-lg px-3 py-2 text-sm text-white placeholder-obsidian-muted focus:outline-none focus:border-obsidian-purple"
              required
            />
          </div>

          {/* Input Mode Toggle */}
          <div>
            <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-2">
              Content Source
            </label>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setInputMode('text')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-colors ${
                  inputMode === 'text'
                    ? 'bg-obsidian-purple text-white border-obsidian-purple'
                    : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                }`}
              >
                <FileText size={14} /> Paste Study Text
              </button>
              <button
                type="button"
                onClick={() => setInputMode('file')}
                className={`flex-1 py-2 px-4 rounded-lg text-xs font-medium border flex items-center justify-center gap-2 transition-colors ${
                  inputMode === 'file'
                    ? 'bg-obsidian-purple text-white border-obsidian-purple'
                    : 'bg-obsidian-card text-obsidian-muted border-obsidian-border hover:text-white'
                }`}
              >
                <Upload size={14} /> Upload Document (PDF / DOCX / TXT)
              </button>
            </div>
          </div>

          {/* Content Source Panel */}
          {inputMode === 'text' ? (
            <div>
              <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-1">
                Chapter Text Content *
              </label>
              <textarea
                rows={8}
                placeholder="Paste notes, textbook paragraphs, or chapter text here..."
                value={content}
                onChange={(e) => setContent(e.target.value)}
                className="w-full bg-obsidian-card border border-obsidian-border rounded-lg p-3 text-sm text-white placeholder-obsidian-muted focus:outline-none focus:border-obsidian-purple font-sans"
              />
            </div>
          ) : (
            <div>
              <label className="block text-xs font-semibold text-obsidian-muted uppercase tracking-wider mb-1">
                Upload Document File (PDF, DOCX, TXT, PNG, JPG) *
              </label>
              <div className="border-2 border-dashed border-obsidian-border rounded-lg p-8 text-center hover:border-obsidian-purple transition-colors bg-obsidian-card cursor-pointer relative">
                <input
                  type="text"
                  readOnly
                  className="hidden"
                />
                <input
                  type="file"
                  accept=".pdf,.docx,.txt,.png,.jpg,.jpeg"
                  onChange={(e) => setFile(e.target.files?.[0] || null)}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <Upload className="mx-auto text-obsidian-purple mb-2" size={28} />
                {file ? (
                  <div className="text-sm font-medium text-white flex items-center justify-center gap-1.5">
                    <CheckCircle className="text-obsidian-success" size={16} />
                    <span>{file.name}</span>
                    <span className="text-xs text-obsidian-muted">({(file.size / 1024).toFixed(1)} KB)</span>
                  </div>
                ) : (
                  <div>
                    <div className="text-sm text-white font-medium">Click or drag file to upload</div>
                    <div className="text-xs text-obsidian-muted mt-1">Supports PDF (Scanned & Text), DOCX, TXT, or Images (PNG, JPG)</div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Footer Actions */}
          <div className="pt-4 border-t border-obsidian-border flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-lg text-xs font-medium text-obsidian-muted hover:text-white bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSubmitting}
              className="px-5 py-2 rounded-lg text-xs font-medium text-white bg-obsidian-purple hover:bg-obsidian-purpleHover border border-obsidian-border transition-colors disabled:opacity-50"
            >
              {isSubmitting ? 'Processing Document...' : 'Create Chapter'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
