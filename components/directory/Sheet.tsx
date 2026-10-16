"use client";

import { useEffect, useRef, type ReactNode } from "react";
import { CloseIcon } from "@/components/icons";

/**
 * Native <dialog> detail sheet. Opens as a modal when `open` is true, closes
 * on the close button, Escape or a backdrop click, and returns focus to the
 * element that opened it.
 */
export function Sheet({ id, labelId, open, onClose, closeLabel, children }: {
  id: string;
  labelId: string;
  open: boolean;
  onClose: () => void;
  closeLabel: string;
  children: ReactNode;
}) {
  const ref = useRef<HTMLDialogElement>(null);
  const opener = useRef<HTMLElement | null>(null);

  useEffect(() => {
    const dialog = ref.current;
    if (!dialog) return;
    if (open && !dialog.open) {
      opener.current = document.activeElement as HTMLElement;
      dialog.showModal();
    } else if (!open && dialog.open) {
      dialog.close();
    }
  }, [open]);

  return (
    <dialog
      ref={ref}
      className="sheet"
      id={id}
      aria-labelledby={labelId}
      onClose={() => {
        onClose();
        opener.current?.focus();
      }}
      onClick={(e) => {
        if (e.target === e.currentTarget) ref.current?.close();
      }}
    >
      <button type="button" className="icon-btn sheet__close" aria-label={closeLabel} onClick={() => ref.current?.close()}>
        <CloseIcon />
      </button>
      <div>{open ? children : null}</div>
    </dialog>
  );
}
