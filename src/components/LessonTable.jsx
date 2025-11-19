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

const LessonTable = ({ lessons, onEdit, onDelete, lastLessonRef }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'title', direction: 'ascending' });

  const sortedLessons = useMemo(() => {
    let sortableItems = [...lessons];
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
  }, [lessons, sortConfig]);

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
          <SortableHeader sortKey="title" sortConfig={sortConfig} onSort={requestSort}>Title</SortableHeader>
          <SortableHeader sortKey="module" sortConfig={sortConfig} onSort={requestSort}>Module</SortableHeader>
          <SortableHeader sortKey="level" sortConfig={sortConfig} onSort={requestSort}>Level</SortableHeader>
          <SortableHeader sortKey="date_start" sortConfig={sortConfig} onSort={requestSort}>Date</SortableHeader>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Group</th>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Attended</th>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedLessons.map((lesson, index) => {
          const isLastElement = sortedLessons.length === index + 1;
          return (
            <tr key={lesson.id} ref={isLastElement ? lastLessonRef : null} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="p-4">{lesson.title}</td>
              <td className="p-4">{lesson.module}</td>
              <td className="p-4">{lesson.level}</td>
              <td className="p-4">{lesson.date_start}</td>
              <td className="p-4">{lesson.group_details?.name}</td>
              <td className="p-4 text-center">{lesson.students_attended?.length || 0}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-white text-sm font-semibold transition" onClick={() => onEdit(lesson)}>
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-semibold transition" onClick={() => onDelete(lesson)}>
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

export default LessonTable;