import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllListings } from '../assets/listings';
import SearchBar from '../components/SearchBar';

const ListMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchCriteria, setSearchCriteria] = useState(location.state?.searchCriteria || {});
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState(location.state?.filteredListings || []);
  const [countries, setCountries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllListings();
        setListings(data);

        // Extract unique countries from the listings
        const uniqueCountries = [...new Set(data.map(listing => listing.country).filter(Boolean))];
        setCountries(uniqueCountries);

        if (!location.state?.filteredListings) {
          setFilteredListings(data);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    getData();
  }, [location.state?.filteredListings]);

  useEffect(() => {
    // Always filter listings based on the current search criteria
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

  const handleListingClick = (id) => {
    navigate(`/list/${id}`);
  };

  return (
    <div>
      <div className="flex flex-col items-center">
        <h1 className="text-3xl text-red-500">List Main</h1>
        <SearchBar onSearch={setSearchCriteria} countries={countries} initialValues={searchCriteria} />
      </div>
      <div>
        {filteredListings.length === 0 ? (
          <p>No listings available</p>
        ) : (
          filteredListings.map((listing, index) => (
            <div key={index} className="listing" onClick={() => handleListingClick(listing.id)}>
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