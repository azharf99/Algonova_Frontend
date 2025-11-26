const Modal = ({ isOpen, onClose, children }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-70 z-50 flex justify-center items-start p-4 overflow-y-auto" onClick={onClose}>
      <div className="bg-gray-800 p-6 sm:p-8 rounded-lg shadow-xl w-full max-w-2xl relative my-auto" onClick={(e) => e.stopPropagation()}>
        <button className="absolute top-4 right-4 text-gray-400 hover:text-white text-2xl leading-none" onClick={onClose}>
          &times;
        </button>
        {children}
      </div>
    </div>
  );
};

export default Modal;