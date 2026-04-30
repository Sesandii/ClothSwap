import React from 'react';

type ConfirmDialogProps = {
  isOpen: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  cancelLabel?: string;
  tone?: 'primary' | 'danger';
  onConfirm: () => void;
  onCancel: () => void;
};

export function ConfirmDialog({
  isOpen,
  title,
  message,
  confirmLabel = 'Confirm',
  cancelLabel = 'Cancel',
  tone = 'primary',
  onConfirm,
  onCancel
}: ConfirmDialogProps) {
  if (!isOpen) return null;

  const confirmClass =
    tone === 'danger'
      ? 'bg-primary-500 hover:bg-primary-600 text-white'
      : 'bg-secondary-500 hover:bg-secondary-600 text-white';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close confirmation dialog"
        className="absolute inset-0 bg-warmGray-900/50 backdrop-blur-sm"
        onClick={onCancel}
      />
      <div
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative w-full max-w-md rounded-2xl bg-white p-6 shadow-xl border border-warmGray-100"
      >
        <h2 id="confirm-dialog-title" className="text-xl font-serif font-bold text-warmGray-900 mb-2">
          {title}
        </h2>
        <p className="text-sm text-warmGray-600 leading-relaxed mb-6">{message}</p>
        <div className="flex flex-col-reverse sm:flex-row gap-3 sm:justify-end">
          <button
            type="button"
            onClick={onCancel}
            className="px-4 py-2 rounded-xl border border-warmGray-200 text-warmGray-700 font-medium hover:bg-warmGray-50 transition-colors"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            className={`px-4 py-2 rounded-xl font-medium transition-colors ${confirmClass}`}
          >
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
