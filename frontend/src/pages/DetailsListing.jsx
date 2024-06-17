import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { updateListing } from '../assets/listings';

const DetailsListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [headerImage, setHeaderImage] = useState('/img/placeholder2.jpg');
    const [images, setImages] = useState([]);
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
            setEditFields({
                name: data.name,
                address: data.address,
                country: data.country,
                price: data.price,
                guests: data.guests,
                availabilityStart: data.availability.start,
                availabilityEnd: data.availability.end,
            });

            fetchImages(data.images); // Fetch images after listing data is set
        } catch (error) {
            console.error('Error fetching listing:', error.message);
            setMessage('Error fetching listing.');
        }
    };

    const fetchImages = async (imageNames) => {
        if (!imageNames || imageNames.length === 0) {
            return;
        }

        try {
            const imagePromises = imageNames.map(async (imageName) => {
                const { data, error } = await supabase.storage
                    .from('images')
                    .download(imageName);

                if (error) {
                    throw error;
                }

                const imageUrl = URL.createObjectURL(data); // Create a URL for the downloaded image
                return { imageName, imageUrl };
            });

            const fetchedImages = await Promise.all(imagePromises);
            setImages(fetchedImages);

            // Set header image separately
            if (imageNames.length > 0) {
                const { data: headerData, error: headerError } = await supabase.storage
                    .from('images')
                    .download(imageNames[0]);
                if (!headerError) {
                    const headerImageUrl = URL.createObjectURL(headerData);
                    setHeaderImage(headerImageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching images:', error.message);
            setMessage('Error fetching images.');
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
            setEditMode(false);
            fetchListing();
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

    const handleBack = () => {
        // Navigate back to the previous location
        navigate(-1);
    };

    if (!listing) {
        return <p>Loading...</p>;
    }

    return (
        <div className="p-4 md:p-10 lg:p-16 text-center">
            <div className="text-center items-center mb-4">
                <h2 className="text-3xl font-bold">{listing.name}</h2>
                <button
                    onClick={handleBack}
                    className="bg-dark-gray text-white p-2 py-2 rounded hover:bg-gray-600"
                >
                    Back to Profile
                </button>
                {!editMode && (
                    <button
                        onClick={() => setEditMode(true)}
                        className="bg-secondary text-white p-2 rounded hover:bg-blue-600"
                    >
                        Edit Listing
                    </button>
                )}
            </div>
            <div className="mb-4">
                <img
                    src={headerImage}
                    alt={listing.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                <p className="text-gray-700 mb-2"><span className="font-semibold">Address:</span> {listing.address}</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Country:</span> {listing.country}</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Price:</span> ${listing.price} per night</p>
                <p className="text-gray-700 mb-2"><span className="font-semibold">Guests:</span> {listing.guests}</p>
                <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Availability:</span> From {listing.availability.start} to {listing.availability.end}
                </p>
                <p className="text-gray-700 mb-2">
                    <span className="font-semibold">Amenities:</span>
                    {listing.amenities?.wifi && ' Wifi'}
                    {listing.amenities?.cooler && ' Cooler'}
                    {listing.amenities?.kitchen && ' Kitchen'}
                    {listing.amenities?.parking && ' Parking'}
                    {listing.amenities?.pool && ' Pool'}
                </p>
                <p className="text-gray-700 mb-4"><span className="font-semibold">Description:</span> {listing.description}</p>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                        <img key={index} src={image.imageUrl} alt={`Image ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    ))}
                </div>
            </div>
            {editMode ? (
                <div className="mb-4">
                    <input
                        type="text"
                        name="name"
                        value={editFields.name}
                        onChange={handleInputChange}
                        placeholder="Name"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="address"
                        value={editFields.address}
                        onChange={handleInputChange}
                        placeholder="Address"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="text"
                        name="country"
                        value={editFields.country}
                        onChange={handleInputChange}
                        placeholder="Country"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="number"
                        name="price"
                        value={editFields.price}
                        onChange={handleInputChange}
                        placeholder="Price per night"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="number"
                        name="guests"
                        value={editFields.guests}
                        onChange={handleInputChange}
                        placeholder="Guests"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="date"
                        name="availabilityStart"
                        value={editFields.availabilityStart}
                        onChange={handleInputChange}
                        placeholder="Availability Start"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <input
                        type="date"
                        name="availabilityEnd"
                        value={editFields.availabilityEnd}
                        onChange={handleInputChange}
                        placeholder="Availability End"
                        className="border p-2 rounded mb-2 w-full"
                    />
                    <button
                        onClick={handleEdit}
                        className="bg-blue-500 text-white py-2 px-4 rounded hover:bg-blue-600 mr-2"
                    >
                        Save Changes
                    </button>
                    <button
                        onClick={() => setEditMode(false)}
                        className="bg-gray-500 text-white py-2 px-4 rounded hover:bg-gray-600"
                    >
                        Cancel
                    </button>
                </div>
            ) : (
                <div className="mb-4">
                    <button
                        onClick={handleDelete}
                        className="bg-accentred text-white py-2 px-4 rounded hover:bg-red-200 mr-2"
                    >
                        Delete Listing
                    </button>
                </div>
            )}
            <p className="text-red-500">{message}</p>
        </div>
    );
};

export default DetailsListing;