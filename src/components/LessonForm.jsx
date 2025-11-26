import { useState, useEffect } from 'react';
import Modal from './Modal';
import { groupApi } from '../services/groupApi';
import SearchableMultiSelect from './SearchableMultiSelect';

const LessonForm = ({ isOpen, onClose, onSubmit, lesson }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: '',
    module: '',
    level: '',
    number: 1,
    description: '',
    date_start: '',
    time_start: '',
    meeting_link: '',
    is_active: true,
    group: '',
    students_attended: [],
  });
  const [allGroups, setAllGroups] = useState([]);
  const [studentsInGroup, setStudentsInGroup] = useState([]);

  useEffect(() => {
    if (isOpen) {
      groupApi.getAllSimple().then(setAllGroups).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (formData.group) {
      groupApi.getById(formData.group)
        .then(groupData => {
          setStudentsInGroup(groupData.student_details || []);
        })
        .catch(console.error);
    } else {
      setStudentsInGroup([]);
    }
  }, [formData.group]);

  useEffect(() => {
    if (lesson) {
      setFormData({
        title: lesson.title || '',
        category: lesson.category || '',
        module: lesson.module || '',
        level: lesson.level || '',
        number: lesson.number || 1,
        description: lesson.description || '',
        date_start: lesson.date_start || '',
        time_start: lesson.time_start || '',
        meeting_link: lesson.meeting_link || '',
        is_active: lesson.is_active ?? true,
        group: lesson.group || '',
        students_attended: lesson.students_attended || [],
      });
    } else {
      setFormData({
        title: '',
        category: '',
        module: '',
        level: '',
        number: 1,
        description: '',
        date_start: '',
        time_start: '',
        meeting_link: '',
        is_active: true,
        group: '',
        students_attended: [],
      });
    }
  }, [lesson, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleAttendanceSelectChange = (selectedOptions) => {
    const studentIds = selectedOptions ? selectedOptions.map(option => option.value) : [];
    setFormData(prev => ({ ...prev, students_attended: studentIds }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  const studentOptions = studentsInGroup.map(student => ({ value: student.id, label: student.fullname }));
  const selectedStudentOptions = studentOptions.filter(option => formData.students_attended.includes(option.value));

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{lesson ? 'Edit Lesson' : 'Add Lesson'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="lesson_title">Title</label>
            <input id="lesson_title" type="text" name="title" value={formData.title} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_category">Category</label>
            <input id="lesson_category" type="text" name="category" value={formData.category} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_module">Module</label>
            <input id="lesson_module" type="text" name="module" value={formData.module} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_level">Level</label>
            <input id="lesson_level" type="text" name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_number">Lesson Number</label>
            <input id="lesson_number" type="number" name="number" value={formData.number} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_group">Group</label>
            <select id="lesson_group" name="group" value={formData.group} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="" disabled>Select a group</option>
              {allGroups.map(group => (
                <option key={group.id} value={group.id}>{group.name}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_date_start">Date Start</label>
            <input id="lesson_date_start" type="date" name="date_start" value={formData.date_start} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="lesson_time_start">Time Start</label>
            <input id="lesson_time_start" type="time" name="time_start" value={formData.time_start} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="lesson_meeting_link">Meeting Link</label>
            <input id="lesson_meeting_link" type="url" name="meeting_link" value={formData.meeting_link} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="lesson_description">Description</label>
            <textarea id="lesson_description" name="description" value={formData.description} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label id="lesson_students_attended_label">Students Attended</label>
            <SearchableMultiSelect
              options={studentOptions}
              value={selectedStudentOptions}
              onChange={handleAttendanceSelectChange}
              isDisabled={!formData.group}
              placeholder="Select students who attended..."
            />
          </div>
          <div className="flex items-center h-full md:col-span-2">
            <label htmlFor="is_active_lesson" className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="is_active_lesson" name="is_active" checked={formData.is_active} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Is Active
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
          <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition">{lesson ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default LessonForm;