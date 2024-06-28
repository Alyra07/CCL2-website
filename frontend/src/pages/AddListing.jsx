import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';
import AmenityIcon from '../components/AmenityIcon.jsx';
import ReactQuill from 'react-quill'; // ignore warning in console (update soon)
import 'react-quill/dist/quill.snow.css';

const AddListing = () => {
  const { user } = useUser();
  const navigate = useNavigate();
  const [images, setImages] = useState([]);
  const [message, setMessage] = useState('');
  const [isSuccess, setIsSuccess] = useState(false);
  const amenitiesList = ['wifi', 'cooler', 'kitchen', 'parking', 'pool'];
  // initial form state
  const initialListingDetails = {
    name: '',
    address: '',
    country: '',
    price: '',
    guests: '',
    description: '',
    amenities: amenitiesList.reduce((acc, amenity) => ({ ...acc, [amenity]: false }), {}),
    availability: {
      start: '',
      end: ''
    }
  };
  const [listingDetails, setListingDetails] = useState(initialListingDetails);

  // Handle various form input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === "start" || name === "end") {
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

  const handleAmenityChange = (amenity) => {
    setListingDetails((prevDetails) => ({
      ...prevDetails,
      amenities: {
        ...prevDetails.amenities,
        [amenity]: !prevDetails.amenities[amenity]
      }
    }));
  };

  const handleDescriptionChange = (value) => {
    setListingDetails({
      ...listingDetails,
      description: value
    });
  };

  const handleImageChange = (e) => {
    setImages([...e.target.files]);
  };

  const uploadImages = async () => {
    if (images.length === 0) {
      return [];
    }

    const uploadedImagePaths = [];

    for (const image of images) {
      // Generate random filename for each image
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      // Upload image to Supabase storage
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

    // can't submit if user is not logged in
    if (!user) {
      setMessage('User is not logged in.');
      setIsSuccess(false);
      return;
    }

    setMessage('Uploading images...');
    setIsSuccess(false);
    // Upload images first
    try {
      const imagePaths = await uploadImages();
      if (!imagePaths) {
        setMessage('Error uploading images.');
        setIsSuccess(false);
        return;
      }
      // Add listing details to Supabase
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
      setIsSuccess(true);
      setListingDetails(initialListingDetails); // Reset form fields after upload
      setImages([]);

      // Redirect to /profile after a few seconds
      setTimeout(() => {
        navigate('/profile');
      }, 2000);
    } catch (error) {
      console.error('Error adding listing:', error.message);
      setMessage('Error adding listing.');
      setIsSuccess(false);
    }
  };

  return (
    <div className="flex flex-col bg-background p-4 md:p-10 lg:p-16">
      <h1 className="text-center text-3xl font-semibold text-primary mb-4 md:mb-6 sm:mb-6">Publish Your Place</h1>
      <form className="flex flex-col md:flex-row md:gap-6 flex-grow" onSubmit={handleSubmit}>
        {/* Details Section */}
        <div className="flex flex-col md:w-1/2 mt-2">
          <h2 className="text-xl mb-2">Details</h2>
          <hr className="border border-secondary mb-4" />
          <div className="mb-2">
            <label htmlFor="name" className="block mb-1">Name:</label>
            <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="text" name="name" id="name" value={listingDetails.name} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="address" className="block mb-1">Address:</label>
            <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="text" name="address" id="address" value={listingDetails.address} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="country" className="block mb-1">Country:</label>
            <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="text" name="country" id="country" value={listingDetails.country} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="price" className="block mb-1">Price/night:</label>
            <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="number" name="price" id="price" value={listingDetails.price} min={0} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="guests" className="block mb-1">Guests:</label>
            <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="number" name="guests" id="guests" value={listingDetails.guests} min={1} onChange={handleChange} required />
          </div>
          <div className="mb-2">
            <label htmlFor="description" className="block mb-1">Description:</label>
            <ReactQuill // Rich text editor for description
              className="p-2 border-2 border-tertiary rounded-lg w-full"
              name="description"
              id="description"
              value={listingDetails.description}
              onChange={handleDescriptionChange}
            />
          </div>
        </div>
        {/* Other Sections */}
        <div className="flex flex-col md:w-1/2 md:space-y-4 mt-2">
          {/* Images Section */}
          <div>
            <h2 className="text-xl mb-2">Images</h2>
            <hr className="border border-secondary mb-4" />
            <input type="file" multiple onChange={handleImageChange} />
          </div>
          {/* Availability Section */}
          <div className="my-2">
            <h2 className="text-xl mb-2">Availability</h2>
            <hr className="border border-secondary mb-4" />
            <div className="mb-2">
              <label htmlFor="start" className="block mb-1">Start Date:</label>
              <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="date" name="start" id="start" value={listingDetails.availability.start} onChange={handleChange} />
            </div>
            <div className="mb-2">
              <label htmlFor="end" className="block mb-1">End Date:</label>
              <input className="p-2 border-2 border-tertiary rounded-lg w-full" type="date" name="end" id="end" value={listingDetails.availability.end} onChange={handleChange} />
            </div>
          </div>
          {/* Amenities Section */}
          <div className="my-2">
            <h2 className="text-xl mb-2">Amenities</h2>
            <hr className="border border-secondary mb-4" />
            <div className='my-4 gap-4 flex flex-wrap'>
              {amenitiesList.map((amenity) => (
                <button
                  key={amenity}
                  onClick={(e) => {
                    e.preventDefault();
                    handleAmenityChange(amenity);
                  }}
                  className={`p-4 rounded-lg transition duration-300 
                    ${listingDetails.amenities[amenity] ? 'bg-primary text-white' : 'bg-tertiary text-gray-700 hover:bg-secondary hover:text-white'}`}
                >
                  <AmenityIcon amenity={amenity} />
                  <span className='hidden md:inline ml-2'>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                </button>
              ))}
            </div>
          </div>
          <p className={`text-center text-lg ${isSuccess ? 'text-green-500' : 'text-accentred'}`}>
            {message}
          </p>
          {/* Submit Button */}
          <div className="mt-4">
            <button
              className="bg-accent hover:bg-red-300 text-white py-2 px-4 rounded-lg w-full"
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