import { useState, useEffect } from 'react'
import { Routes, Route, Link, Navigate, useLocation } from 'react-router-dom'
import StudentsPage from './pages/StudentsPage'
import GroupsPage from './pages/GroupsPage'
import LessonsPage from './pages/LessonsPage'
import FeedbacksPage from './pages/FeedbacksPage'
import LoginPage from './pages/LoginPage'
import HomePage from './pages/HomePage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {
  const { user, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    // Close the mobile menu on route change
    setIsMenuOpen(false);
  }, [location]);

  return (
    <>
      <Toaster
        position="top-right"
        toastOptions={{
          // Define default options
          duration: 5000,
          style: {
            background: '#2a2a2a',
            color: '#fff',
            border: '1px solid #3a3a3a',
          },
          // Default options for specific types
          success: {
            duration: 3000,
          },
        }}
      />
      <nav className="py-4 border-b border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-xl md:text-2xl font-bold text-white truncate pr-4">Algonova Feedback Management System</Link>
            {/* Desktop Menu */}
            <ul className="hidden md:flex items-center space-x-4">
              {user && <li><Link to="/students" className="text-gray-300 hover:text-indigo-400 transition">Students</Link></li>}
              {user && <li><Link to="/groups" className="text-gray-300 hover:text-indigo-400 transition">Groups</Link></li>}
              {user && <li><Link to="/lessons" className="text-gray-300 hover:text-indigo-400 transition">Lessons</Link></li>}
              {user && <li><Link to="/feedbacks" className="text-gray-300 hover:text-indigo-400 transition">Feedbacks</Link></li>}
              {user && <li><button onClick={logout} className="px-4 py-2 bg-gray-800 border border-transparent rounded-md text-sm font-medium text-white hover:border-indigo-500 transition">Logout</button></li>}
            </ul>
            {/* Mobile Menu Button */}
            {user && (
              <div className="md:hidden">
                <button onClick={() => setIsMenuOpen(!isMenuOpen)} className="text-gray-300 hover:text-white focus:outline-none">
                  <svg className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={isMenuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16m-7 6h7"} />
                  </svg>
                </button>
              </div>
            )}
          </div>
          {/* Mobile Menu */}
          <ul className={`md:hidden mt-4 space-y-2 ${isMenuOpen ? 'block' : 'hidden'}`}>
            {user && <li><Link to="/students" className="text-gray-300 hover:text-indigo-400 transition">Students</Link></li>}
            {user && <li><Link to="/groups" className="text-gray-300 hover:text-indigo-400 transition">Groups</Link></li>}
            {user && <li><Link to="/lessons" className="text-gray-300 hover:text-indigo-400 transition">Lessons</Link></li>}
            {user && <li><Link to="/feedbacks" className="text-gray-300 hover:text-indigo-400 transition">Feedbacks</Link></li>}
            {user && <li><button onClick={logout} className="px-4 py-2 bg-gray-800 border border-transparent rounded-md text-sm font-medium text-white hover:border-indigo-500 transition">Logout</button></li>}
          </ul>
        </div>
      </nav>
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
        <div className="container mx-auto">
          <Routes>
            <Route path="/" element={user ? <Navigate to="/students" /> : <HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route
              path="/students"
              element={
                <ProtectedRoute>
                  <StudentsPage />
                </ProtectedRoute>
              }
          />
          <Route
            path="/groups"
            element={
              <ProtectedRoute>
                <GroupsPage />
              </ProtectedRoute>
            }
            />
            <Route
              path="/lessons"
              element={
                <ProtectedRoute>
                  <LessonsPage />
                </ProtectedRoute>
              }
          />
          <Route
            path="/feedbacks"
            element={
              <ProtectedRoute>
                <FeedbacksPage />
              </ProtectedRoute>
            }
            />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
