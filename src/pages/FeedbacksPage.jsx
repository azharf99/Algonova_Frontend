import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { feedbackApi } from '../services/feedbackApi';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

import FeedbackTable from '../components/FeedbackTable';
import FeedbackForm from '../components/FeedbackForm';
import ImportCSVModal from '../components/ImportCSVModal';
import SkeletonTable from '../components/SkeletonTable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import DownloadFeedbackModal from '../components/DownloadFeedbackModal';

const FeedbacksPage = () => {
  const [feedbacks, setFeedbacks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [isDownloadModalOpen, setDownloadModalOpen] = useState(false);
  const [editingFeedback, setEditingFeedback] = useState(null);
  const [feedbackToDelete, setFeedbackToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observer = useRef();
  const lastFeedbackElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchMoreFeedbacks();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasNextPage]);

  const fetchMoreFeedbacks = async () => {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const response = await feedbackApi.getAll(nextPageUrl);
      setFeedbacks(prev => [...prev, ...response.results]);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      console.error('Failed to fetch more feedbacks', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchFeedbacks = async () => {
    try {
      setLoading(true);
      const response = await feedbackApi.getAll(`${import.meta.env.VITE_API_BASE_URL}/feedbacks/`);
      setFeedbacks(response.results || []);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      setError('Failed to fetch feedbacks. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFeedbacks();
  }, []);

  const handleAddFeedback = () => {
    setEditingFeedback(null);
    setFormModalOpen(true);
  };

  const handleEditFeedback = (feedback) => {
    setEditingFeedback(feedback);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (feedback) => {
    setFeedbackToDelete(feedback);
    setDeleteModalOpen(true);
  };

  const confirmDeleteFeedback = async () => {
    if (!feedbackToDelete) return;
    try {
      await feedbackApi.delete(feedbackToDelete.id);
      toast.success(`Feedback #${feedbackToDelete.number} deleted successfully.`);
      setFeedbacks(feedbacks.filter((f) => f.id !== feedbackToDelete.id));
      setDeleteModalOpen(false);
      setFeedbackToDelete(null);
    } catch (err) {
      toast.error('Failed to delete feedback.');
      console.error(err);
    }
  }

  const handleFormSubmit = async (feedbackData) => {
    try {
      if (editingFeedback) {
        const updatedFeedback = await feedbackApi.update(editingFeedback.id, feedbackData);
        setFeedbacks(feedbacks.map((f) => (f.id === editingFeedback.id ? updatedFeedback : f)));
        toast.success('Feedback updated successfully.');
      } else {
        const newFeedback = await feedbackApi.create(feedbackData);
        setFeedbacks([newFeedback, ...feedbacks]);
        toast.success('Feedback created successfully.');
      }
      setFormModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${editingFeedback ? 'update' : 'create'} feedback.`);
      console.error(err);
    }
  };

  const handleImport = async (importedData) => {
    try {
      const response = await feedbackApi.importCSV(importedData);
      const { created, updated, errors } = response;
      let message = `Feedback import finished. Created: ${created}, Updated: ${updated}.`;
      if (errors && errors.length > 0) {
        message += ` Errors: ${errors.length}. See console for details.`;
        console.error("Import errors:", errors);
      }
      toast.success(message);
      fetchFeedbacks();
    } catch (err) {
      toast.error('Failed to import feedbacks.');
      console.error(err);
    }
  };

  const filteredFeedbacks = useMemo(() => {
    if (!debouncedSearchTerm) return feedbacks;
    return feedbacks.filter(feedback =>
      feedback.topic?.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      feedback.group_details?.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [feedbacks, debouncedSearchTerm]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Feedbacks</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search feedbacks..."
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-green-600 hover:bg-green-700 rounded-md text-white font-semibold transition" onClick={() => setDownloadModalOpen(true)}>Download PDF</button>
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-semibold transition" onClick={() => setImportModalOpen(true)}>Import from CSV</button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition" onClick={handleAddFeedback}>Add Feedback</button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="w-full text-left">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : (
            <FeedbackTable
              feedbacks={filteredFeedbacks}
              onEdit={handleEditFeedback}
              onDelete={handleDeleteRequest}
              lastFeedbackRef={lastFeedbackElementRef}
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

      <FeedbackForm
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        feedback={editingFeedback}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteFeedback}
        studentName={`Feedback #${feedbackToDelete?.number}`}
      />

      <DownloadFeedbackModal
        isOpen={isDownloadModalOpen}
        onClose={() => setDownloadModalOpen(false)}
      />
    </div>
  );
};

export default FeedbacksPage;