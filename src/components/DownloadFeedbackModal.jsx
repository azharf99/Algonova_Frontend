import { useState, useEffect } from 'react';
import Modal from './Modal';
import { groupApi } from '../services/groupApi';
import { feedbackApi } from '../services/feedbackApi';
import toast from 'react-hot-toast';

const DownloadFeedbackModal = ({ isOpen, onClose }) => {
  const [allGroups, setAllGroups] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState('');
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (isOpen) {
      groupApi.getAllSimple().then(setAllGroups).catch(console.error);
    }
  }, [isOpen]);

  const handleDownload = async (type) => {
    setLoading(true);
    try {
      if (type === 'all') {
        await feedbackApi.downloadAll();
        toast.success('Downloading all feedbacks PDF.');
      } else if (type === 'group' && selectedGroup) {
        await feedbackApi.downloadByGroup(selectedGroup);
        toast.success('Downloading group feedbacks PDF.');
      }
      onClose();
    } catch (error) {
      toast.error('Failed to download PDF.');
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Download Feedbacks PDF</h2>
      <div className="space-y-4">
        <button onClick={() => handleDownload('all')} disabled={loading} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition disabled:opacity-50">
          {loading ? 'Downloading...' : 'Download All Feedbacks'}
        </button>
        <div className="border-t border-gray-700 my-4"></div>
        <div className="space-y-2">
          <label>Download by Group</label>
          <select value={selectedGroup} onChange={(e) => setSelectedGroup(e.target.value)} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
            <option value="" disabled>Select a group</option>
            {allGroups.map(group => (
              <option key={group.id} value={group.id}>{group.name}</option>
            ))}
          </select>
        </div>
        <button onClick={() => handleDownload('group')} disabled={!selectedGroup || loading} className="w-full py-2 px-4 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition disabled:opacity-50">
          {loading ? 'Downloading...' : 'Download for Selected Group'}
        </button>
      </div>
    </Modal>
  );
};

export default DownloadFeedbackModal;