import { useState, useEffect, useMemo, useRef, useCallback } from 'react';
import { groupApi } from '../services/groupApi';
import { useDebounce } from '../hooks/useDebounce';
import toast from 'react-hot-toast';

import GroupTable from '../components/GroupTable';
import GroupForm from '../components/GroupForm';
import ImportCSVModal from '../components/ImportCSVModal';
import SkeletonTable from '../components/SkeletonTable';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

const GroupsPage = () => {
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [isFormModalOpen, setFormModalOpen] = useState(false);
  const [isImportModalOpen, setImportModalOpen] = useState(false);
  const [isDeleteModalOpen, setDeleteModalOpen] = useState(false);
  const [editingGroup, setEditingGroup] = useState(null);
  const [groupToDelete, setGroupToDelete] = useState(null);

  const [searchTerm, setSearchTerm] = useState('');
  const debouncedSearchTerm = useDebounce(searchTerm, 300);

  const [nextPageUrl, setNextPageUrl] = useState(null);
  const [loadingMore, setLoadingMore] = useState(false);
  const [hasNextPage, setHasNextPage] = useState(true);

  const observer = useRef();
  const lastGroupElementRef = useCallback(node => {
    if (loading || loadingMore) return;
    if (observer.current) observer.current.disconnect();
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && hasNextPage) {
        fetchMoreGroups();
      }
    });
    if (node) observer.current.observe(node);
  }, [loading, loadingMore, hasNextPage]);

  const fetchMoreGroups = async () => {
    if (!nextPageUrl) return;
    setLoadingMore(true);
    try {
      const response = await groupApi.getAll(nextPageUrl);
      setGroups(prevGroups => [...prevGroups, ...response.results]);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      console.error('Failed to fetch more groups', err);
    } finally {
      setLoadingMore(false);
    }
  };

  const fetchGroups = async () => {
    try {
      setLoading(true);
      const response = await groupApi.getAll(`${import.meta.env.VITE_API_BASE_URL}/groups/`);
      setGroups(response.results || []);
      setNextPageUrl(response.next);
      setHasNextPage(response.next !== null);
    } catch (err) {
      setError('Failed to fetch groups. Please try again later.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchGroups();
  }, []);

  const handleAddGroup = () => {
    setEditingGroup(null);
    setFormModalOpen(true);
  };

  const handleEditGroup = (group) => {
    setEditingGroup(group);
    setFormModalOpen(true);
  };

  const handleDeleteRequest = (group) => {
    setGroupToDelete(group);
    setDeleteModalOpen(true);
  };

  const confirmDeleteGroup = async () => {
    if (!groupToDelete) return;
    try {
      await groupApi.delete(groupToDelete.id);
      toast.success(`Group "${groupToDelete.name}" deleted successfully.`);
      setGroups(groups.filter((g) => g.id !== groupToDelete.id));
      setDeleteModalOpen(false);
      setGroupToDelete(null);
    } catch (err) {
      toast.error('Failed to delete group.');
      console.error(err);
    }
  }

  const handleFormSubmit = async (groupData) => {
    try {
      if (editingGroup) {
        const updatedGroup = await groupApi.update(editingGroup.id, groupData);
        setGroups(groups.map((g) => (g.id === editingGroup.id ? updatedGroup : g)));
        toast.success('Group updated successfully.');
      } else {
        const newGroup = await groupApi.create(groupData);
        setGroups([newGroup, ...groups]);
        toast.success('Group created successfully.');
      }
      setFormModalOpen(false);
    } catch (err) {
      toast.error(`Failed to ${editingGroup ? 'update' : 'create'} group.`);
      console.error(err);
    }
  };

  const handleImport = async (importedData) => {
    try {
      await groupApi.importCSV(importedData);
      toast.success('Groups imported successfully! Refreshing list...');
      fetchGroups();
    } catch (err) {
      toast.error('Failed to import groups.');
      console.error(err);
    }
  };

  const filteredGroups = useMemo(() => {
    if (!debouncedSearchTerm) return groups;
    return groups.filter(group =>
      group.name.toLowerCase().includes(debouncedSearchTerm.toLowerCase()) ||
      group.description.toLowerCase().includes(debouncedSearchTerm.toLowerCase())
    );
  }, [groups, debouncedSearchTerm]);

  return (
    <div>
      <h1 className="text-4xl font-bold mb-6">Groups</h1>
      <div className="flex flex-col sm:flex-row justify-between items-center mb-4 gap-4">
        <input
          type="text"
          placeholder="Search groups..."
          className="w-full sm:w-auto px-4 py-2 bg-gray-800 border border-gray-700 rounded-md focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
        <div className="flex gap-2">
          <button className="px-4 py-2 bg-gray-700 hover:bg-gray-600 rounded-md text-white font-semibold transition" onClick={() => setImportModalOpen(true)}>Import from CSV</button>
          <button className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition" onClick={handleAddGroup}>Add Group</button>
        </div>
      </div>

      {error && <p className="text-red-500">{error}</p>}

      <div className="overflow-x-auto bg-gray-800 rounded-lg shadow">
        <table className="w-full text-left">
          {loading ? (
            <SkeletonTable rows={5} />
          ) : (
            <GroupTable
              groups={filteredGroups}
              onEdit={handleEditGroup}
              onDelete={handleDeleteRequest}
              lastGroupRef={lastGroupElementRef}
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

      <GroupForm
        isOpen={isFormModalOpen}
        onClose={() => setFormModalOpen(false)}
        onSubmit={handleFormSubmit}
        group={editingGroup}
      />

      <ImportCSVModal
        isOpen={isImportModalOpen}
        onClose={() => setImportModalOpen(false)}
        onImport={handleImport}
      />

      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setDeleteModalOpen(false)}
        onConfirm={confirmDeleteGroup}
        studentName={groupToDelete?.name} // Re-using studentName prop for group name
      />
    </div>
  );
};

export default GroupsPage;