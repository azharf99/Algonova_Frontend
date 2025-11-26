import { useState, useEffect } from 'react';
import Modal from './Modal';
import { studentApi } from '../services/studentApi';
import { feedbackApi } from '../services/feedbackApi';
import toast from 'react-hot-toast';

const SendWhatsappModal = ({ isOpen, onClose }) => {
  const [allStudents, setAllStudents] = useState([]);
  const [selectedStudent, setSelectedStudent] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      studentApi.getAllSimple().then(setAllStudents).catch(console.error);
    }
  }, [isOpen]);

  const handleSend = async (type) => {
    setLoading(true);
    const action = type === 'student' ? feedbackApi.sendToStudent : feedbackApi.sendToAll;
    const params = type === 'student' ? selectedStudent : undefined;
    const successMessage = type === 'student' ? 'Sending WhatsApp to selected student.' : 'Sending WhatsApp to all students.';

    try {
      await action(params);
      toast.success(successMessage);
      onClose();
    } catch (error) {
      toast.error('Failed to send WhatsApp message.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Send WhatsApp Message</h2>
      <div className="space-y-6">
        <button onClick={() => handleSend('all')} disabled={loading} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold transition disabled:opacity-50">
          {loading ? 'Sending...' : 'Send to All Students'}
        </button>
        <div className="border-t border-gray-700 my-4"></div>
        <div className="space-y-2">
          <label htmlFor="whatsapp_student_select">Send to a specific student</label>
          <select id="whatsapp_student_select" value={selectedStudent} onChange={(e) => setSelectedStudent(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select a student</option>
            {allStudents.map(student => (<option key={student.id} value={student.id}>{student.fullname}</option>))}
          </select>
        </div>
        <button onClick={() => handleSend('student')} disabled={!selectedStudent || loading} className="w-full py-3 px-4 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold transition disabled:opacity-50">
          {loading ? 'Sending...' : 'Send to Selected Student'}
        </button>
      </div>
    </Modal>
  );
};

export default SendWhatsappModal;