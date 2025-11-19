import { useState } from 'react';
import Papa from 'papaparse';
import toast from 'react-hot-toast';
import Modal from './Modal';

const ImportCSVModal = ({ isOpen, onClose, onImport }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  const handleImport = () => {
    if (file) {
      Papa.parse(file, {
        header: true,
        skipEmptyLines: true,
        complete: (results) => {
          // Assuming CSV headers match student model fields (e.g., fullname, surname, username, password)
          onImport(results.data);
          onClose();
        },
        error: (error) => {
          console.error('Error parsing CSV:', error);
          toast.error('Failed to parse CSV file.');
        },
      });
    }
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <h2 className="text-2xl font-bold mb-6">Import Students from CSV</h2>
      <div className="space-y-2">
        <label htmlFor="csv-file">CSV File</label>
        <input
          type="file"
          id="csv-file"
          accept=".csv"
          onChange={handleFileChange}
          className="block w-full text-sm text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-md file:border-0 file:text-sm file:font-semibold file:bg-indigo-500 file:text-white hover:file:bg-indigo-600"
        />
      </div>
      <div className="flex justify-end gap-4 pt-6">
        <button type="button" className="px-4 py-2 bg-gray-600 hover:bg-gray-500 rounded-md text-white font-semibold transition" onClick={onClose}>
          Cancel
        </button>
        <button
          type="button"
          className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 rounded-md text-white font-semibold transition disabled:opacity-50"
          onClick={handleImport}
          disabled={!file}
        >
          Import
        </button>
      </div>
    </Modal>
  );
};

export default ImportCSVModal;