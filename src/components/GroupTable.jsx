import { useMemo, useState } from 'react';

const SortableHeader = ({ children, sortKey, sortConfig, onSort }) => {
  const isAsc = sortConfig.key === sortKey && sortConfig.direction === 'ascending';
  const isDesc = sortConfig.key === sortKey && sortConfig.direction === 'descending';

  return (
    <th className="p-4 uppercase text-sm font-semibold text-gray-400 cursor-pointer" onClick={() => onSort(sortKey)}>
      {children} {isAsc ? '▲' : isDesc ? '▼' : ''}
    </th>
  );
};

const GroupTable = ({ groups, onEdit, onDelete, lastGroupRef }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'ascending' });

  const sortedGroups = useMemo(() => {
    let sortableItems = [...groups];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [groups, sortConfig]);

  const requestSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <>
      <thead className="bg-gray-700">
        <tr className="border-b border-gray-600">
          <SortableHeader sortKey="name" sortConfig={sortConfig} onSort={requestSort}>Name</SortableHeader>
          <SortableHeader sortKey="type" sortConfig={sortConfig} onSort={requestSort}>Type</SortableHeader>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Students</th>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedGroups.map((group, index) => {
          const isLastElement = sortedGroups.length === index + 1;
          return (
            <tr key={group.id} ref={isLastElement ? lastGroupRef : null} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="p-4">{group.name}</td>
              <td className="p-4">{group.type}</td>
              <td className="p-4">{group.student_details.map(s => s.fullname).join(', ')}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-white text-sm font-semibold transition"
                    onClick={() => onEdit(group)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-semibold transition"
                    onClick={() => onDelete(group)}
                  >
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          );
        })}
      </tbody>
    </>
  );
};

export default GroupTable;