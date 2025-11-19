import Modal from './Modal';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, studentName }) => {
  if (!isOpen) return null;

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-4">Confirm Deletion</h2>
      <p className="text-gray-300">
        Are you sure you want to delete the student "<strong>{studentName}</strong>"?
        This action cannot be undone.
      </p>
      <div className="flex justify-end gap-4 pt-6">
        <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-red-600 hover:bg-red-700 rounded-md text-white font-semibold transition"
          onClick={onConfirm}
        >
          Delete
        </button>
      </div>
    </Modal>
  );
};

export default DeleteConfirmationModal;