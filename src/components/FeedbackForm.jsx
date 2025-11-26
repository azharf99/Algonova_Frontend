import { useState, useEffect } from 'react';
import Modal from './Modal';
import { studentApi } from '../services/studentApi';

const FeedbackForm = ({ isOpen, onClose, onSubmit, feedback }) => {
  const [formData, setFormData] = useState({
    student: '',
    number: 1,
    topic: '',
    result: '',
    level: '',
    course: '',
    project_link: '',
    competency: '',
    tutor_feedback: '',
    attendance_score: '4',
    activity_score: '3',
    task_score: '2',
    lesson_date: new Date().toISOString().split('T')[0],
    lesson_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
    is_sent: false,
  });
  const [allStudents, setAllStudents] = useState([]);

  useEffect(() => {
    if (isOpen) {
      studentApi.getAllSimple().then(setAllStudents).catch(console.error);
    }
  }, [isOpen]);

  useEffect(() => {
    if (feedback) {
      setFormData({
        student: feedback.student || '',
        number: feedback.number || 1,
        topic: feedback.topic || '',
        result: feedback.result || '',
        level: feedback.level || '',
        course: feedback.course || '',
        project_link: feedback.project_link || '',
        competency: feedback.competency || '',
        tutor_feedback: feedback.tutor_feedback || '',
        attendance_score: feedback.attendance_score || '4',
        activity_score: feedback.activity_score || '3',
        task_score: feedback.task_score || '2',
        lesson_date: feedback.lesson_date || new Date().toISOString().split('T')[0],
        lesson_time: feedback.lesson_time || new Date().toTimeString().split(' ')[0].substring(0, 5),
        is_sent: feedback.is_sent || false,
      });
    } else {
      setFormData({
        student: '',
        number: 1,
        topic: '',
        result: '',
        level: '',
        course: '',
        project_link: '',
        competency: '',
        tutor_feedback: '',
        attendance_score: '4',
        activity_score: '3',
        task_score: '2',
        lesson_date: new Date().toISOString().split('T')[0],
        lesson_time: new Date().toTimeString().split(' ')[0].substring(0, 5),
        is_sent: false,
      });
    }
  }, [feedback, isOpen]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData((prev) => ({ ...prev, [name]: type === 'checkbox' ? checked : value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Format data before submitting
    const submissionData = {
      ...formData,
      number: parseInt(formData.number, 10),
    };
    onSubmit(submissionData);
  };

  const attendanceOptions = [
    { value: '4', label: '4 - Excellent' },
    { value: '3', label: '3 - Good' },
    { value: '2', label: '2 - Average' },
    { value: '1', label: '1 - Needs Improvement' },
    { value: '0', label: '0 - Poor' },
  ];
  const activityOptions = [
    { value: '3', label: '3 - Active' },
    { value: '2', label: '2 - Quiet Active' },
    { value: '1', label: '1 - Passive' },
    { value: '0', label: '0 - Not Active' },
  ];
  const taskOptions = [
    { value: '2', label: '2 - All Tasks Done' },
    { value: '1', label: '1 - Some Taks Done' },
    { value: '0', label: '0 - No Taks Done' },
  ];

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{feedback ? 'Edit Feedback' : 'Add Feedback'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
            <label htmlFor="feedback_number">Feedback Number</label>
            <input id="feedback_number" type="number" name="number" value={formData.number} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" min="1" required />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_student">Student</label>
            <select id="feedback_student" name="student" value={formData.student} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required>
              <option value="" disabled>Select a student</option>
              {allStudents.map(student => (
                <option key={student.id} value={student.id}>{student.fullname}</option>
              ))}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="feedback_topic">Topic</label>
            <input id="feedback_topic" type="text" name="topic" value={formData.topic} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_course">Course</label>
            <input id="feedback_course" type="text" name="course" value={formData.course} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_level">Level</label>
            <input id="feedback_level" type="text" name="level" value={formData.level} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_lesson_date">Lesson Date</label>
            <input id="feedback_lesson_date" type="date" name="lesson_date" value={formData.lesson_date} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_lesson_time">Lesson Time</label>
            <input id="feedback_lesson_time" type="time" name="lesson_time" value={formData.lesson_time} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="feedback_project_link">Project Link</label>
            <input id="feedback_project_link" type="url" name="project_link" value={formData.project_link} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_attendance_score">Attendance Score</label>
            <select id="feedback_attendance_score" name="attendance_score" value={formData.attendance_score} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {attendanceOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_activity_score">Activity Score</label>
            <select id="feedback_activity_score" name="activity_score" value={formData.activity_score} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {activityOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-1">
            <label htmlFor="feedback_task_score">Task Score</label>
            <select id="feedback_task_score" name="task_score" value={formData.task_score} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500">
              {taskOptions.map(opt => <option key={opt.value} value={opt.value}>{opt.label}</option>)}
            </select>
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="feedback_result">Result</label>
            <textarea id="feedback_result" name="result" value={formData.result} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="feedback_competency">Competency</label>
            <textarea id="feedback_competency" name="competency" value={formData.competency} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1 md:col-span-2">
            <label htmlFor="feedback_tutor_feedback">Tutor Feedback</label>
            <textarea id="feedback_tutor_feedback" name="tutor_feedback" value={formData.tutor_feedback} onChange={handleChange} rows="3" className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center h-full md:col-span-2">
            <label htmlFor="is_sent_feedback" className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" id="is_sent_feedback" name="is_sent" checked={formData.is_sent} onChange={handleChange} className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" />
              Is Sent
            </label>
          </div>
        </div>
        <div className="flex flex-col-reverse sm:flex-row justify-end gap-4 pt-4">
          <button type="button" className="w-full sm:w-auto px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>Cancel</button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition">{feedback ? 'Update' : 'Create'}</button>
        </div>
      </form>
    </Modal>
  );
};

export default FeedbackForm;