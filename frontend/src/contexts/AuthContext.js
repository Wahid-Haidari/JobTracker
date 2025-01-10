import React, { createContext, useState } from 'react';

// Create a Context
const AuthContext = createContext();

// Create a Provider component
// The {children} parameter is a special prop in React used in custom components 
// to represent any nested components or elements that are passed between the 
// opening and closing tags of the component when it is used.
const AuthProvider = ({ children }) => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const login = () => setIsLoggedIn(true);
    const logout = () => setIsLoggedIn(false);

    return (
        <AuthContext.Provider value={{ isLoggedIn, login, logout }}>
          {children}
        </AuthContext.Provider>
    );
};

export { AuthContext, AuthProvider };