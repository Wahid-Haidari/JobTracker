import { useContext } from 'react';
import { useNavigate} from 'react-router-dom';
import { AuthContext } from '../contexts/AuthContext';
import axios from 'axios';

function Header() {

    const navigate = useNavigate();
    const { logout } = useContext(AuthContext);

    const handleTodo = () => {
      navigate('/profile/todo');
    };

    const handleApplications = async () => {
      try{

        const token = localStorage.getItem('token'); // or retrieve it from context
        const response = await axios.get("http://127.0.0.1:8000/applications", {
          headers: {
            Authorization: `Bearer ${token}`,
          },

        });
        navigate('/profile/applications');

      } catch (error){
        console.error("Error fetching applications:", error);
        alert("Failed to fetch applications. Please log in again.");
      
      }

     
    };

    const handleLogout = () => {
      logout();
      navigate('/');
    };

    return (
      <div>
        <button onClick={handleTodo}>To Do</button>
        <button onClick={handleApplications}>My Applications</button>
        <button onClick={handleLogout}>Log Out</button>
      </div>
    );
  }
  
  export default Header;