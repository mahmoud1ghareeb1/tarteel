
import React from 'react';

interface ModalWrapperProps {
  children: React.ReactNode;
  onClose: () => void;
  show: boolean;
  position?: 'center' | 'bottom';
}

const ModalWrapper: React.FC<ModalWrapperProps> = ({ children, onClose, show, position = 'center' }) => {
  if (!show) return null;

  const positionClasses = {
    center: 'items-center justify-center',
    bottom: 'items-end justify-center',
  };

  const animationClasses = {
      center: 'animate-fade-in',
      bottom: 'animate-slide-up'
  }
  
  return (
    <div
      className={`fixed inset-0 bg-black bg-opacity-50 z-40 flex ${positionClasses[position]}`}
      onClick={onClose}
    >
      <style>{`
        @keyframes slide-up {
          from { transform: translateY(100%); }
          to { transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out; }

        @keyframes fade-in {
          from { opacity: 0; transform: scale(0.95); }
          to { opacity: 1; transform: scale(1); }
        }
        .animate-fade-in { animation: fade-in 0.2s ease-out; }
      `}</style>
      <div
        className={`bg-white rounded-t-2xl shadow-lg w-full ${position === 'bottom' ? animationClasses.bottom : animationClasses.center}`}
        onClick={(e) => e.stopPropagation()}
      >
        {children}
      </div>
    </div>
  );
};

export default ModalWrapper;
