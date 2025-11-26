import { useState, useEffect } from 'react';
import Modal from './Modal';
import { studentApi } from '../services/studentApi';
import SearchableMultiSelect from './SearchableMultiSelect';

const GroupForm = ({ isOpen, onClose, onSubmit, group }) => {
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    type: 'Group',
    meeting_link: '',
    recordings_link: '',
    is_active: true,
    students: [],
  });
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    if (isOpen) {
      studentApi.getAllSimple().then(setAllStudents).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (group) {
      setFormData({
        name: group.name || '',
        description: group.description || '',
        type: group.type || 'Group',
        meeting_link: group.meeting_link || '',
        recordings_link: group.recordings_link || '',
        is_active: group.is_active ?? true,
        students: group.students || [],
      });
    } else {
      setFormData({
        name: '',
        description: '',
        type: 'Group',
        meeting_link: '',
        recordings_link: '',
        is_active: true,
        students: [],
      });
    }
  }, [group, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleStudentSelectChange = (selectedOptions) => {
    const studentIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({ ...prev, students: studentIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const studentOptions = allStudents.map(student => ({ value: student.id, label: student.fullname }));
  const selectedStudentOptions = studentOptions.filter(option => formData.students.includes(option.value));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{group ? 'Edit Group' : 'Add Group'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="group_name">Name</label>
            <input id="group_name" type="text" name="name" value={formData.name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
            <label htmlFor="group_type">Type</label>
            <select id="group_type" name="type" value={formData.type} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              <option value="Group">Group</option>
              <option value="Private">Private</option>
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="group_description">Description</label>
            <textarea id="group_description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="group_meeting_link">Meeting Link</label>
            <input id="group_meeting_link" type="url" name="meeting_link" value={formData.meeting_link} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="group_recordings_link">Recordings Link</label>
            <input id="group_recordings_link" type="url" name="recordings_link" value={formData.recordings_link} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label id="group_students_label">Students</label>
            <SearchableMultiSelect
              options={studentOptions}
              value={selectedStudentOptions}
              onChange={handleStudentSelectChange}
              placeholder="Select students..."
            />
          </div>
          <div className="flex items-center h-full md:col-span-2">
            <label htmlFor="is_active_group" className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="is_active_group" name="is_active" checked={formData.is_active} onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Is Active
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
          <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="w-full sm:w-auto px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition">
            {group ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default GroupForm;