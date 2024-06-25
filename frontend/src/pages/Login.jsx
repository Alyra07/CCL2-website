import React, { useState } from 'react';
import { signIn } from '../assets/auth';
import { Link, useNavigate } from 'react-router-dom';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');
  const navigate = useNavigate();

  // sign in with assets/auth.js function on form submit
  const handleSignIn = async (e) => {
    e.preventDefault();
    const { data, error } = await signIn(email, password);
    if (error) {
      setMessage(`Sign in failed: ${error.message}`);
    } else {
      // Redirect to previous page after successful login
      navigate(-1); 
    }
  };

  return (
    <div className="p-4 md:p-10 lg:p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 lg:gap-24">
        {/* Login Form */}
        <div className="bg-white rounded-lg shadow-lg p-10 flex items-center justify-center">
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Login</h2>
            <form onSubmit={handleSignIn} className="space-y-4">
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
              />
              <button
                type="submit"
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-red-300 transition duration-300"
              >
                Sign In
              </button>
            </form>

            {message && <p className="mt-4 text-center text-accentred">{message}</p>}

            <div className="text-center mt-4">
              <Link to="/register" className="text-primary font-bold">
                Don't have an account yet? Sign up!
              </Link>
            </div>
          </div>
        </div>
        {/* Image on right side of the form */}
        <div className="flex items-center justify-center">
          <img
            src="/img/bg-illustration-red.jpeg"
            alt="Login illustration"
            className="w-full lg:w-3/4 h-auto object-cover rounded-lg"
          />
        </div>
      </div>
    </div>
  );
};

export default Login;