import { useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Header() {

    const navigate = useNavigate();
     const { isLoggedIn, user, logout } = useContext(AuthContext); // Get user and isLoggedIn from context

    const handleTodo = () => {
      navigate('/profile/todo');
    };

    const handleApplications = () => {
      navigate('/profile/applications');
    };


    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <div>
        {isLoggedIn && <p>Welcome, {user?.username}!</p>} {/* Display the logged-in user's username */}
        <button onClick={handleTodo}>To Do</button>
        <button onClick={handleApplications}>My Applications</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }
  
  export default Header;