import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="py-12">
      <div className="text-center">
        <h1 className="text-5xl font-extrabold text-white mb-4">Welcome to Algonova Feedback Management System</h1>
        <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">Your one-stop solution for managing students, lessons, groups, and feedback efficiently.</p>
        <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out text-lg">Get Started</Link>
      </div>

      <div className="container mx-auto px-4 py-24">
        <h2 className="text-4xl font-bold text-white mb-12 text-center">Powerful Features to Streamline Your Workflow</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          
          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Comprehensive Management</h3>
            <p className="text-gray-300">Manage students, lessons, and groups all in one place. Keep your educational data organized and accessible.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Efficient Feedback System</h3>
            <p className="text-gray-300">Create, track, and deliver personalized student feedback. Enhance communication and student growth.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Seamless Data Import</h3>
            <p className="text-gray-300">Bulk import data for students, lessons, and more using CSV files to get set up in minutes.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Instant Communication</h3>
            <p className="text-gray-300">Send feedback reports directly to students or parents via WhatsApp with a single click.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Downloadable Reports</h3>
            <p className="text-gray-300">Generate and download professional-looking feedback reports in PDF format for easy sharing and record-keeping.</p>
          </div>

          <div className="bg-gray-800 p-6 rounded-lg shadow-lg transform hover:scale-105 transition-transform duration-300">
            <h3 className="text-2xl font-semibold text-indigo-400 mb-3">Smart Search & Filtering</h3>
            <p className="text-gray-300">Quickly find the information you need with powerful search and filtering capabilities across all modules.</p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default HomePage;