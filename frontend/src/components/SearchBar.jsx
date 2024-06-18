import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';
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
    <div className='text-center p-4 bg-tertiary border border-secondary rounded-lg shadow-md'>
      <h3 className='text-lg font-medium mb-4 md:mb-6 sm:mb-6'>Where do you want to go next?</h3>
      
      <div className="">
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className='p-2 border-2 border-secondary rounded-lg'>
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
          className='p-1 border-2 border-secondary rounded-lg ml-2'
        />
        <input
          type="date"
          placeholder="Start Date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className='p-1 border-2 border-secondary rounded-lg lg:ml-2 md:ml-2 sm:ml-0'
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='p-1 border-2 border-secondary rounded-lg ml-2'
        />
        <button 
        onClick={handleSearch}
        className='text-md text-white py-2 px-4 ml-2 sm:mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
          <FontAwesomeIcon icon={faMagnifyingGlass} className='mr-2' />
          Search
        </button>
      </div>
    </div>
  );
};

export default SearchBar;