import React, { useState, useContext } from "react";
import axios from "axios";
import { AuthContext } from '../contexts/AuthContext';
import { useNavigate } from 'react-router-dom';

function LogIn() {
  const [form, setForm] = useState({ username: "", password: "" });
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formData = new URLSearchParams();
    formData.append('username', form.username);
    formData.append('password', form.password);
    
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", formData);
      const token = response.data.access_token;
      localStorage.setItem('token', token);

      // Define the user object
      const user = { username: form.username };

      // Call login with the token and user data
      login(token, user); // Pass token and user object


      navigate('/profile');
      setToken(token);
      //alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.response.data.detail);
    }
  };

  return (
    <div className='bg-myBackground min-h-screen'>
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-20'>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className='m-1 py-1 px-3 w-60 rounded'
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className='m-1 py-1 px-3 w-60 rounded'
        />
        <button type="submit" 
        className="caret-transparent bg-myDarkGreen text-white m-1 py-1 px-3 w-60 
        text-sm rounded transition-transform duration-200 hover:scale-105">Log In</button>
      </form>
      {token && ( <h3>Your Token: {token}</h3>)}
    </div>
  );
}

export default LogIn;
