import { useNavigate } from 'react-router-dom';

function Authentication(){

    const navigate = useNavigate();

    const handleSignUp = () => {
        navigate('/signup');
      };

    const handleLogIn = () => {
        navigate('/login');
    };

    return(
        <div className='caret-transparent  text-myBackground m-10 flex justify-center items-center '>
            <button onClick={handleSignUp} className='bg-myDarkGreen m-1 py-1 px-3 w-20 text-sm rounded transition-transform duration-200 hover:scale-110'>Sign Up</button>
            <button onClick={handleLogIn} className='bg-myDarkGreen m-1 py-1 px-3 w-20 text-sm rounded transition-transform duration-200 hover:scale-110'>Log In</button>
            
        </div>
    )
}

export default Authentication;
