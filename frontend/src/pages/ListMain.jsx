import React, { useEffect, useState } from 'react';
import { fetchAllListings } from '../assets/listings';
import SearchBar from '../components/SearchBar';

const ListMain = () => {
  const [searchCriteria, setSearchCriteria] = useState({});
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState([]);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllListings();
        setListings(data);
        setFilteredListings(data);

        // Extract unique countries from the listings
        const uniqueCountries = [...new Set(data.map(listing => listing.country).filter(Boolean))];
        setCountries(uniqueCountries);
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    filterListings();
  }, [searchCriteria, listings]);

  const filterListings = () => {
    const { country, guests, startDate, endDate } = searchCriteria;

    const filtered = listings.filter((listing) => {
      const matchesCountry = country === 'all' || (country ? (listing.country?.toLowerCase().includes(country.toLowerCase()) ?? false) : true);
      const matchesGuests = guests ? listing.guests >= guests : true;
      const matchesStartDate = startDate ? new Date(listing.availability.start) <= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(listing.availability.end) >= new Date(endDate) : true;

      return matchesCountry && matchesGuests && matchesStartDate && matchesEndDate;
    });

    setFilteredListings(filtered);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-red-500">List Main</h1>
        <SearchBar onSearch={setSearchCriteria} countries={countries} />
      </div>
      <div>
        {filteredListings.length === 0 ? (
          <p>Sorry, no listings available for your search criteria...</p>
        ) : (
          filteredListings.map((listing, index) => (
            <div key={index} className="listing">
              <h2>{listing.name}</h2>
              <p>{listing.address}</p>
              <p>{listing.country}</p>
              <p>{listing.price}</p>
              <p>{listing.guests}</p>
              <p>Available from {listing.availability.start} to {listing.availability.end}</p>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default ListMain;