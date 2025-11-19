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

const StudentTable = ({ students, onEdit, onDelete, lastStudentRef }) => {
  const [sortConfig, setSortConfig] = useState({ key: 'fullname', direction: 'ascending' });

  const sortedStudents = useMemo(() => {
    let sortableItems = [...students];
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
  }, [students, sortConfig]);

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
          <SortableHeader sortKey="fullname" sortConfig={sortConfig} onSort={requestSort}>
            Full Name
          </SortableHeader>
          <SortableHeader sortKey="surname" sortConfig={sortConfig} onSort={requestSort}>
            Surname
          </SortableHeader>
          <SortableHeader sortKey="username" sortConfig={sortConfig} onSort={requestSort}>
            Username
          </SortableHeader>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {sortedStudents.map((student, index) => {
          const isLastElement = sortedStudents.length === index + 1;
          return (
            <tr key={student.id} ref={isLastElement ? lastStudentRef : null} className="border-b border-gray-700 hover:bg-gray-700/50">
              <td className="p-4">{student.fullname}</td>
              <td className="p-4">{student.surname}</td>
              <td className="p-4">{student.username}</td>
              <td className="p-4">
                <div className="flex gap-2">
                  <button
                    className="px-3 py-1 bg-gray-600 hover:bg-gray-500 rounded-md text-white text-sm font-semibold transition"
                    onClick={() => onEdit(student)}
                  >
                    Edit
                  </button>
                  <button
                    className="px-3 py-1 bg-red-600 hover:bg-red-700 rounded-md text-white text-sm font-semibold transition"
                    onClick={() => onDelete(student)}
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

export default StudentTable;