import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import AddFavorite from '../components/AddFavorite';

const Favorites = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    useEffect(() => {
        fetchFavorites();
    }, [user]);

    const fetchFavorites = async () => {
        try {
            const { data, error } = await supabase
                .from('favorites')
                .select('*, listings(*)')
                .eq('user_id', user.id);

            if (error) {
                throw error;
            }

            setFavorites(data);
        } catch (error) {
            console.error('Error fetching favorites:', error.message);
        }
    };

    const handleListingClick = (id) => {
        navigate(`/list/${id}`);
    };

    return (
        <div className="p-4 md:p-10 lg:p-16">
            <h2 className="font-semibold text-primary text-center text-3xl mb-4">Favorites</h2>
            {favorites.length === 0 ? (
                <div className="text-center">
                    <p className="text-lg mb-4">No favorite places yet...</p>
                    <button
                        className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition duration-300"
                        onClick={() => navigate('/list')}
                    >
                        Browse Listings
                    </button>
                </div>
            ) : (
                <div className="flex flex-wrap justify-center items-center gap-8">
                    {favorites.map((favorite) => (
                        <div
                            key={favorite.id}
                            className="w-full md:w-1/2 lg:w-1/3 xl:w-1/4 border border-gray-300 rounded-lg overflow-hidden shadow-lg transform transition-transform duration-300 hover:scale-105 cursor-pointer"
                            onClick={() => handleListingClick(favorite.listings.id)}
                        >
                            <img
                                src={favorite.listings.images?.[0] || '/img/placeholder2.jpg'}
                                alt={favorite.listings.name}
                                className="w-full h-48 object-cover"
                            />
                            <div className="p-4">
                                <h3 className="text-xl font-semibold mb-2">{favorite.listings.name}</h3>
                                <p className="text-gray-700">{favorite.listings.address}</p>
                                <p className="text-gray-700">{favorite.listings.country}</p>
                                <p className="text-gray-700">${favorite.listings.price} per night</p>
                                <p className="text-gray-700">{favorite.listings.guests} guests</p>
                                <AddFavorite
                                    listingId={favorite.listings.id}
                                    userId={user.id}
                                    onClick={(e) => e.stopPropagation()} // Prevent click event from propagating to parent div
                                />
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;