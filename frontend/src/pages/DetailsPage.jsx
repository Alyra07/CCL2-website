import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { fetchListingById } from '../assets/listings';

const DetailsPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchListingById(id);
                setListing(data);
            } catch (error) {
                console.error("Error fetching listing details:", error);
            }
        };

        getData();
    }, [id]);

    const handleBack = () => {
        navigate(-1, {
            state: {
                searchCriteria: location.state.searchCriteria,
                filteredListings: location.state.filteredListings
            }
        });
    };
    
    if (!listing) {
        return <p>Loading...</p>;
    }

    return (
        <div className="details-page">
            <h1>{listing.name}</h1>
            <p>{listing.address}</p>
            <p>{listing.country}</p>
            <p>{listing.price}</p>
            <p>{listing.guests}</p>
            <p>Available from {listing.availability.start} to {listing.availability.end}</p>
            <button onClick={handleBack}>Back</button>
        </div>
    );
};

export default DetailsPage;