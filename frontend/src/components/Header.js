import { useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';

function Header() {

    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);
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
        <button onClick={handleTodo}>To Do</button>
        <button onClick={handleApplications }>My Applications</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }
  
  export default Header;