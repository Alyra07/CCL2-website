import React, { useState, useEffect } from 'react';
import { supabase } from '../supabaseClient';
import AddFavorite from './AddFavorite';

const ListingCard = ({ listing, user, handleClick, showAddFavorite = true }) => {
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
            className="bg-light-gray border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleClick(listing.id)}
        >
            <img
                src={imageUrl}
                alt={listing.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
                <p className="text-gray-700">{listing.address}</p>
                <p className="text-gray-700">{listing.country}</p>
                <p className="text-gray-700">{listing.price} € per night</p>
                <p className="text-gray-700">{listing.guests} guests</p>
                {showAddFavorite && (
                    <AddFavorite
                        listingId={listing.id}
                        userId={user.id}
                        onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to parent div
                    />
                )}
            </div>
        </div>
    );
};

export default ListingCard;