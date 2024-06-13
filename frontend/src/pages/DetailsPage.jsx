import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { fetchListingById } from '../assets/listings';

const DetailsPage = () => {
    const { id } = useParams();
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
        </div>
    );
};

export default DetailsPage;