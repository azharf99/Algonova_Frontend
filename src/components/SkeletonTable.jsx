const SkeletonTable = ({ rows = 5 }) => {
  return (
    <tbody>
      {Array.from({ length: rows }).map((_, index) => (
        <tr key={index} className="relative overflow-hidden bg-gray-800 animate-pulse">
          <td className="p-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td>
          <td className="p-4"><div className="h-5 bg-gray-700 rounded w-3/4"></div></td>
          <td className="p-4"><div className="h-5 bg-gray-700 rounded w-1/2"></div></td>
          <td className="p-4"><div className="h-5 bg-gray-700 rounded w-1/2"></div></td>
          <td className="p-4"><div className="h-5 bg-gray-700 rounded w-1/2"></div></td>
          <td className="p-4"><div className="h-8 bg-gray-700 rounded w-24"></div></td>
        </tr>
      ))}
    </tbody>
  );
};

export default SkeletonTable;