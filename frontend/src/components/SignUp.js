import React, { useState } from "react";
import { api } from "../api";

function SignUp() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await api.post("/signup", form);
      alert(response.data.message);
    } catch (error) {
      alert("Registration failed: " + error.response.data.detail);
    }
  };

  return (
    <div className="bg-myBackground min-h-screen">
      <form onSubmit={handleSubmit} className='flex flex-col items-center p-20'>
        <input
          type="text"
          placeholder="Username"
          value={form.username}
          onChange={(e) => setForm({ ...form, username: e.target.value })}
          className='flex-1 py-3 px-4 m-3 border text-center font-semibold min-w-[200px] font-semibold'
        />
        <input
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          className='flex-1 py-3 m-3 px-4 border text-center font-semibold min-w-[200px] font-semibold'
        />
        <input
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          className='flex-1 py-3 px-4 m-3 border text-center font-semibold min-w-[200px] font-semibold'
        />
        <button type="submit"
        className="caret-transparent bg-myDarkGreen text-white m-1 py-1 px-3 w-60 
        text-sm rounded transition-transform duration-200 hover:scale-105 font-semibold">Register</button>
        
      </form>
    </div>
  );
}

export default SignUp;