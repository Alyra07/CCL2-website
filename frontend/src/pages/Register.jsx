import React, { useState, useEffect } from 'react';
import { signUp } from '../assets/auth';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);

  // images on the right side of the form
  useEffect(() => {
    const imageFilenames = 
    ['profile-img3.png', 
      'profile-img4.png', 
      'profile-img1.png', 
      'profile-img2.png'];
    setImages(imageFilenames);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password);

    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      const user = data.user;
      if (user && user.id) {
        try {
          const response = await axios.post('http://localhost:5000/profile', {
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
    <div className="p-4 md:p-10 lg:p-16">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-32">
        <div className="bg-white rounded-lg shadow-lg p-10 flex items-center justify-center">
          <div className="w-full">
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
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-1">
          {images.map((image, index) => (
            <img
              key={index}
              src={`/img/${image}`}
              alt={`Gallery image ${index + 1}`}
              className="w-3/4 h-auto object-cover rounded-lg"
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Register;