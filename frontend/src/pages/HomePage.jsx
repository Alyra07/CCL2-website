import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import SearchBar from '../components/SearchBar';
import Footer from '../components/Footer';
import { fetchAllListings } from '../assets/listings';

const HomePage = () => {
  const navigate = useNavigate();
  const [countries, setCountries] = useState([]);
  const [popularCountries, setPopularCountries] = useState([]);

  useEffect(() => {
    const getData = async () => {
      try {
        // Fetch all listings from supabase (auth.js)
        const data = await fetchAllListings();

        // Extract countries and count listings per country
        const countryCount = data.reduce((acc, listing) => {
          const country = listing.country;
          acc[country] = (acc[country] || 0) + 1;
          return acc;
        }, {});

        // Convert to array of objects and sort by number of listings
        const sortedCountries = Object.entries(countryCount)
          .map(([country, count]) => ({ country, count }))
          .sort((a, b) => b.count - a.count);

        // Select the top 3 countries
        const topCountries = sortedCountries.slice(0, 4);
        setCountries(sortedCountries.map(({ country }) => country)); // Set countries for search bar
        setPopularCountries(topCountries); // Set popular countries for display
      } catch (error) {
        console.error("Error fetching listings:", error);
      }
    };

    getData();
  }, []);

  const handleSearch = async (searchCriteria) => {
    // Handle search criteria and filter listings in ListMain
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
    <div>
      <div>
        {/* Header with image */}
        <header className="text-center w-full">
          <div className="relative">
            <img 
              src="/img/bg-illustration-red.jpeg" 
              alt="Travel" 
              className="w-full h-64 object-cover" 
              onError={(e) => e.target.src = '/img/bg-bedroom.jpg'}
            />
            {/* Website title with SearchBar */}
            <div className="flex flex-col p-4 absolute inset-0 bg-dark-gray bg-opacity-65 items-center justify-center">
              <h1 className="flex flex-col text-center mt-12 mb-6 text-4xl font-bold text-white">
                Welcome to Lodgify!
              </h1>
              <p className="hidden md:block text-white text-lg mb-6">
                Find your stay on this awesome travel platform.
              </p>
              <SearchBar 
                onSearch={handleSearch} 
                countries={countries} // list of all countries
                showFilters={false} // no addtional filters
              />
            </div>
          </div>
        </header>
        {/* Popular places section */}
        <section className="w-full max-w-screen-lg mt-4 mb-8 mx-auto py-8 px-4">
          <h2 className="text-primary text-2xl font-semibold mb-4 text-center">Popular Places</h2>
          {/* popularCountries grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {popularCountries.map(({ country }) => (
              <div key={country} className="bg-white shadow-md rounded-lg overflow-hidden">
                <div className="relative">
                  <img 
                    src={`/img/${country}.jpg`} 
                    alt={country} 
                    className="w-full h-64 object-cover" 
                    onError={(e) => e.target.src = '/img/placeholder.jpg'}
                    // predefined images for some example countries, but use a placeholder image if needed
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center">
                    <h3 className="text-2xl text-white font-semibold">{country}</h3>
                  </div>
                </div>
                <div className="p-6">
                  <p className="text-gray-700 mb-2">Discover the best places to stay in {country}.</p>
                  <button
                    // Pass chosen country & empty filteredListings to ListMain
                    onClick={() => navigate('/list', { state: { searchCriteria: { country: country.toLowerCase() }, filteredListings: [] } })}
                    className="bg-primary text-white py-2 px-4 rounded hover:bg-secondary transition-colors duration-300"
                  >
                    Explore {country}
                  </button>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
      {/* Footer component only on HomePage just for styles :) */}
      <Footer />
    </div>
  );
}

export default HomePage;