import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faHeart as faHeartRegular } from '@fortawesome/free-regular-svg-icons';
import { faHeart as faHeartSolid } from '@fortawesome/free-solid-svg-icons';

const AddFavorite = ({ listingId, userId }) => {
    const [isFavorite, setIsFavorite] = useState(false);
    const navigate = useNavigate();

    useEffect(() => {
        const checkFavoriteStatus = async () => {
            if (!userId) return;
            try {
                const { data: existingFavorites, error: fetchError } = await supabase
                    .from('favorites')
                    .select('*')
                    .eq('listing_id', listingId)
                    .eq('user_id', userId);

                if (fetchError) {
                    throw fetchError;
                }

                if (existingFavorites.length > 0) {
                    setIsFavorite(true);
                }
            } catch (error) {
                console.error('Error checking favorite status:', error.message);
            }
        };

        checkFavoriteStatus();
    }, [listingId, userId]);

    const handleToggleFavorite = async (event) => {
        event.stopPropagation(); // Stop the click event from propagating to parent elements

        if (!userId) {
            navigate('/login');
            return;
        }

        try {
            if (isFavorite) {
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
            } else {
                const { data, error } = await supabase.from('favorites').insert([
                    { user_id: userId, listing_id: listingId },
                ]);

                if (error) {
                    throw error;
                }

                setIsFavorite(true);
                console.log('Added to favorites:', data);
            }
        } catch (error) {
            console.error('Error toggling favorite status:', error.message);
        }
    };

    return (
        <button
            onClick={handleToggleFavorite}
            className={`py-2 px-4 rounded-lg transition duration-300 ${isFavorite ? 'bg-accent text-white hover:bg-red-300' : 'bg-primary text-white hover:bg-secondary'}`}
        >
            <FontAwesomeIcon icon={isFavorite ? faHeartSolid : faHeartRegular} className='' />
        </button>
    );
};

export default AddFavorite;