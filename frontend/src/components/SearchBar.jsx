import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, countries, initialValues }) => {
  const [country, setCountry] = useState(initialValues?.country || '');
  const [guests, setGuests] = useState(initialValues?.guests || '');
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');

  // Handle initialization of country when countries array changes
  useEffect(() => {
    if (countries.length > 0 && country === '') {
      setCountry('all'); // Default to 'Just take me away' when countries are available
    }
  }, [countries]);

  // Update state when initialValues change
  useEffect(() => {
    if (initialValues) {
      setCountry(initialValues.country || '');
      setGuests(initialValues.guests || '');
      setStartDate(initialValues.startDate || '');
      setEndDate(initialValues.endDate || '');
    }
  }, [initialValues]);

  const handleSearch = () => {
    onSearch({ country, guests, startDate, endDate });
  };

  return (
    <div className="">
      <select value={country} onChange={(e) => setCountry(e.target.value)}
        className='p-1 rounded-lg'>
        <option value="all">Just take me away</option>
        {countries.map((c, index) => (
          <option key={index} value={c}>{c}</option>
        ))}
      </select>
      <input
        type="number"
        placeholder="Guests"
        value={guests}
        onChange={(e) => setGuests(e.target.value)}
        className='p-1 rounded-lg mx-2'
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
        className='p-1 rounded-lg'
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
        className='p-1 rounded-lg pl-2'
      />
      <button onClick={handleSearch}
      className='p-1 rounded-lg bg-primary hover:bg-secondary ml-2'>
        Search
      </button>
    </div>
  );
};

export default SearchBar;