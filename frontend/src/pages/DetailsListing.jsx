import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { updateListing } from '../assets/listings';

const DetailsListing = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [listing, setListing] = useState(null);
  const [editMode, setEditMode] = useState(false);
  const [editFields, setEditFields] = useState({
    name: '',
    address: '',
    country: '',
    price: '',
    guests: '',
    availabilityStart: '',
    availabilityEnd: '',
  });
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
      // Populate editFields with current listing data
      setEditFields({
        name: data.name,
        address: data.address,
        country: data.country,
        price: data.price,
        guests: data.guests,
        availabilityStart: data.availability.start,
        availabilityEnd: data.availability.end,
      });
    } catch (error) {
      console.error('Error fetching listing:', error.message);
      setMessage('Error fetching listing.');
    }
  };

  const handleEdit = async () => {
    try {
      await updateListing(id, {
        name: editFields.name,
        address: editFields.address,
        country: editFields.country,
        price: editFields.price,
        guests: editFields.guests,
        availability: {
          start: editFields.availabilityStart,
          end: editFields.availabilityEnd,
        },
      });
      setMessage('Listing updated successfully');
      setEditMode(false); // Exit edit mode
      fetchListing(); // Refresh the listing
    } catch (error) {
      console.error('Error updating listing:', error.message);
      setMessage('Error updating listing. Please try again.');
    }
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

      navigate('/profile');
    } catch (error) {
      console.error('Error deleting listing:', error.message);
      setMessage('Error deleting listing.');
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setEditFields({
      ...editFields,
      [name]: value,
    });
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
      <p>Amenities:
        {listing.amenities.wifi && 'Wifi'}
        {listing.amenities.kitchen && 'Kitchen'}
        {listing.amenities.parking && 'Parking'}
        {listing.amenities.pool && 'Pool'}
      </p>

      {editMode ? (
        <div>
          <input
            type="text"
            name="name"
            value={editFields.name}
            onChange={handleInputChange}
            placeholder="Name"
          />
          <input
            type="text"
            name="address"
            value={editFields.address}
            onChange={handleInputChange}
            placeholder="Address"
          />
          <input
            type="text"
            name="country"
            value={editFields.country}
            onChange={handleInputChange}
            placeholder="Country"
          />
          <input
            type="number"
            name="price"
            value={editFields.price}
            onChange={handleInputChange}
            placeholder="Price per night"
          />
          <input
            type="number"
            name="guests"
            value={editFields.guests}
            onChange={handleInputChange}
            placeholder="Guests"
          />
          <input
            type="date"
            name="availabilityStart"
            value={editFields.availabilityStart}
            onChange={handleInputChange}
            placeholder="Availability Start"
          />
          <input
            type="date"
            name="availabilityEnd"
            value={editFields.availabilityEnd}
            onChange={handleInputChange}
            placeholder="Availability End"
          />
          <button onClick={handleEdit}>Save Changes</button>
          <button onClick={() => setEditMode(false)}>Cancel</button>
        </div>
      ) : (
        <div>
          <button onClick={() => setEditMode(true)}>Edit Listing</button>
          <button onClick={handleDelete}>Delete Listing</button>
        </div>
      )}

      <Link to="/profile">Back to Profile</Link>
      <p>{message}</p>
    </div>
  );
};

export default DetailsListing;