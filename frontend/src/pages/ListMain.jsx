import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllListings } from '../assets/listings';
import { useUser } from '../assets/UserContext';
import SearchBar from '../components/SearchBar';
import ListingCard from '../components/ListingCard';
import Pagination from '@mui/material/Pagination';

const ListMain = () => {
  const { user } = useUser();
  const location = useLocation();
  const [searchCriteria, setSearchCriteria] = useState(location.state?.searchCriteria || {});
  const [listings, setListings] = useState([]);
  const [filteredListings, setFilteredListings] = useState(location.state?.filteredListings || []);
  const [countries, setCountries] = useState([]);
  const navigate = useNavigate();

  // Pagination states
  const [currentPage, setCurrentPage] = useState(1);
  const listingsPerPage = 10; // Define how many listings per page
  const lastPage = Math.ceil(filteredListings.length / listingsPerPage);

  // Fetch all listings from database
  useEffect(() => {
    const getData = async () => {
      try {
        const data = await fetchAllListings();
        setListings(data);
        // Extract unique countries from listings
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
    filterListings();
  }, [searchCriteria, listings]);

  useEffect(() => {
    if (location.state && location.state.searchCriteria && location.state.filteredListings) {
      setSearchCriteria(location.state.searchCriteria);
      setFilteredListings(location.state.filteredListings);
    }
  }, [location.state]);

  const filterListings = () => {
    const { country, guests, startDate, endDate } = searchCriteria;
    // Filter listings based on main search criteria
    const filtered = listings.filter((listing) => {
      const matchesCountry = country === 'all' || (country ? (listing.country?.toLowerCase().includes(country.toLowerCase()) ?? false) : true);
      const matchesGuests = guests ? listing.guests >= guests : true;
      const matchesStartDate = startDate ? new Date(listing.availability.start) <= new Date(startDate) : true;
      const matchesEndDate = endDate ? new Date(listing.availability.end) >= new Date(endDate) : true;

      return matchesCountry && matchesGuests && matchesStartDate && matchesEndDate;
    });

    setFilteredListings(filtered);
  };

  // Filter listings based on price & amenities filter criteria
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

  // Handle click on ListingCard
  const handleListingClick = (id) => {
    navigate(`/list/${id}`);
  };

  // Pagination change handler
  const handlePageChange = (event, value) => {
    setCurrentPage(value);
  };

  // Calculate listings to display for current page
  const startIndex = (currentPage - 1) * listingsPerPage;
  const currentListings = filteredListings.slice(startIndex, startIndex + listingsPerPage);

  return (
    <div className='p-4 md:p-10 lg:p-16'>
      <div className="flex flex-col items-center mb-8">
        <h1 className="text-3xl text-primary font-semibold mb-6">Find Your Perfect Stay</h1>
        <SearchBar
          onSearch={(criteria) => {
            setSearchCriteria(criteria);
            filterListings(criteria);
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
          currentListings.map((listing, index) => (
            <ListingCard
              key={index}
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