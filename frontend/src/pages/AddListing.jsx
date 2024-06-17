import React, { useState } from 'react';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';

const AddListing = () => {
  const { user } = useUser();
  const [images, setImages] = useState([]);
  const [listingDetails, setListingDetails] = useState({
    name: '',
    address: '',
    country: '',
    price: '',
    guests: '',
    description: '',
    amenities: {
      wifi: false,
      cooler: false,
      kitchen: false,
      parking: false,
      pool: false
    },
    availability: {
      start: '',
      end: ''
    }
  });
  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name in listingDetails.amenities) {
      setListingDetails({
        ...listingDetails,
        amenities: {
          ...listingDetails.amenities,
          [name]: checked
        }
      });
    } else if (name === "start" || name === "end") {
      setListingDetails({
        ...listingDetails,
        availability: {
          ...listingDetails.availability,
          [name]: value
        }
      });
    } else {
      setListingDetails({
        ...listingDetails,
        [name]: value
      });
    }
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      return ['https://asfguipgiafjfgqzzoky.supabase.co/storage/v1/object/public/images/placeholder2.jpg?t=2024-06-17T16%3A07%3A07.165Z'];
    }

    const uploadedImagePaths = [];

    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`; // Generate a unique file name

      const { data, error } = await supabase.storage
        .from('images')
        .upload(fileName, image);

      if (error) {
        console.error('Error uploading image:', error.message);
        return null;
      }

      uploadedImagePaths.push(fileName);
    }

    return uploadedImagePaths;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!user) {
      setMessage('User is not logged in.');
      return;
    }

    setMessage('Uploading images...');
    try {
      const imagePaths = await uploadImages();
      if (!imagePaths) {
        setMessage('Error uploading images.');
        return;
      }

      const { data, error } = await supabase
        .from('listings')
        .insert([
          { ...listingDetails, images: imagePaths, user_id: user.id },
        ]);

      if (error) {
        throw error;
      }

      console.log('Listing added:', data);
      setMessage('Listing added successfully.');
      setListingDetails({
        name: '',
        address: '',
        country: '',
        price: '',
        guests: '',
        description: '',
        amenities: {
          wifi: false,
          cooler: false,
          kitchen: false,
          parking: false,
          pool: false
        },
        availability: {
          start: '',
          end: ''
        }
      });
      setImages([]);
    } catch (error) {
      console.error('Error adding listing:', error.message);
      setMessage('Error adding listing.');
    }
  };

  return (
    <div className="flex flex-col bg-background p-4 md:p-10 lg:p-16">
      <h1 className="text-center text-3xl font-semibold text-primary mb-4 md:mb-6 sm:mb-6">Publish Your Place</h1>
      <p className="text-center text-lg text-accent">
        {message}
      </p>
      <form className="flex flex-col md:flex-row md:gap-6 flex-grow" onSubmit={handleSubmit}>
        {/* Details Section */}
        <div className="flex flex-col md:w-1/2 mt-2">
          <h2 className="text-xl mb-2">Details</h2>
          <hr className="mb-4" />
          <div className="mb-2">
            <label htmlFor="name" className="block mb-1">Name:</label>
            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="name" id="name" value={listingDetails.name} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="address" className="block mb-1">Address:</label>
            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="address" id="address" value={listingDetails.address} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="country" className="block mb-1">Country:</label>
            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="country" id="country" value={listingDetails.country} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="price" className="block mb-1">Price/night:</label>
            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="price" id="price" value={listingDetails.price} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="guests" className="block mb-1">Guests:</label>
            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="number" name="guests" id="guests" value={listingDetails.guests} onChange={handleChange} />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block mb-1">Description:</label>
            <textarea className="p-2 border-2 border-secondary rounded-lg w-full" name="description" id="description" value={listingDetails.description} onChange={handleChange} />
          </div>
        </div>
        {/* Other Sections */}
        <div className="flex flex-col md:w-1/2 md:space-y-4 mt-2">
          {/* Images Section */}
          <div>
            <h2 className="text-xl mb-2">Images</h2>
            <hr className="mt-2 mb-4" />
            <input type="file" multiple onChange={handleImageChange} />
          </div>
          {/* Availability Section */}
          <div className="my-2">
            <h2 className="text-xl mb-2">Availability</h2>
            <hr className="mt-2 mb-4" />
            <div className="mb-2">
              <label htmlFor="start" className="block mb-1">Start Date:</label>
              <input className="p-2 border-2 border-secondary rounded-lg w-full" type="date" name="start" id="start" value={listingDetails.availability.start} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="end" className="block mb-1">End Date:</label>
              <input className="p-2 border-2 border-secondary rounded-lg w-full" type="date" name="end" id="end" value={listingDetails.availability.end} onChange={handleChange} />
            </div>
          </div>
          {/* Amenities Section */}
          <div className="my-2">
            <h2 className="text-xl mb-2">Amenities</h2>
            <hr className="mt-2 mb-4" />
            <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
              {Object.keys(listingDetails.amenities).map((amenity) => (
                <div key={amenity} className="flex items-center">
                  <input
                    className="mr-2"
                    type="checkbox"
                    name={amenity}
                    id={amenity}
                    checked={listingDetails.amenities[amenity]}
                    onChange={handleChange}
                  />
                  <label htmlFor={amenity} className="capitalize">{amenity}</label>
                </div>
              ))}
            </div>
          </div>
          {/* Submit Button */}
          <div className="mt-4">
            <button
              className="bg-primary text-white py-2 px-4 rounded-lg w-full"
              type="submit"
            >
              Publish Listing
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default AddListing;