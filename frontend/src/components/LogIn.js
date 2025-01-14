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
      localStorage.setItem('token', response.data.access_token);
      login();
      navigate('/profile');
      setToken(response.data.token);
      alert("Login successful!");
    } catch (error) {
      alert("Login failed: " + error.response.data.detail);
    }
  };

  return (
    <div>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
        />
        <button type="submit">Log In</button>
      </form>
      {token && ( <h3>Your Token: {token}</h3>)}
    </div>
  );
}

export default LogIn;
