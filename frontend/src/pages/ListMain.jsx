import React, { useEffect, useState } from 'react';
import { fetchAllListings } from '../assets/listings';
import SearchBar from '../components/SearchBar';
  
  const ListMain = () => {
    // search in list
    const [searchTerm, setSearchTerm] = useState('');
    const [listings, setListings] = useState([]);

    useEffect(() => {
      const getData = async () => {
        try {
          const data = await fetchAllListings();
          setListings(data); // Adjust based on the structure of the API response
        } catch (error) {
          console.error("Error fetching listings:", error);
        }
      };
  
      getData();
    }, []);
  
    return (
      <div>
        <div className="flex flex-col items-center">
          <h1 className="text-3xl text-red-500">List Main</h1>
          <SearchBar onSearch={setSearchTerm}/>
        </div>
        <div>
          {listings.length === 0 ? (
            <p>No listings available</p>
          ) : (
            listings.map((listing, index) => (
              <div key={index} className="listing">
                <h2>{listing.name}</h2>
                <p>{listing.address}</p>
                <p>{listing.price}</p>
                <p>{listing.description}</p>
              </div>
            ))
          )}
        </div>
      </div>
    );
  }
  
  export default ListMain;