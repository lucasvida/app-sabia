"use client";

type ConfirmDeleteModalProps = {
  open: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title?: string;
  message?: string;
  confirmLabel?: string;
  cancelLabel?: string;
  loading?: boolean;
};

export function ConfirmDeleteModal({
  open,
  onClose,
  onConfirm,
  title = "Excluir aula?",
  message = "Tem certeza que deseja excluir esta aula? Esta ação não pode ser desfeita.",
  confirmLabel = "Excluir",
  cancelLabel = "Cancelar",
  loading = false,
}: ConfirmDeleteModalProps) {
  if (!open) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm"
      role="dialog"
      aria-modal="true"
      aria-labelledby="confirm-delete-title"
      onClick={() => !loading && onClose()}
    >
      <div
        className="w-full max-w-md rounded-xl border border-slate-200 bg-white shadow-xl dark:border-slate-700 dark:bg-slate-800"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="p-6">
          <div className="flex items-center gap-3 mb-4">
            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-100 dark:bg-red-900/30">
              <span className="material-icons-outlined text-red-600 dark:text-red-400" aria-hidden="true">
                delete_outline
              </span>
            </div>
            <h2
              id="confirm-delete-title"
              className="text-lg font-bold text-slate-900 dark:text-white"
            >
              {title}
            </h2>
          </div>
          <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
            {message}
          </p>
        </div>
        <div className="flex gap-3 px-6 pb-6">
          <button
            type="button"
            onClick={onClose}
            disabled={loading}
            className="flex-1 rounded-lg border border-slate-300 bg-white px-4 py-2.5 text-sm font-semibold text-slate-700 transition hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-primary focus:ring-offset-2 disabled:opacity-60 dark:border-slate-600 dark:bg-slate-800 dark:text-slate-200 dark:hover:bg-slate-700"
          >
            {cancelLabel}
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="flex-1 rounded-lg border border-red-300 bg-red-600 px-4 py-2.5 text-sm font-semibold text-white shadow-sm transition hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2 disabled:opacity-60 dark:border-red-700 dark:bg-red-700 dark:hover:bg-red-800"
          >
            {loading ? "Excluindo…" : confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
