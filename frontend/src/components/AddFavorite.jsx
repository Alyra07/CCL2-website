import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
// MUI Icons
import FavoriteBorderRoundedIcon from '@mui/icons-material/FavoriteBorderRounded';
import FavoriteRoundedIcon from '@mui/icons-material/FavoriteRounded'; // isFavorite

const AddFavorite = ({ listingId, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!userId) return;
            try { // Check if listingId is already in favorites for current user
                const { data: existingFavorites, error: fetchError } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('listing_id', listingId)
                    .eq('user_id', userId);

                if (fetchError) {
                    throw fetchError;
                }
                // set button to true if listing already isFavorite
                if (existingFavorites.length > 0) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error.message);
            }
        };

        checkFavoriteStatus();
    }, [listingId, userId]);

    // Add or remove listing from favorites when button is clicked
    const handleToggleFavorite = async (event) => {
        event.stopPropagation(); // Stop the click event from propagating to parent elements

        if (!userId) {
            navigate('/login');            
            return;
        }

        try {
            if (isFavorite) { // remove if already isFavorite
                const { error } = await supabase
                    .from('favorites')
                    .delete()
                    .eq('listing_id', listingId)
                    .eq('user_id', userId);

                if (error) {
                    throw error;
                }

                setIsFavorite(false);
                console.log('Removed from favorites');
            } else { // Add to favorites in database (user_id & listing_id)
                const { data, error } = await supabase.from('favorites').insert([
                    { user_id: userId, listing_id: listingId },
                ]);
                if (error) {
                    throw error;
                }

                setIsFavorite(true);
                console.log('Added to favorites');
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error.message);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            className={`absolute bottom-4 right-4 p-2 rounded-full transition duration-300 
                ${isFavorite ? 'bg-accent text-white hover:bg-red-300' : 'bg-primary text-white hover:bg-secondary'}`}
        >
            {isFavorite ? // Display different icons based on favorite status
            <FavoriteRoundedIcon fontSize='medium' /> // isFavorite
            : // isFavorite false:
            <FavoriteBorderRoundedIcon fontSize='medium' />} 
        </button>
    );
};

export default AddFavorite;