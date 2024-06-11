import React, { useState } from 'react';
import { signUp } from '../auth';

const Register = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [message, setMessage] = useState('');

  const handleSignUp = async (e) => {
    e.preventDefault();
    const { user, error } = await signUp(email, password);
    if (error) {
      setMessage(`Sign up failed: ${error.message}`);
    } else {
      setMessage(`Sign up successful: ${user.email}`);
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
        <button type="submit">Sign Up</button>
      </form>
      <p>{message}</p>
    </div>
  );
};

export default Register;