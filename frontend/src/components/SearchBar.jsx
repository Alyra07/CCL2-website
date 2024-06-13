import React, { useState, useEffect } from 'react';

const SearchBar = ({ onSearch, countries, initialValues }) => {
  const [country, setCountry] = useState(initialValues?.country || '');
  const [guests, setGuests] = useState(initialValues?.guests || '');
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');

  useEffect(() => {
    if (countries.length > 0 && country === '') {
      setCountry('all'); // Default to 'Just take me away'
    }
  }, [countries]);

  const handleSearch = () => {
    onSearch({ country, guests, startDate, endDate });
  };

  return (
    <div className="search-bar">
      <select value={country} onChange={(e) => setCountry(e.target.value)}>
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
      />
      <input
        type="date"
        placeholder="Start Date"
        value={startDate}
        onChange={(e) => setStartDate(e.target.value)}
      />
      <input
        type="date"
        placeholder="End Date"
        value={endDate}
        onChange={(e) => setEndDate(e.target.value)}
      />
      <button onClick={handleSearch}>Search</button>
    </div>
  );
};

export default SearchBar;