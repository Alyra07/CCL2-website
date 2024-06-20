import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { signUp } from '../assets/auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');
  const [images, setImages] = useState([]);
  const navigate = useNavigate();

  // images on the right side of the form
  useEffect(() => {
    const imageFilenames = 
    ['profile-img4.png', 
      'profile-img-rabbit.png', 
      'profile-img2.png',
      'profile-img-cat.png']; 
    setImages(imageFilenames);
  }, []);

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { data, error } = await signUp(email, password); // signUp function from auth.js

    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      const user = data.user;
      if (user && user.id) {
        try {
          const { data: existingProfile, error: fetchError } = await supabase
            .from('users')
            .select('*')
            .eq('email', email)
            .single();

          if (fetchError && fetchError.code !== 'PGRST116') {
            throw new Error(`Fetch error: ${fetchError.message}`);
          }
          // profile creation
          let profileMessage;
          if (existingProfile) {
            profileMessage = 'Profile already exists';
            if (error) {
              throw new Error(`Update error: ${error.message}`);
            }

          } else {
            const { data, error } = await supabase
              .from('users')
              .insert([{ id: user.id, email: user.email, name, surname }]);

            if (error) {
              throw new Error(`Insert error: ${error.message}`);
            }

            profileMessage = 'Profile created successfully';
          }

          console.log(`Sign up successful: ${user.email}. ${profileMessage}`);
          navigate('/login');
        } catch (profileError) {
          setMessage(`Sign up successful, but profile creation failed: ${profileError.message}`);
        }
      } else {
        setMessage('Sign up successful, but user ID is missing.');
      }
    }
  };

  return (
    <div className="p-4 md:p-10 lg:p-16 mt-10">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-10 lg:gap-32">
        <div className="bg-white rounded-lg shadow-lg p-10 flex items-center justify-center">
          <div className="w-full">
            <h2 className="text-3xl font-semibold text-primary mb-6 text-center">Register</h2>
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
                className="w-full bg-accent text-white py-3 rounded-lg hover:bg-red-300 transition duration-300"
              >
                Sign Up
              </button>
            </form>
            {message && <p className="mt-4 text-center text-accentred">{message}</p>}
          </div>
        </div>
        {/* Images */}
        <div className="hidden md:grid grid-cols-1 sm:grid-cols-2 gap-1">
          {images.map((image, index) => (
            <img
              key={index}
              src={`/profile/${image}`}
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