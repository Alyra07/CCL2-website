import React, { useState, useEffect } from 'react';
// MUI Components
import Slider from '@mui/material/Slider';
import Popper from '@mui/material/Popper';
// MUI Icons
import AmenityIcon from './AmenityIcon';
import TravelExploreRoundedIcon from '@mui/icons-material/TravelExploreRounded';
import TuneRoundedIcon from '@mui/icons-material/TuneRounded';

const SearchBar = ({ onSearch, onFilter, countries, initialValues, showFilters }) => {
  // Initialize state with values from localStorage or default values
  const [country, setCountry] = useState(localStorage.getItem('country') || initialValues?.country || 'all');
  const [guests, setGuests] = useState(localStorage.getItem('guests') || initialValues?.guests || '');
  const [startDate, setStartDate] = useState(localStorage.getItem('startDate') || initialValues?.startDate || '');
  const [endDate, setEndDate] = useState(localStorage.getItem('endDate') || initialValues?.endDate || '');
  // Filter states (in Popper)
  const [anchorEl, setAnchorEl] = useState(null);
  const [open, setOpen] = useState(false);
  const [priceRange, setPriceRange] = useState(JSON.parse(localStorage.getItem('priceRange')) || [0, 1000]);
  const [selectedAmenities, setSelectedAmenities] = useState(JSON.parse(localStorage.getItem('selectedAmenities')) || []);
  
  // Handle initialization of country when countries array changes
  useEffect(() => {
    if (countries.length > 0 && country === 'all') {
      setCountry('all');
    }
  }, [countries]);

    // Save to localStorage on update
    useEffect(() => {
      localStorage.setItem('country', country);
      localStorage.setItem('guests', guests);
      localStorage.setItem('startDate', startDate);
      localStorage.setItem('endDate', endDate);
      localStorage.setItem('priceRange', JSON.stringify(priceRange));
      localStorage.setItem('selectedAmenities', JSON.stringify(selectedAmenities));
    }, [country, guests, startDate, endDate, priceRange, selectedAmenities]);
  
  // Handler for filter Popper open/close
  const handlePopperClick = (event) => {
    setAnchorEl(event.currentTarget);
    setOpen((prevOpen) => !prevOpen);
  };

  const handlePriceChange = (event, newValue) => {
    setPriceRange(newValue);
  };

  const handleAmenityChange = (amenity) => {
    if (selectedAmenities.includes(amenity)) {
      setSelectedAmenities(selectedAmenities.filter(item => item !== amenity));
    } else {
      setSelectedAmenities([...selectedAmenities, amenity]);
    }
  };

  const handleApplyFilter = () => {
    const filterCriteria = { country, priceRange, amenities: selectedAmenities };
    onFilter(filterCriteria);
    setOpen(false);
  };

  const handleSearch = () => {
    onSearch({ country, guests, startDate, endDate, amenities: selectedAmenities });
  };


  return (
    <div>
      <div className="text-center px-6 py-4 bg-tertiary border border-secondary rounded-lg shadow-md">
        <h3 className='text-lg font-medium mb-4'>
          Where would you like to go next?</h3>
        {/* main SearchBar filters (HomePage & ListMain) */}
        <select value={country} onChange={(e) => setCountry(e.target.value)}
          className='w-64 p-3 border-2 border-secondary rounded-lg'>
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
          className='p-1 border-2 border-secondary rounded-lg lg:ml-2 md:ml-2'
        />
        <input
          type="date"
          placeholder="End Date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className='p-1 border-2 border-secondary rounded-lg lg:ml-2'
        />
        <button
          onClick={handleSearch}
          className='text-md text-white py-2 px-4 ml-4 md:ml-0 lg:ml-4 rounded-lg bg-accent hover:bg-red-300 transition duration-300'>
          <TravelExploreRoundedIcon fontSize='medium' className='' />
          
        </button>
        {/* Additional filters when showFilters is true (ListMain) */}
        {showFilters && (
          <div>
          <button // Filter button toggles Popper
            type='button'
            onClick={handlePopperClick}
            className='text-md text-white p-2 mt-4 rounded-lg bg-primary hover:bg-secondary transition duration-300'>
            <TuneRoundedIcon fontSize='medium' />
            <p className='hidden md:inline'> {open? "Close" : "Filter"}</p>
          </button>
          <Popper open={open} anchorEl={anchorEl}>
            {/* Popper content */}
            <div className="flex flex-col text-center py-6 px-8 mt-4 bg-background border border-secondary rounded-lg shadow-lg">
              <label>Price Range</label>
              <Slider
                value={priceRange}
                onChange={handlePriceChange}
                valueLabelFormat={(value) => `${value} € / night`}
                valueLabelDisplay="auto"
                min={0} 
                max={1000}
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
                  className='p-4 mb-4 mt-2'
                />

                <label className="">Amenities</label>
                <div className='my-4 gap-4 flex flex-wrap'>
                  {['wifi', 'cooler', 'kitchen', 'parking', 'pool'].map((amenity) => (
                    <button
                      key={amenity}
                      onClick={() => handleAmenityChange(amenity)}
                      className={`p-4 rounded-lg transition duration-300 
                        ${selectedAmenities.includes(amenity) ? 'bg-primary text-white' : 'bg-tertiary text-gray-700 hover:bg-secondary hover:text-white'}`}
                    >
                      <AmenityIcon amenity={amenity} />
                      <span className='hidden md:inline ml-2'>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                    </button>
                  ))}
                </div>

                <button
                  onClick={handleApplyFilter}
                  className='text-white p-2 mt-4 lg:mt-6 rounded-lg bg-accent hover:bg-red-300 transition duration-300 mx-auto'>
                  Apply
              </button>
            </div>
          </Popper>
          </div>
        )}
      </div>
    </div>
  );
};

export default SearchBar;