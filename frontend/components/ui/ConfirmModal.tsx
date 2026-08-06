'use client';

import React from 'react';
import { AlertTriangle, Trash2, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  title?: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  isDanger?: boolean;
  isLoading?: boolean;
  onConfirm: () => void;
  onClose: () => void;
}

export const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  title = 'Confirm Action',
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  isDanger = true,
  isLoading = false,
  onConfirm,
  onClose,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4 animate-in fade-in duration-150">
      <div className="bg-obsidian-sidebar border border-obsidian-border w-full max-w-md rounded-xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="px-5 py-4 border-b border-obsidian-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-white font-semibold text-sm">
            {isDanger ? (
              <div className="p-1 rounded bg-rose-500/20 text-rose-400">
                <AlertTriangle size={18} />
              </div>
            ) : (
              <div className="p-1 rounded bg-obsidian-purple/20 text-obsidian-purple">
                <Trash2 size={18} />
              </div>
            )}
            <span>{title}</span>
          </div>

          <button
            onClick={onClose}
            className="p-1 rounded-lg text-obsidian-muted hover:text-white hover:bg-obsidian-hover transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Message Body */}
        <div className="p-5 text-sm text-obsidian-text space-y-2">
          <p className="leading-relaxed">{message}</p>
          <p className="text-xs text-obsidian-muted">This action cannot be undone.</p>
        </div>

        {/* Footer Actions */}
        <div className="px-5 py-3 border-t border-obsidian-border bg-obsidian-bg flex justify-end gap-2.5">
          <button
            type="button"
            onClick={onClose}
            disabled={isLoading}
            className="px-4 py-2 rounded-lg text-xs font-medium text-obsidian-muted hover:text-white bg-obsidian-card hover:bg-obsidian-hover border border-obsidian-border transition-colors disabled:opacity-50"
          >
            {cancelText}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={isLoading}
            className={`px-4 py-2 rounded-lg text-xs font-medium text-white flex items-center gap-1.5 transition-colors border shadow-sm disabled:opacity-50 ${
              isDanger
                ? 'bg-rose-600 hover:bg-rose-700 border-rose-500/50'
                : 'bg-obsidian-purple hover:bg-obsidian-purpleHover border-obsidian-border'
            }`}
          >
            <Trash2 size={13} />
            <span>{isLoading ? 'Deleting...' : confirmText}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
