import React from 'react';
import { X } from 'lucide-react';

type DetailItem = {
  label: string;
  value?: React.ReactNode;
};

type AdminDetailModalProps = {
  isOpen: boolean;
  title: string;
  subtitle?: string;
  details: DetailItem[];
  imageUrl?: string;
  children?: React.ReactNode;
  onClose: () => void;
};

export function AdminDetailModal({
  isOpen,
  title,
  subtitle,
  details,
  imageUrl,
  children,
  onClose
}: AdminDetailModalProps) {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <button
        type="button"
        aria-label="Close details"
        className="absolute inset-0 bg-warmGray-900/50 backdrop-blur-sm"
        onClick={onClose}
      />
      <div
        role="dialog"
        aria-modal="true"
        className="relative w-full max-w-2xl max-h-[85vh] overflow-hidden rounded-2xl bg-white shadow-xl border border-warmGray-100"
      >
        <div className="flex items-start justify-between gap-4 p-6 border-b border-warmGray-100">
          <div>
            <h2 className="text-xl font-serif font-bold text-warmGray-900">{title}</h2>
            {subtitle && <p className="text-sm text-warmGray-500 mt-1">{subtitle}</p>}
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 rounded-lg text-warmGray-400 hover:text-warmGray-700 hover:bg-warmGray-100 transition-colors"
          >
            <X size={20} />
          </button>
        </div>
        <div className="p-6 overflow-y-auto max-h-[calc(85vh-88px)]">
          {imageUrl && (
            <img
              src={imageUrl}
              alt=""
              className="w-full h-52 object-cover rounded-xl bg-warmGray-100 mb-5"
            />
          )}
          {children && <div className="mb-5">{children}</div>}
          <dl className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {details.map((item) => (
              <div key={item.label} className="rounded-xl border border-warmGray-100 bg-warmGray-50 p-4">
                <dt className="text-xs font-medium uppercase text-warmGray-500">{item.label}</dt>
                <dd className="mt-1 text-sm text-warmGray-900 break-words">
                  {item.value || 'Not set'}
                </dd>
              </div>
            ))}
          </dl>
        </div>
      </div>
    </div>
  );
}
