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
      <h2 className="text-3xl mb-8">Login</h2>
      <form onSubmit={handleSignIn} className="flex flex-col">
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded-md"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="mb-2 p-2 border border-gray-400 rounded-md"
        />
        <button 
          type="submit" 
          className="p-2 mt-2 bg-primary hover:bg-secondary text-white rounded-md">
            Sign In
        </button>
      </form>
      <p className="mt-8">{message}</p>
      <Link to="/register" className="mt-4">
      Don't have an account yet?{' '}
      <span className='text-bold text-primary'>Sign up!</span>
      </Link>
    </div>
  );
};

export default Login;