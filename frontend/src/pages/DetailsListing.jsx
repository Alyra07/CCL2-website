import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';

const DetailsListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchListing();
  }, []);

  const fetchListing = async () => {
    try {
      const { data, error } = await supabase
        .from('listings')
        .select('*')
        .eq('id', id)
        .single();

      if (error) {
        throw error;
      }

      setListing(data);
    } catch (error) {
      console.error('Error fetching listing:', error.message);
      setMessage('Error fetching listing.');
    }
  };

  const handleEdit = () => {
    navigate.push(`/profile/listing/${id}/edit`);
  };

  const handleDelete = async () => {
    try {
      const { error } = await supabase
        .from('listings')
        .delete()
        .eq('id', id);

      if (error) {
        throw error;
      }

      setMessage('Listing deleted successfully');
      // Optionally, navigate back to profile or another page after deletion
      navigate.push('/profile');
    } catch (error) {
      console.error('Error deleting listing:', error.message);
      setMessage('Error deleting listing.');
    }
  };

  if (!listing) {
    return <p>Loading...</p>;
  }

  return (
    <div>
      <h2>{listing.name}</h2>
      <p>{listing.address}</p>
      <p>{listing.country}</p>
      <p>${listing.price} per night</p>
      <p>{listing.guests}</p>
      <p>Available from {listing.availability.start} to {listing.availability.end}</p>
      <button onClick={handleEdit}>Edit Listing</button>
      <button onClick={handleDelete}>Delete Listing</button>
      <Link to="/profile">Back to Profile</Link>
      <p>{message}</p>
    </div>
  );
};

export default DetailsListing;