import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { lessonApi } from '../services/lessonApi';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

import LessonTable from '../components/LessonTable';
import LessonForm from '../components/LessonForm';
import ImportCSVModal from '../components/ImportCSVModal';
import SkeletonTable from '../components/SkeletonTable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const LessonsPage = () => {
  const [lessons, setLessons] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingLesson, setEditingLesson] = useState(null);
  const [lessonToDelete, setLessonToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observer = useRef();
  const lastLessonElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchMoreLessons();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasNextPage]);

  const fetchMoreLessons = async () => {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const response = await lessonApi.getAll(nextPageUrl);
      setLessons(prevLessons => [...prevLessons, ...response.results]);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      console.error('Failed to fetch more lessons', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchLessons = async () => {
    try {
      setLoading(true);
      const response = await lessonApi.getAll(`${import.meta.env.VITE_API_BASE_URL}/lessons/`);
      setLessons(response.results || []);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      setError('Failed to fetch lessons. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLessons();
  }, []);

  const handleAddLesson = () => {
    setEditingLesson(null);
    setFormModalOpen(true);
  };

  const handleEditLesson = (lesson) => {
    setEditingLesson(lesson);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (lesson) => {
    setLessonToDelete(lesson);
    setDeleteModalOpen(true);
  };

  const confirmDeleteLesson = async () => {
    if (!lessonToDelete) return;
    try {
      await lessonApi.delete(lessonToDelete.id);
      toast.success(`Lesson "${lessonToDelete.title}" deleted successfully.`);
      setLessons(lessons.filter((l) => l.id !== lessonToDelete.id));
      setDeleteModalOpen(false);
      setLessonToDelete(null);
    } catch (err) {
      toast.error('Failed to delete lesson.');
      console.error(err);
    }
  }

  const handleFormSubmit = async (lessonData) => {
    try {
      if (editingLesson) {
        const updatedLesson = await lessonApi.update(editingLesson.id, lessonData);
        console.log(lessonData)
        setLessons(lessons.map((l) => (l.id === editingLesson.id ? updatedLesson : l)));
        toast.success('Lesson updated successfully.');
      } else {
        const newLesson = await lessonApi.create(lessonData);
        setLessons([newLesson, ...lessons]);
        toast.success('Lesson created successfully.');
      }
      setFormModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${editingLesson ? 'update' : 'create'} lesson.`);
      console.error(err);
    }
  };

  const handleImport = async (importedData) => {
    try {
      const response = await lessonApi.importCSV(importedData);
      const { created, updated, errors } = response;
      let message = `Lesson import finished. Created: ${created}, Updated: ${updated}.`;
      if (errors && errors.length > 0) {
        message += ` Errors: ${errors.length}. See console for details.`;
        console.error("Import errors:", errors);
      }
      toast.success(message);
      fetchLessons();
    } catch (err) {
      toast.error('Failed to import lessons.');
      console.error(err);
    }
  };

  const filteredLessons = useMemo(() => {
    if (!debouncedSearchTerm) return lessons;
    return lessons.filter(lesson =>
      lesson.title.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      lesson.module.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      lesson.level.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [lessons, debouncedSearchTerm]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Lessons</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search lessons..."
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-semibold transition" onClick={() => setImportModalOpen(true)}>Import from CSV</button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition" onClick={handleAddLesson}>Add Lesson</button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="w-full text-left">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : (
            <LessonTable
              lessons={filteredLessons}
              onEdit={handleEditLesson}
              onDelete={handleDeleteRequest}
              lastLessonRef={lastLessonElementRef}
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

      <LessonForm
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        lesson={editingLesson}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteLesson}
        studentName={lessonToDelete?.title} // Re-using studentName prop for lesson title
      />
    </div>
  );
};

export default LessonsPage;