import { Link } from 'react-router-dom';

function HomePage() {
  return (
    <div className="text-center mt-20">
      <h1 className="text-5xl font-extrabold text-white mb-4">Welcome to Algonova Feedback Management System</h1>
      <p className="text-xl text-gray-300 mb-8">Your one-stop solution for managing student feedback efficiently.</p>
      <Link to="/login" className="bg-indigo-600 hover:bg-indigo-700 text-white font-bold py-3 px-6 rounded-lg transition duration-300 ease-in-out text-lg">Get Started</Link>
    </div>
  );
}

export default HomePage;