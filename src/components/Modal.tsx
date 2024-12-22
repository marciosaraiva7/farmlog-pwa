import React from "react";

interface ModalProps {
  children: React.ReactNode;
}

export const Modal: React.FC<ModalProps> = ({ children }) => {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 ">
      <div className="bg-white p-6 rounded-[30px] w-[90%] h-[40vh] shadow-md flex justify-center items-center">
        {children}
      </div>
    </div>
  );
};
