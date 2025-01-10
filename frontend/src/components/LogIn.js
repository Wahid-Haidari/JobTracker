import React, { useState } from "react";
import axios from "axios";

function LogIn({ onLoginSuccess }) {
  const [form, setForm] = useState({ username: "", password: "" });
  const [token, setToken] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post("http://127.0.0.1:8000/login", form);
      setToken(response.data.token);
      alert("Login successful!");
      onLoginSuccess();
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
