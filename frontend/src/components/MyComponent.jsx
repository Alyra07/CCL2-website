import React, { useEffect, useState } from 'react';
import axios from 'axios';

const MyComponent = () => {
  const [message, setMessage] = useState('');

  useEffect(() => {
    const fetchMessage = async () => {
      try {
        const res = await axios.get('http://localhost:3000/');
        setMessage(res.data);
      } catch (error) {
        console.error('Error fetching message', error);
      }
    };

    fetchMessage();
  }, []);

  return (
    <div>
      <h2>Message from server:</h2>
      <p>{message}</p>
    </div>
  );
};

export default MyComponent;