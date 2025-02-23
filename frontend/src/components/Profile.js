import { Routes, Route } from 'react-router-dom';
import Header from "./Header";
import Todo from './Todo';
import Applications from './Applications';

function Profile() {
    return (
      <div className='bg-myBackground min-h-screen py-3 px-5'>
        <Header/>
        <Routes>
            <Route path="todo" element={<Todo />} />
            <Route path="applications" element={<Applications />} />
        </Routes>
      </div>
    );
  }
  
  export default Profile;