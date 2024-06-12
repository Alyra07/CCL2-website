import React, { useState } from 'react';
import { signIn } from '../assets/auth';
import { Link } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignIn = async (e) => {
    e.preventDefault();
    const { data, error } = await signIn(email, password);
    if (error) {
      setMessage(`Sign in failed: ${error.message}`);
    } else {
      setMessage(`Sign in successful: ${data.user.email}`);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center h-full">
      <h2 className="text-2xl mb-4">Login</h2>
      <form onSubmit={handleSignIn} className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border border-gray-300"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border border-gray-300"
        />
        <button type="submit" className="p-2 bg-blue-500 text-white">Sign In</button>
      </form>
      <p className="mt-4">{message}</p>
      <Link to="/register" className="mt-4">Don't have an account? Register here.</Link>
    </div>
  );
};

export default Login;