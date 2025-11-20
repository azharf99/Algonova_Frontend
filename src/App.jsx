import { Routes, Route, Link } from 'react-router-dom'
import StudentsPage from './pages/StudentsPage'
import GroupsPage from './pages/GroupsPage'
import LessonsPage from './pages/LessonsPage'
import FeedbacksPage from './pages/FeedbacksPage'
import LoginPage from './pages/LoginPage'
import ProtectedRoute from './components/ProtectedRoute'
import { useAuth } from './context/AuthContext'
import { Toaster } from 'react-hot-toast'
import './index.css'

function App() {
  const { user, logout } = useAuth();

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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex justify-between items-center">
          <Link to="/" className="text-2xl font-bold text-white">Student Management</Link>
          <ul className="flex items-center space-x-4">
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
            <Route path="/" element={
              <ProtectedRoute>
                <StudentsPage />
              </ProtectedRoute>
            } />
          </Routes>
        </div>
      </main>
    </>
  )
}

export default App
