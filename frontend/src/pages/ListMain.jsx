import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { fetchAllListings } from '../assets/listings';
import { useUser } from '../assets/UserContext';
import SearchBar from '../components/SearchBar';
import AddFavorite from '../components/AddFavorite';
import { supabase } from '../supabaseClient'; // Import Supabase client

const ListMain = () => {
    const { user } = useUser();
    const location = useLocation();
    const navigate = useNavigate();
    const [searchCriteria, setSearchCriteria] = useState(location.state?.searchCriteria || {});
    const [listings, setListings] = useState([]);
    const [filteredListings, setFilteredListings] = useState(location.state?.filteredListings || []);
    const [countries, setCountries] = useState([]);
    const [images, setImages] = useState([]);

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

    useEffect(() => {
        if (location.state && location.state.searchCriteria && location.state.filteredListings) {
            setSearchCriteria(location.state.searchCriteria);
            setFilteredListings(location.state.filteredListings);
        }
    }, [location.state]);

    useEffect(() => {
        // Fetch images for each listing in filteredListings
        fetchListingImages(filteredListings);
    }, [filteredListings]);

    const fetchListingImages = async (listings) => {
        if (!listings || listings.length === 0) {
            return;
        }

        try {
            const imagePromises = listings.map(async (listing) => {
                if (listing.images && listing.images.length > 0) {
                    const { data, error } = await supabase.storage
                        .from('images')
                        .download(listing.images[0]); // Fetching only the first image for cover display

                    if (error) {
                        throw error;
                    }

                    const imageUrl = URL.createObjectURL(data);
                    return { listingId: listing.id, imageUrl };
                } else {
                    // If no images, use placeholder
                    return { listingId: listing.id, imageUrl: '/img/placeholder2.jpg' };
                }
            });

            const fetchedImages = await Promise.all(imagePromises);
            setImages(fetchedImages);
        } catch (error) {
            console.error('Error fetching listing images:', error.message);
        }
    };

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
        // Pass current search criteria and filtered listings to DetailsPage
        navigate(`/list/${id}`, {
            state: {
                searchCriteria,
                filteredListings
            }
        });
    };

    return (
        <div className='p-4 md:p-10 lg:p-16'>
            <div className="flex flex-col items-center mb-8">
                <h1 className="text-3xl text-primary font-semibold mb-6">Find Your Perfect Stay</h1>
                <SearchBar onSearch={setSearchCriteria} countries={countries} initialValues={searchCriteria} />
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {filteredListings.length === 0 ? (
                    <p className="col-span-full text-center">No listings available</p>
                ) : (
                    filteredListings.map((listing, index) => (
                        <div
                            key={index}
                            className="border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleListingClick(listing.id)}
                        >
                            <img
                                src={images.find(img => img.listingId === listing.id)?.imageUrl || '/img/placeholder2.jpg'}
                                alt={listing.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h2 className="text-xl font-semibold mb-2">{listing.name}</h2>
                                <p className="text-gray-700">{listing.address}</p>
                                <p className="text-gray-700">{listing.country}</p>
                                <p className="text-gray-700">${listing.price} per night</p>
                                <p className="text-gray-700">{listing.guests} guests</p>
                                <p className="text-gray-700">Available from {listing.availability.start} to {listing.availability.end}</p>
                                <AddFavorite listingId={listing.id} userId={user ? user.id : null} />
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default ListMain;