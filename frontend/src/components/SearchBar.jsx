import React, { useState, useEffect } from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faMagnifyingGlass } from '@fortawesome/free-solid-svg-icons';

const SearchBar = ({ onSearch, onFilter, countries, initialValues }) => {
  const [country, setCountry] = useState(initialValues?.country || 'all');
  const [guests, setGuests] = useState(initialValues?.guests || '');
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');

  // Filter state
  const [isOpen, setIsOpen] = useState(false);
  const [minPrice, setMinPrice] = useState('');
  const [maxPrice, setMaxPrice] = useState('');
  const [selectedAmenities, setSelectedAmenities] = useState([]);

  // Handle initialization of country when countries array changes
  useEffect(() => {
    if (countries.length > 0 && country === 'all') {
      setCountry('all');
    }
  }, [countries]);

  // Update state when initialValues change
  useEffect(() => {
    if (initialValues) {
      setCountry(initialValues.country || 'all');
      setGuests(initialValues.guests || '');
      setStartDate(initialValues.startDate || '');
      setEndDate(initialValues.endDate || '');
    }
  }, [initialValues]);

  // Handler for amenity checkbox changes
  const handleAmenityChange = (e, amenity) => {
    if (e.target.checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    }
  };

  // Handle search action
  const handleSearch = () => {
    onSearch({ country, guests, startDate, endDate });
  };

  // Handle filter application
  const handleApplyFilter = () => {
    const filterCriteria = { country, minPrice, maxPrice, amenities: selectedAmenities };
    onFilter(filterCriteria);
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
        <button
          onClick={() => setIsOpen(!isOpen)}
          className='text-md text-white py-2 px-4 ml-2 sm:mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
          Toggle Filters
        </button>
      </div>

      {isOpen && (
        <div className="mt-4">
          <input
            type="number"
            placeholder="Min Price"
            value={minPrice}
            onChange={(e) => setMinPrice(e.target.value)}
            className='p-1 border-2 border-secondary rounded-lg ml-2'
          />
          <input
            type="number"
            placeholder="Max Price"
            value={maxPrice}
            onChange={(e) => setMaxPrice(e.target.value)}
            className='p-1 border-2 border-secondary rounded-lg ml-2'
          />
          <label className="ml-2">Amenities:</label>
          <div>
            <input type="checkbox" id="wifi" value="wifi" onChange={(e) => handleAmenityChange(e, 'wifi')} />
            <label htmlFor="wifi">Wifi</label>
            <input type="checkbox" id="cooler" value="cooler" onChange={(e) => handleAmenityChange(e, 'cooler')} />
            <label htmlFor="cooler">Cooler</label>
            <input type="checkbox" id="kitchen" value="kitchen" onChange={(e) => handleAmenityChange(e, 'kitchen')} />
            <label htmlFor="kitchen">Kitchen</label>
            <input type="checkbox" id="parking" value="parking" onChange={(e) => handleAmenityChange(e, 'parking')} />
            <label htmlFor="parking">Parking</label>
            <input type="checkbox" id="pool" value="pool" onChange={(e) => handleAmenityChange(e, 'pool')} />
            <label htmlFor="pool">Pool</label>
            {/* Add more checkboxes for other amenities */}
          </div>
          <button
            onClick={handleApplyFilter}
            className='text-md text-white py-2 px-4 ml-2 sm:mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
            Apply Filters
          </button>
        </div>
      )}
    </div>
  );
};

export default SearchBar;