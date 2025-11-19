import { useState, useEffect } from 'react';
import Modal from './Modal';

const StudentForm = ({ isOpen, onClose, onSubmit, student }) => {
  const [formData, setFormData] = useState({
    fullname: '',
    surname: '',
    username: '',
    password: '',
    email: '',
    date_of_birth: '',
    phone_number: '',
    parent_name: '',
    parent_contact: '',
    is_active: true,
  });

  useEffect(() => {
    if (student) {
      setFormData({
        fullname: student.fullname || '',
        surname: student.surname || '',
        username: student.username || '',
        email: student.email || '',
        date_of_birth: student.date_of_birth || '',
        phone_number: student.phone_number || '',
        parent_name: student.parent_name || '',
        parent_contact: student.parent_contact || '',
        is_active: student.is_active ?? true,
        password: '', // Password is not shown or updated here for security
      });
    } else {
      setFormData({
        fullname: '',
        surname: '',
        username: '',
        password: '',
        email: '',
        date_of_birth: '',
        phone_number: '',
        parent_name: '',
        parent_contact: '',
        is_active: true,
      });
    }
  }, [student, isOpen]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <h2 className="text-2xl font-bold mb-6">{student ? 'Edit Student' : 'Add Student'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1">
          <label>Full Name</label>
            <input type="text" name="fullname" value={formData.fullname} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
          <label>Surname</label>
            <input type="text" name="surname" value={formData.surname} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
          <label>Username</label>
            <input type="text" name="username" value={formData.username} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          {!student && (
            <div className="space-y-1">
              <label>Password</label>
              <input type="password" name="password" value={formData.password} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
            </div>
          )}
          <div className="space-y-1">
          <label>Email</label>
            <input type="email" name="email" value={formData.email} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
          <label>Date of Birth</label>
            <input type="date" name="date_of_birth" value={formData.date_of_birth} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" required />
          </div>
          <div className="space-y-1">
          <label>Phone Number</label>
            <input type="tel" name="phone_number" value={formData.phone_number} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
          <label>Parent Name</label>
            <input type="text" name="parent_name" value={formData.parent_name} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="space-y-1">
          <label>Parent Contact</label>
            <input type="text" name="parent_contact" value={formData.parent_contact} onChange={handleChange} className="w-full px-4 py-2 bg-gray-700 border border-gray-600 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500" />
          </div>
          <div className="flex items-center h-full md:col-span-2">
            <label htmlFor="is_active" className="flex items-center gap-2 cursor-pointer">
            <input
              type="checkbox"
              id="is_active"
              name="is_active"
              checked={formData.is_active}
              onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.checked }))}
              className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
            />
            Is Active
          </label>
          </div>
        </div>
        <div className="flex justify-end gap-4 pt-4">
          <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>
            Cancel
          </button>
          <button type="submit" className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition">
            {student ? 'Update' : 'Create'}
          </button>
        </div>
      </form>
    </Modal>
  );
};

export default StudentForm;