import React, { useState, useEffect, useRef } from 'react';
import { supabase } from '../supabaseClient';
import AddFavorite from './AddFavorite';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';

const ListingCard = ({ listing, user, handleClick, showAddFavorite = true }) => {
    const [imageUrl, setImageUrl] = useState('/img/placeholder2.jpg');
    const cachedImageUrl = useRef({});

    useEffect(() => {
        if (listing.images && listing.images.length > 0) {
            if (cachedImageUrl.current[listing.images[0]]) {
                setImageUrl(cachedImageUrl.current[listing.images[0]]);
            } else {
                fetchImage();
            }
        } else {
            setImageUrl('/img/placeholder2.jpg');
        }
    }, [listing.images]);

    const fetchImage = async () => {
        // download header image from Supabase bucket
        const { data, error } = await supabase.storage
            .from('images')
            .download(listing.images[0]);
        // set placeholder imgae if there are no images or an error occurs
        if (error) {
            console.error('Error downloading image:', error);
            setImageUrl('/img/placeholder2.jpg');
        } else {
            const url = URL.createObjectURL(data);
            cachedImageUrl.current[listing.images[0]] = url;
            setImageUrl(url);
        }
    };

    return (
        <div className="relative bg-light-gray border border-gray-300 rounded-lg overflow-hidden shadow-lg 
            transform transition-transform duration-300 hover:scale-105 cursor-pointer"
            onClick={() => handleClick(listing.id)}
        >
            <img
                src={imageUrl}
                alt={listing.name}
                className="w-full h-48 object-cover"
            />
            <div className="p-4">
                <h3 className="text-xl font-semibold mb-2">{listing.name}</h3>
                <p className="text-dark-gray"><PinDropRoundedIcon fontSize='small' />{listing.address}</p>
                <p className="text-dark-gray">{listing.country}</p>
                {showAddFavorite && (
                <>
                    <p className="text-dark-gray"><PeopleOutlineRoundedIcon />{listing.guests}</p>
                    <p className="text-lg mt-2">{listing.price} €<span className='text-sm'> p/n</span></p>
                {/* Add favorite button is shown in ListMain / Favorites */}
                    <AddFavorite 
                        listingId={listing.id}
                        userId={user.id}
                        onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to parent div
                    />
                </>
                )}
            </div>
        </div>
    );
};

export default ListingCard;