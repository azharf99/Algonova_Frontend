import { useState, useEffect } from 'react';
import Modal from './Modal';
import { groupApi } from '../services/groupApi';

const FeedbackForm = ({ isOpen, onClose, onSubmit, feedback }) => {
  const [formData, setFormData] = useState({
    number: 1,
    topic: '',
    result: '',
    competency: '',
    tutor_feedback: '',
    is_sent: false,
    group: '',
  });
  const [allGroups, setAllGroups] = useState([]);

  useEffect(() => {
    if (isOpen) {
      groupApi.getAllSimple().then(setAllGroups).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (feedback) {
      setFormData({
        number: feedback.number || 1,
        topic: feedback.topic || '',
        result: feedback.result || '',
        competency: feedback.competency || '',
        tutor_feedback: feedback.tutor_feedback || '',
        is_sent: feedback.is_sent || false,
        group: feedback.group || '',
      });
    } else {
      setFormData({
        number: 1,
        topic: '',
        result: '',
        competency: '',
        tutor_feedback: '',
        is_sent: false,
        group: '',
      });
    }
  }, [feedback, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{feedback ? 'Edit Feedback' : 'Add Feedback'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label>Feedback Number</label>
            <input type="number" name="number" value={formData.number} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" required />
          </div>
          <div className="space-y-1">
            <label>Group</label>
            <select name="group" value={formData.group} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="" disabled>Select a group</option>
              {allGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label>Topic</label>
            <input type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label>Result</label>
            <textarea name="result" value={formData.result} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label>Competency</label>
            <textarea name="competency" value={formData.competency} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label>Tutor Feedback</label>
            <textarea name="tutor_feedback" value={formData.tutor_feedback} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center h-full md:col-span-2">
            <label htmlFor="is_sent_feedback" className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="is_sent_feedback" name="is_sent" checked={formData.is_sent} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Is Sent
            </label>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition">{feedback ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackForm;