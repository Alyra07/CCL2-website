import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../assets/listings'; // Assuming fetchListingById is a function to fetch listing details
import { supabase } from '../supabaseClient'; // Import Supabase client

const DetailsPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [headerImage, setHeaderImage] = useState('/img/placeholder2.jpg');
    const [images, setImages] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        const getData = async () => {
            try {
                const data = await fetchListingById(id);
                setListing(data);
                fetchImages(data.images); // Fetch images after listing data is set
            } catch (error) {
                console.error("Error fetching listing details:", error);
            }
        };

        getData();
    }, [id]);

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
        }
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
            <h1 className="text-3xl font-bold mb-4">{listing.name}</h1>
            <button onClick={handleBack}
                className="bg-accent text-white py-2 px-4 my-4 rounded hover:bg-red-300">
                Back
            </button>
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
                    {listing.amenities.wifi && ' Wifi'}
                    {listing.amenities.cooler && ' Cooler'}
                    {listing.amenities.kitchen && ' Kitchen'}
                    {listing.amenities.parking && ' Parking'}
                    {listing.amenities.pool && ' Pool'}
                </p>
                <p className="text-gray-700 mb-4"><span className="font-semibold">Description:</span> {listing.description}</p>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                    {images.map((image, index) => (
                        <img key={index} src={image.imageUrl} alt={`Image ${index + 1}`} className="w-full h-48 object-cover rounded-lg" />
                    ))}
                </div>
            </div>
        </div>
    );
};

export default DetailsPage;