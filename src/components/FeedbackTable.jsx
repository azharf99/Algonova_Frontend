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

const FeedbackTable = ({ feedbacks, onEdit, onDelete, lastFeedbackRef }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'lesson_date', direction: 'descending' });

  const sortedFeedbacks = useMemo(() => {
    let sortableItems = [...feedbacks];
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
  }, [feedbacks, sortConfig]);

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
          <SortableHeader sortKey="number" sortConfig={sortConfig} onSort={requestSort}>No.</SortableHeader>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Student</th>
          <SortableHeader sortKey="topic" sortConfig={sortConfig} onSort={requestSort}>Topic</SortableHeader>
          <SortableHeader sortKey="course" sortConfig={sortConfig} onSort={requestSort}>Course</SortableHeader>
          <SortableHeader sortKey="level" sortConfig={sortConfig} onSort={requestSort}>Level</SortableHeader>
          <SortableHeader sortKey="lesson_date" sortConfig={sortConfig} onSort={requestSort}>Lesson Date</SortableHeader>
          <SortableHeader sortKey="is_sent" sortConfig={sortConfig} onSort={requestSort}>Sent</SortableHeader>
          <th className="p-4 uppercase text-sm font-semibold text-gray-400">Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedFeedbacks.map((feedback, index) => {
          const isLastElement = sortedFeedbacks.length === index + 1;
          return (
            <tr key={feedback.id} ref={isLastElement ? lastFeedbackRef : null} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="p-4 text-center font-medium">{feedback.number}</td>
              <td className="p-4">{feedback.student_details?.fullname}</td>
              <td className="p-4">{feedback.topic}</td>
              <td className="p-4">{feedback.course}</td>
              <td className="p-4">{feedback.level}</td>
              <td className="p-4">{feedback.lesson_date}</td>
              <td className="p-4">{feedback.is_sent ? 'Yes' : 'No'}</td>
              <td className="p-4 whitespace-nowrap">
                <div className="flex gap-2 items-center">
                  <button
                    className="px-3 py-1 bg-blue-600 hover:bg-blue-700 rounded-md text-white text-sm font-semibold transition"
                    onClick={() => window.open(`https://algonova.pythonanywhere.com/media/${encodeURIComponent(feedback.group_name)}/Rapor ${encodeURIComponent(feedback.student_details.fullname)} Bulan ke-${feedback.number}.pdf`, '_blank')}
                  >
                    Show Document
                  </button>
                  <button className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-white text-sm font-semibold transition" onClick={() => onEdit(feedback)}>
                    Edit
                  </button>
                  <button className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-semibold transition" onClick={() => onDelete(feedback)}>
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

export default FeedbackTable;