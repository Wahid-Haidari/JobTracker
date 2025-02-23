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
      <div className=''>

        <button onClick={handleLogout} className='bg-myDarkGreen text-myBackground py-1 px-3 w-20 
            text-sm rounded transition-transform duration-200 hover:scale-110 flex ml-auto  font-semibold' >Log Out</button>
        {isLoggedIn && <p className='text-4xl text-center text-myOrange font-bold'>Welcome, {user?.username}!</p>} {/* Display the logged-in user's username */}
        <div className='flex justify-center m-5'>
          <button onClick={handleTodo} 
          className='bg-myDarkGreen text-myBackground m-1 py-1 px-3 w-60 text-sm rounded 
          transition-transform duration-200 hover:scale-110  font-semibold'>To Do</button>
          <button onClick={handleApplications} 
          className='bg-myDarkGreen text-myBackground m-1 py-1 px-3 w-60 text-sm rounded
           transition-transform duration-200 hover:scale-110  font-semibold'>My Applications</button>

        </div>
        
        
      </div>
    );
  }
  
  export default Header;