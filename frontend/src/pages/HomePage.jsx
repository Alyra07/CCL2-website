import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import { fetchAllListings } from '../assets/listings';

const HomePage = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllListings();

        // Extract unique countries from the listings
        const uniqueCountries = [...new Set(data.map(listing => listing.country).filter(Boolean))];
        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    getData();
  }, []);

  const handleSearch = async (searchCriteria) => {
    const listings = await fetchAllListings();
    const filtered = listings.filter((listing) => {
      const { country, guests, startDate, endDate } = searchCriteria;
      const matchesCountry = country === 'all' || (country ? (listing.country?.toLowerCase().includes(country.toLowerCase()) ?? false) : true);
      const matchesGuests = guests ? listing.guests >= guests : true;
      const matchesStartDate = startDate ? new Date(listing.availability.start) <= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(listing.availability.end) >= new Date(endDate) : true;
      return matchesCountry && matchesGuests && matchesStartDate && matchesEndDate;
    });

    navigate('/list', { state: { searchCriteria, filteredListings: filtered } });
  };

  return (
    <div className="flex flex-col items-center">
      <h1 className="text-3xl text-red-500">Hello World!</h1>
      <SearchBar onSearch={handleSearch} countries={countries} />
    </div>
  );
}

export default HomePage;