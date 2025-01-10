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
        <div>
            <button onClick={handleSignUp}>Sign Up</button>
            <button onClick={handleLogIn}>Log In</button>
            
        </div>
    )
}

export default Authentication;
