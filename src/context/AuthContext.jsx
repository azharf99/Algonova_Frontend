import { createContext, useState, useContext, useEffect } from 'react';
import { jwtDecode } from 'jwt-decode';
import { authApi } from '../services/authApi';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [tokens, setTokens] = useState(() => localStorage.getItem('authTokens') ? JSON.parse(localStorage.getItem('authTokens')) : null);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    const checkUser = () => {
      if (tokens) {
        try {
          const decodedUser = jwtDecode(tokens.access);
          setUser(decodedUser);
        } catch (e) {
          // If token is invalid, clear it
          setTokens(null);
          setUser(null);
          localStorage.removeItem('authTokens');
        }
      }
      setLoading(false);
    };
    checkUser();
  }, [tokens]); // This effect runs once on mount and when tokens change

  const login = async (username, password) => {
    const data = await authApi.login(username, password);
    setTokens(data);
    const decodedUser = jwtDecode(data.access);
    setUser(decodedUser);
    localStorage.setItem('authTokens', JSON.stringify(data));
  };

  const logout = () => {
    setTokens(null);
    setUser(null);
    localStorage.removeItem('authTokens');
    navigate('/login');
  };

  const contextData = {
    user,
    tokens,
    setTokens,
    login,
    logout,
    loading,
  };

  return (
    <AuthContext.Provider value={contextData}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

export default AuthContext;