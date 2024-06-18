import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddFavorite from './AddFavorite';

const ListingCard = ({ listing, user, handleClick }) => {
    const [imageUrl, setImageUrl] = useState('/img/placeholder2.jpg');

    useEffect(() => {
        const fetchImage = async () => {
            if (listing.images && listing.images.length > 0) {
                const { data, error } = await supabase.storage
                    .from('images')
                    .download(listing.images[0]); // Fetching only the first image for cover display

                if (error) {
                    console.error('Error fetching image:', error.message);
                } else {
                    const url = URL.createObjectURL(data);
                    setImageUrl(url);
                }
            }
        };

        fetchImage();
    }, [listing.images]);

    return (
        <div
            className="border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleClick(listing.id)}
        >
            <img
                src={imageUrl}
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
    );
};

export default ListingCard;