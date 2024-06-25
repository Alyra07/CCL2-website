import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import ListingCard from '../components/ListingCard';

const Favorites = () => {
    const { user } = useUser();
    const navigate = useNavigate();
    const [favorites, setFavorites] = useState([]);

    // Fetch favorites for the current user from database
    useEffect(() => {
        if (user) {
            fetchFavorites();
        }
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
    
    // pass listing id to navigate to details page
    const handleListingClick = (id) => {
        navigate(`/list/${id}`);
    };

    return (
        <div className="p-4 md:p-10 lg:p-16">
            <h2 className="font-semibold text-primary text-center text-3xl mb-4">Favorites</h2>
            {favorites.length === 0 ? (
                // Display button if the user has no favorites
                <div className="text-center mt-2">
                    <p className="text-lg mb-4">No favorite places yet...</p>
                    <button
                        className="bg-primary text-white p-2 rounded-lg hover:bg-secondary transition duration-300"
                        onClick={() => navigate('/list')}>
                        Browse Listings
                    </button>
                </div>
            ) : (
                // Display favorites as ListingCards
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                    {favorites.map((favorite) => (
                        <ListingCard
                            key={favorite.id}
                            listing={favorite.listings}
                            user={user}
                            handleClick={handleListingClick}
                        // AddFavoriteButton is true per default to delete favorites
                        />
                    ))}
                </div>
            )}
        </div>
    );
};

export default Favorites;