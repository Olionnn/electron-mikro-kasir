import React, { useEffect, useRef } from "react";

function Modal({ open, title, onClose, children, initialFocusRef }) {
  const dialogRef = useRef(null);
  const onCloseRef = useRef(onClose);
  const hasFocusedRef = useRef(false);

  // simpan onClose terbaru tanpa memicu re-run effect fokus
  useEffect(() => {
    onCloseRef.current = onClose;
  }, [onClose]);

  useEffect(() => {
    if (!open) {
      hasFocusedRef.current = false; // reset ketika ditutup
      return;
    }

    const onKey = (e) => e.key === "Escape" && onCloseRef.current?.();
    window.addEventListener("keydown", onKey);

    // Fokus hanya SEKALI ketika modal baru dibuka
    if (!hasFocusedRef.current) {
      const target =
        initialFocusRef?.current ||
        dialogRef.current?.querySelector(
          "[data-autofocus], input, textarea, select, [contenteditable='true']"
        );
      target?.focus();
      hasFocusedRef.current = true;
    }

    return () => {
      window.removeEventListener("keydown", onKey);
    };
  }, [open]); // ⬅️ cukup bergantung ke `open`

  if (!open) return null;

  const handleOverlayMouseDown = (e) => {
    if (e.target === e.currentTarget) onCloseRef.current?.();
  };

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
        className="w-[92%] max-w-md rounded-2xl bg-white shadow-xl outline-none transition-all duration-200 ease-out animate-[fadeIn_0.12s_ease-out]"
        tabIndex={-1}
      >
        <div className="px-5 py-4 border-b flex items-center justify-between">
          <h2 id="modal-title" className="text-base font-semibold text-gray-800">
            {title}
          </h2>
          <button
            onClick={() => onCloseRef.current?.()}
            className="rounded-lg p-1.5 text-gray-500 hover:bg-gray-100"
            aria-label="Tutup"
          >
            ✕
          </button>
        </div>

        <div className="px-5 py-4">{children}</div>
      </div>

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