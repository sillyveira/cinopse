import React from "react";
import { createPortal } from "react-dom";
import { X } from "lucide-react";

export default function Modal({ isOpen, onClose, title, children }) {
  if (!isOpen) return null;

  const modalContent = (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Fundo escuro */}
      <div
        className="absolute inset-0 bg-black opacity-60"
        onClick={onClose}
      ></div>

      {/* Conteúdo do modal */}
      <div className="relative z-10 bg-white rounded-2xl shadow-lg w-full max-w-lg p-6">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-700"
        >
          <X size={24} />
        </button>

        {title && <h2 className="text-xl font-bold mb-4">{title}</h2>}
        <div>{children}</div>
      </div>
    </div>
  );

    // para renderizar o modal acima da aplicação no index.html
  return createPortal(modalContent, document.getElementById("modal-root"));
}
