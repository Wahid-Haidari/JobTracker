import React, { useContext } from 'react';
import { Route, Routes} from 'react-router-dom';
import Home from './components/Home';
import SignUp from './components/SignUp';
import LogIn from './components/LogIn';
import Authentication from './components/Authentication';
import Profile from './components/Profile';
import { AuthContext } from './contexts/AuthContext';

function App() {
  
  const { isLoggedIn } = useContext(AuthContext);

  return (
    
      <div>
        {!isLoggedIn && <Authentication/>}
        <Routes>
          <Route path="/" element={<Home/>}/>
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/login" element={<LogIn/>}/>
          <Route path="/profile/*" element={<Profile/>}/>
        </Routes>
      </div>

  );
}

export default App;
