import React, { createContext, useState } from 'react';

// Create a Context
const AuthContext = createContext();

// Create a Provider component
// The {children} parameter is a special prop in React used in custom components 
// to represent any nested components or elements that are passed between the 
// opening and closing tags of the component when it is used.
const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [token, setToken] = useState(null); // Store the token
    const [user, setUser] = useState(null); // Store the user object

    const login = (token, user) => {
      setIsLoggedIn(true);
      setToken(token);
      setUser(user);
      localStorage.setItem('token', token); // Store token in localStorage
  };

  const logout = () => {
    setIsLoggedIn(false);
    setToken(null);
    setUser(null);
    localStorage.removeItem('token'); // Remove token from localStorage
};


    return (
        <AuthContext.Provider value={{ isLoggedIn, token, user, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };