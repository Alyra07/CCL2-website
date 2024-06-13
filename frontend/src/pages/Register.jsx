import React, { useState } from 'react';
import { signUp } from '../assets/auth';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password);

    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      const user = data.user;
      if (user && user.id) {
        try {
          const response = await axios.post('http://localhost:3000/profile', {
            id: user.id,
            email: user.email,
            name: name,
            surname: surname
          });

          setMessage(`Sign up successful: ${user.email}`);
        } catch (profileError) {
          setMessage(`Sign up successful, but profile creation failed: ${profileError.response?.data?.error || profileError.message}`);
        }
      } else {
        setMessage('Sign up successful, but user ID is missing.');
      }
    }
  };

  return (
    <div className="flex items-center justify-center bg-background">
      <div className="w-full max-w-md min-w-sm bg-white rounded-lg shadow-lg mt-20 p-8">
        <h2 className="text-2xl font-bold text-primary mb-6 text-center">Register</h2>
        <form onSubmit={handleSignUp} className="space-y-4">
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
          <input
            type="text"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <input
            type="text"
            placeholder="Surname"
            value={surname}
            onChange={(e) => setSurname(e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary"
          />
          <button
            type="submit"
            className="w-full bg-primary text-white py-3 rounded-lg hover:bg-secondary transition duration-300"
          >
            Sign Up
          </button>
        </form>
        {message && <p className="mt-4 text-center text-red-500">{message}</p>}
      </div>
    </div>
  );
};

export default Register;