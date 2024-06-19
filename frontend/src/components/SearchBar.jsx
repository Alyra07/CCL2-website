import React, { useState, useEffect } from 'react';
// MUI Components / Icons
import Slider from '@mui/material/Slider';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';

const SearchBar = ({ onSearch, onFilter, countries, initialValues, showFilters }) => {
  const [country, setCountry] = useState(initialValues?.country || 'all');
  const [guests, setGuests] = useState(initialValues?.guests || '');
  const [startDate, setStartDate] = useState(initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(initialValues?.endDate || '');

  // Filter state
  const [isOpen, setIsOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 1000]);
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

  // Handler for price range slider changes
  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  // Handler for amenity checkbox changes
  const handleAmenityChange = (e, amenity) => {
    if (e.target.checked) {
      setSelectedAmenities([...selectedAmenities, amenity]);
    } else {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    }
  };

  const handleSearch = () => {
    onSearch({ country, guests, startDate, endDate });
  };

  // Handle filter application
  const handleApplyFilter = () => {
    const filterCriteria = { country, priceRange, amenities: selectedAmenities };
    onFilter(filterCriteria);
  };

  return (
    <div>
      <div className="text-center p-4 bg-tertiary border border-secondary rounded-lg shadow-md">
        <h3 className='text-lg font-medium mb-4 md:mb-6 sm:mb-6'>
          Where do you want to go next?</h3>
        {/* main SearchBar filters (HomePage & ListMain) */}
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className='w-64 p-2 border-2 border-secondary rounded-lg'>
          <option value="all">Just take me away</option>
          {countries.map((c, index) => (
            <option key={index} value={c}>{c}</option>
          ))}
        </select>
        <input
          type="number"
          placeholder="Guests"
          min={1}
          value={guests}
          onChange={(e) => setGuests(e.target.value)}
          className='w-24 p-1 border-2 border-secondary rounded-lg ml-2'
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
          className='text-md text-white py-2 px-4 ml-4 mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
          <TravelExploreRoundedIcon fontSize='medium' className='' />
          
        </button>
        {/* Additional filters when showFilters is true (ListMain) */}
        {showFilters && (
          <button
            onClick={() => setIsOpen(!isOpen)}
            className='text-md text-white py-2 px-4 ml-2 sm:mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
            Filters
          </button>
        )}
      </div>
  
      <div> {/* open additional filters (toggle filters) */}
        {showFilters && isOpen && (
          <div className="text-center p-4 bg-light-gray border border-tertiary rounded-lg shadow-md ">
            <label className="">Price Range:</label>
            <Slider
              value={priceRange}
              onChange={handlePriceChange}
              valueLabelDisplay="auto"
              min={0} 
              max={1000}
              getAriaLabel={() => 'Price range'}
              valueLabelFormat={(value) => `${value} € / night`}
              sx={{ // styles for slider
                '& .MuiSlider-thumb': {
                  color: '#f07167',
                },
                '& .MuiSlider-track': {
                  color: '#00afb9',
                },
                '& .MuiSlider-rail': {
                  color: '#a8dadc',
                },
              }}
              className='p-1 text-primary rounded-lg'
            />
            <label className="">Amenities:</label>
            <div>
              <input type="checkbox" id="wifi" value="wifi" 
              onChange={(e) => handleAmenityChange(e, 'wifi')} />
              <label htmlFor="wifi">Wifi</label>
              <input type="checkbox" id="cooler" value="cooler" 
              onChange={(e) => handleAmenityChange(e, 'cooler')} />
              <label htmlFor="cooler">Cooler</label>
              <input type="checkbox" id="kitchen" value="kitchen" 
              onChange={(e) => handleAmenityChange(e, 'kitchen')} />
              <label htmlFor="kitchen">Kitchen</label>
              <input type="checkbox" id="parking" value="parking" 
              onChange={(e) => handleAmenityChange(e, 'parking')} />
              <label htmlFor="parking">Parking</label>
              <input type="checkbox" id="pool" value="pool" 
              onChange={(e) => handleAmenityChange(e, 'pool')} />
              <label htmlFor="pool">Pool</label>
              {/* Add more checkboxes for other amenities */}
            </div>
            <button
              onClick={handleApplyFilter}
              className='text-md text-white py-2 px-4 sm:mt-2 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
              Apply Filters
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;