import React, { useEffect, useRef } from "react";

function Modal({ open, title, onClose, children, initialFocusRef }) {
  const dialogRef = useRef(null);

  useEffect(() => {
    if (!open) return;

    // Tutup dengan Esc
    const onKey = (e) => e.key === "Escape" && onClose?.();
    window.addEventListener("keydown", onKey);

    // Auto-focus: utamakan initialFocusRef -> [data-autofocus] -> input/textarea/select
    const nextTick = requestAnimationFrame(() => {
      const target =
        initialFocusRef?.current ||
        dialogRef.current?.querySelector(
          "[data-autofocus], input, textarea, select, [contenteditable='true']"
        );
      target?.focus();
    });

    return () => {
      window.removeEventListener("keydown", onKey);
      cancelAnimationFrame(nextTick);
    };
  }, [open, onClose, initialFocusRef]);

  if (!open) return null;

  // Tutup saat klik overlay (pakai mouse down biar lebih presisi)
  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onClose?.();
  };

  // Jangan teruskan event ke overlay saat klik di dalam dialog
  const stop = (e) => e.stopPropagation();

  return (
    <div
      onMouseDown={handleOverlayMouseDown}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      aria-modal="true"
      role="dialog"
      aria-labelledby="modal-title"
    >
      <div
        ref={dialogRef}
        onMouseDown={stop}
        className="w-[92%] max-w-md rounded-2xl bg-white shadow-xl outline-none
                   transition-all duration-200 ease-out animate-[fadeIn_0.12s_ease-out]"
        tabIndex={-1}
      >
        {/* Header */}
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={onClose}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
            // Hapus auto-focus ke button dengan mencegah autoFocus
            tabIndex={0}
          >
            ✕
          </button>
        </div>

        {/* Body */}
        <div className="px-5 py-4">{children}</div>
      </div>

      {/* Keyframe animasi */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px) scale(0.98); }
          to   { opacity: 1; transform: translateY(0)   scale(1); }
        }
      `}</style>
    </div>
  );
}

export default Modal;