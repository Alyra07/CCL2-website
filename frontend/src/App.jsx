import React, { useState } from 'react';
import axios from 'axios';
import MyComponent from './components/MyComponent';

const App = () => {
  const [data, setData] = useState('');
  const [response, setResponse] = useState('');

  const handleChange = (e) => {
    setData(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:3000/', { data });
      setResponse(res.data);
    } catch (error) {
      console.error('Error sending data', error);
    }
  };

  return (
    <div className="">
      <h1>Hello World!</h1>
      <form onSubmit={handleSubmit}>
        <input type="text" value={data} onChange={handleChange} />
        <button type="submit">Send</button>
      </form>
      <p>Response: {response}</p>
      <MyComponent />
    </div>
  );
};

export default App;