import React, { useState } from 'react';
import { signUp } from '../auth';
import axios from 'axios';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [surname, setSurname] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { error } = await signUp(email, password);

    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      const user = data.user; // Accessing the user object properly
      if (user && user.id) {
        // Creating a profile
        try {
          await axios.post('/profile', {
            id: user.id,
            email: user.email,
            name: name,
            surname: surname
          });
        
          setMessage(`Sign up successful: ${user.email}`);
        } catch (profileError) {
          setMessage(`Sign up successful, but profile creation failed: ${profileError.message}`);
        }
      } else {
        setMessage('Sign up successful, but user ID is missing.');
      }
    }
  };

  return (
    <div>
      <h2>Register</h2>
      <form onSubmit={handleSignUp}>
        <input
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <input
          type="text"
          placeholder="Name"
          value={name}
          onChange={(e) => setName(e.target.value)}
        />
        <input
          type="text"
          placeholder="Surname"
          value={surname}
          onChange={(e) => setSurname(e.target.value)}
        />
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;