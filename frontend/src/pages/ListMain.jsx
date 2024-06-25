import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { fetchAllListings } from '../assets/listings';
import { useUser } from '../assets/UserContext';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import Pagination from '@mui/material/Pagination';

const ListMain = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();

  const getInitialState = (key) => {
    try {
      const stateFromLocation = location.state ? location.state[key] : null;
      const stateFromStorage = localStorage.getItem(key) ? JSON.parse(localStorage.getItem(key)) : null;
      return stateFromLocation || stateFromStorage || {};
    } catch (error) {
      console.error(`Error parsing ${key} from localStorage`, error);
      return {};
    }
  };

  const [searchCriteria, setSearchCriteria] = useState(() => getInitialState('searchCriteria'));
  const [filteredListings, setFilteredListings] = useState(() => getInitialState('filteredListings'));
  const [listings, setListings] = useState([]);
  const [countries, setCountries] = useState([]);
  const listingsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const lastPage = Math.ceil(filteredListings.length / listingsPerPage);

  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllListings();
        setListings(data);
        const uniqueCountries = [...new Set(data.map(listing => listing.country).filter(Boolean))];
        setCountries(uniqueCountries);

        if (!filteredListings.length) {
          setFilteredListings(data);
        } else {
          filterListings(data, searchCriteria);
        }
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    getData();
  }, []);

  useEffect(() => {
    filterListings(listings, searchCriteria);
  }, [searchCriteria, listings]);

  useEffect(() => {
    localStorage.setItem('filteredListings', JSON.stringify(filteredListings));
    localStorage.setItem('searchCriteria', JSON.stringify(searchCriteria));
  }, [filteredListings, searchCriteria]);

  const filterListings = (listings, criteria) => {
    const { country, guests, startDate, endDate } = criteria;
    const filtered = listings.filter((listing) => {
      const matchesCountry = country === 'all' || (country ? (listing.country?.toLowerCase().includes(country.toLowerCase()) ?? false) : true);
      const matchesGuests = guests ? listing.guests >= guests : true;
      const matchesStartDate = startDate ? new Date(listing.availability.start) <= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(listing.availability.end) >= new Date(endDate) : true;

      return matchesCountry && matchesGuests && matchesStartDate && matchesEndDate;
    });

    setFilteredListings(filtered);
    localStorage.setItem('filteredListings', JSON.stringify(filtered));
  };

  const handleApplyFilter = (filterCriteria) => {
    const { country, priceRange, amenities } = filterCriteria;
    const [minPrice, maxPrice] = priceRange;

    const filtered = listings.filter((listing) => {
      const matchesCountry = country === 'all' || listing.country.toLowerCase() === country.toLowerCase();
      const matchesPriceRange = (!minPrice || listing.price >= minPrice) && (!maxPrice || listing.price <= maxPrice);
      const matchesAmenities = amenities.length === 0 || amenities.every(amenity => listing.amenities[amenity]);

      return matchesCountry && matchesPriceRange && matchesAmenities;
    });

    setFilteredListings(filtered);
    localStorage.setItem('filteredListings', JSON.stringify(filtered));
    localStorage.setItem('searchCriteria', JSON.stringify(filterCriteria));
  };

  const handleListingClick = (id) => {
    navigate(`/list/${id}`);
  };

  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  const startIndex = (currentPage - 1) * listingsPerPage;
  const currentListings = filteredListings.slice(startIndex, startIndex + listingsPerPage);

  return (
    <div className='p-4 md:p-10 lg:p-16'>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl text-primary font-semibold mb-6">Find Your Perfect Stay</h1>
        <SearchBar
          onSearch={(criteria) => {
            setSearchCriteria(criteria);
            filterListings(listings, criteria);
          }}
          showFilters={true}
          onFilter={handleApplyFilter}
          countries={countries}
          initialValues={searchCriteria}
        />
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {currentListings.length === 0 ? (
          <p className="col-span-full text-lg text-center">
            No matches for your search criteria...
          </p>
        ) : (
          currentListings.map((listing) => (
            <ListingCard
              key={listing.id}
              listing={listing}
              user={user ? user : listing.id}
              handleClick={handleListingClick}
            />
          ))
        )}
      </div>
      {filteredListings.length > listingsPerPage && (
        <div className="flex justify-center mt-8">
          <Pagination
            count={lastPage}
            page={currentPage}
            onChange={handlePageChange}
            shape="rounded"
          />
        </div>
      )}
    </div>
  );
};

export default ListMain;