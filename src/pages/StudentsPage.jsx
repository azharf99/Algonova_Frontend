import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { studentApi } from '../services/studentApi';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

import StudentTable from '../components/StudentTable';
import StudentForm from '../components/StudentForm';
import ImportCSVModal from '../components/ImportCSVModal';
import SkeletonTable from '../components/SkeletonTable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [studentToDelete, setStudentToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observer = useRef();
  const lastStudentElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchMoreStudents();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasNextPage]);

  const fetchMoreStudents = async () => {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const response = await studentApi.getAll(nextPageUrl);
      setStudents(prevStudents => [...prevStudents, ...response.results]);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      // Optionally handle fetch more error
      console.error('Failed to fetch more students', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchStudents = async () => {
    try {
      setLoading(true);
      // The base URL is now handled by the api service
      const response = await studentApi.getAll(`${import.meta.env.VITE_API_BASE_URL}/students/`);
      setStudents(response.results || []);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      setError('Failed to fetch students. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleAddStudent = () => {
    setEditingStudent(null);
    setFormModalOpen(true);
  };

  const handleEditStudent = (student) => {
    setEditingStudent(student);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (student) => {
    setStudentToDelete(student);
    setDeleteModalOpen(true);
  };

  const confirmDeleteStudent = async () => {
    if (!studentToDelete) return;
    try {
      await studentApi.delete(studentToDelete.id);
      toast.success(`Student "${studentToDelete.fullname}" deleted successfully.`);
      setStudents(students.filter((s) => s.id !== studentToDelete.id));
      setDeleteModalOpen(false);
      setStudentToDelete(null);
    } catch (err) {
      toast.error('Failed to delete student.');
      console.error(err);
    }
  }

  const handleFormSubmit = async (studentData) => {
    try {
      if (editingStudent) {
        const updatedStudent = await studentApi.update(editingStudent.id, studentData);
        setStudents(students.map((s) => (s.id === editingStudent.id ? updatedStudent : s)));
        toast.success('Student updated successfully.');
      } else {
        const newStudent = await studentApi.create(studentData);
        setStudents([...students, newStudent]);
        toast.success('Student created successfully.');
      }
      setFormModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${editingStudent ? 'update' : 'create'} student.`);
      console.error(err);
    }
  };

  const handleImport = async (importedData) => {
    try {
      // Assuming your backend has an endpoint for bulk import
      const response = await studentApi.importCSV(importedData);
      const { created, updated, errors } = response;
      let message = `Students import finished. Created: ${created}, Updated: ${updated}.`;
      if (errors && errors.length > 0) {
        message += ` Errors: ${errors.length}. See console for details.`;
        console.error("Import errors:", errors);
      }
      toast.success(message);
      fetchStudents(); // Refresh the list
    } catch (err) {
      toast.error('Failed to import students.');
      console.error(err);
    }
  };

  const filteredStudents = useMemo(() => {
    if (!debouncedSearchTerm) return students;
    return students.filter(student =>
      student.fullname.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.surname.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      student.username.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [students, debouncedSearchTerm]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Students</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search students..."
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-semibold transition" onClick={() => setImportModalOpen(true)}>Import from CSV</button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition" onClick={handleAddStudent}>Add Student</button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="w-full text-left">
          {loading ? (
            <SkeletonTable />
          ) : (
            <StudentTable
              students={filteredStudents}
              onEdit={handleEditStudent}
              onDelete={handleDeleteRequest}
              lastStudentRef={lastStudentElementRef}
            />
          )}
          {loadingMore && <SkeletonTable rows={3} />}
        </table>
        {!loading && !hasNextPage && (
          <div className="text-center py-8 text-gray-500">
            <p>All data has been displayed.</p>
          </div>
        )}
      </div>

      <StudentForm
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        student={editingStudent}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteStudent}
        studentName={studentToDelete?.fullname}
      />
    </div>
  );
};

export default StudentsPage;