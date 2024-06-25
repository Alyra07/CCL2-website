import React, { useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router-dom'; // Removed useHistory
import { fetchAllListings } from '../assets/listings';
import { useUser } from '../assets/UserContext';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import Pagination from '@mui/material/Pagination';

const ListMain = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const location = useLocation();
  // Helper function to get initial state from location.state
  const getInitialState = (key) => {
    try {
      const stateFromLocation = location.state ? location.state[key] : null;
      return stateFromLocation || {};
    } catch (error) {
      console.error(`Error parsing ${key} from location.state`, error);
      return {};
    }
  };
  // Initialize searchCriteria & filteredListings with values from location.state or empty objects
  const [searchCriteria, setSearchCriteria] = useState(() => getInitialState('searchCriteria'));
  const [filteredListings, setFilteredListings] = useState([]);
  const [listings, setListings] = useState([]);
  const [countries, setCountries] = useState([]);
  // Pagination
  const listingsPerPage = 9;
  const [currentPage, setCurrentPage] = useState(1);
  const lastPage = Math.ceil(filteredListings.length / listingsPerPage);

  useEffect(() => {
    const getData = async () => {
      try { // get all listings from supabase
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

  // Update displayed listings when search criteria or listings change
  useEffect(() => {
    filterListings(listings, searchCriteria);
  }, [searchCriteria, listings]);

  // Hook for updating location state when navigating (e.g. back from DetailsPage)
  useEffect(() => {
    // update location state with new search criteria and filtered listings
    const newState = {
      ...location.state,
      searchCriteria,
      filteredListings,
    };
    // Only navigate if the new state is different from the current state
    if (JSON.stringify(location.state) !== JSON.stringify(newState)) {
      navigate(location.pathname, {
        state: newState,
        replace: true,
      });
    }
  }, [searchCriteria, filteredListings, navigate, location]);

  // Filter listings based on main search criteria
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
  };

  // Filter listings based on filter criteria (onFilter from SearchBar)
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