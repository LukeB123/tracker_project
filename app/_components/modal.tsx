"use client";

import { useEffect, useRef } from "react";

interface ModalProps {
  open: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ open, onClose, children }: ModalProps) {
  const dialog = useRef<HTMLDialogElement>(null);

  useEffect(() => {
    const modal = dialog.current;

    if (open && modal) {
      modal.showModal();
    }

    return () => {
      if (modal) {
        modal.close();
      }
    };
  }, [open]);

  return (
    <dialog
      ref={dialog}
      onClose={onClose}
      className="w-1/2 border-2 border-purple-700 rounded-md"
    >
      {open && children}
    </dialog>
  );
}
