import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 rounded-[30px]">
      <div className="bg-white p-6 rounded-lg shadow-md">{children}</div>
    </div>
  );
};
