import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { LoadingSpinner, ErrorMessage } from '../assets/ErrorLoading';
import { fetchListingById } from '../assets/listings';
import { supabase } from '../supabaseClient';
// MUI Icons
import AmenityIcon from '../components/AmenityIcon';
import ArrowBackIosRoundedIcon from '@mui/icons-material/ArrowBackIosRounded';
import PinDropRoundedIcon from '@mui/icons-material/PinDropRounded';
import PeopleOutlineRoundedIcon from '@mui/icons-material/PeopleOutlineRounded';
// MUI X Date Picker - for availability calendar
import dayjs from 'dayjs';
import { Day } from '../components/DayPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const DetailsPage = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [error, setError] = useState(null);
    const [loading, setLoading] = useState(true);
    // Listing states
    const [listing, setListing] = useState(null);
    const [headerImage, setHeaderImage] = useState('/img/placeholder2.jpg');
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);

    useEffect(() => {
        const getData = async () => {
            try { // Fetch listing details from supabase by listing.id
                const data = await fetchListingById(id);
                setListing(data);
                fetchImages(data.images);
                setLoading(false);
            } catch (error) {
                setError('Error fetching listing details.');
                setLoading(false);
            }
        };

        getData();
    }, [id]);

    const fetchImages = async (imageNames) => {
        if (!imageNames || imageNames.length === 0) return;

        try {
            // Fetch all images from Supabase storage
            const imagePromises = imageNames.map(async (imageName) => {
                const { data, error } = await supabase.storage.from('images').download(imageName);

                if (error) throw error;

                const imageUrl = URL.createObjectURL(data);
                return { imageName, imageUrl };
            });

            const fetchedImages = await Promise.all(imagePromises);
            setImages(fetchedImages);

            if (imageNames.length > 0) {
                // Fetch header image from Supabase storage
                const { data: headerData, error: headerError } = await supabase.storage.from('images').download(imageNames[0]);
                if (!headerError) {
                    const headerImageUrl = URL.createObjectURL(headerData);
                    setHeaderImage(headerImageUrl);
                }
            }
        } catch (error) {
            console.error('Error fetching images:', error.message);
        }
    };

    // Go back to previous page (button click handler)
    const handleBack = () => {
        navigate(-1);
    };
    // Calculate start and end date for availability calendar
    const startDate = useMemo(() => dayjs(listing?.availability.start), [listing]);
    const endDate = useMemo(() => dayjs(listing?.availability.end), [listing]);

    // Display loading spinner while fetching data
    if (loading) return <LoadingSpinner />;
    if (error) return <ErrorMessage message={error} />;

    return (
        <div className="p-4 md:p-10 lg:p-16">
            <h1 className="text-3xl text-center text-primary font-bold">{listing.name}</h1>
            <button onClick={handleBack} className="bg-accent text-white p-2 mb-2 rounded-lg hover:bg-red-300 transition duration-300">
                <ArrowBackIosRoundedIcon />
            </button>
            <div className="text-left">
                {/* Header Image */}
                <img src={headerImage} alt={listing.name} className="w-full h-64 object-cover rounded-lg" />
                {/* Listing Details */}
                <div className="flex flex-col md:flex-row justify-between items-center">
                    <div className='flex flex-col justify-center bg-tertiary p-4 gap-4 flex-wrap rounded-lg w-full'>
                        <p className="text-lg text-gray-900 mb-4">
                            <PinDropRoundedIcon className='md:mr-2' />
                            <span className="hidden md:inline font-semibold">Address: </span>
                            {listing.address} - <span className='font-semibold'>{listing.country}</span>
                        </p>
                        <p className="text-lg text-gray-900">
                            <PeopleOutlineRoundedIcon className='mr-2' />
                            <span className="font-semibold">Guests: </span> {listing.guests}
                        </p>
                        <p className="text-lg text-gray-900">
                            <span className="font-semibold">Price: </span>{listing.price} € per night
                        </p>
                    </div>
                    {/* Availibility Calendar */}
                    <div>
                        <p className="text-center text-lg text-gray-900 font-semibold my-2">Availability</p>
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={startDate}
                                minDate={startDate}
                                maxDate={endDate}
                                slots={{ day: Day }} // custom DayPicker component
                                slotProps={{
                                    day: { start: startDate, end: endDate },
                                }}
                                readOnly
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                {/* Display all Images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-48 lg:h-64 object-cover rounded-lg cursor-pointer transform transition duration-300 hover:scale-105"
                            onClick={() => {
                                setFullImage(image.imageUrl);
                                setShowFullImage(true);
                            }}
                        />
                    ))}
                </div>
                {/* Amenities and Description */}
                <div className="text-center justify-center">
                    <p className="text-lg text-gray-900 p-4 font-semibold">Amenities</p>
                    <div className='mb-8 gap-4 flex justify-center flex-wrap'>
                        {Object.keys(listing.amenities).filter(amenity => listing.amenities[amenity]).map((amenity) => (
                            <div key={amenity} className={`p-2 rounded-lg bg-accent text-white`}>
                                <AmenityIcon amenity={amenity} />
                                <span className='font-semibold ml-2'>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                    {/* description set as text from html (text editor) */}
                    <p className="text-lg text-gray-900 font-semibold">Description:</p>
                    <div className="mx-4 lg:mx-32 my-4" dangerouslySetInnerHTML={{ __html: listing.description }} />
                </div>
            </div>
            {/* Display Full Image */}
            {showFullImage && (
                <div
                    className="fixed top-0 left-0 w-full h-full bg-black bg-opacity-75 flex justify-center items-center z-50"
                    onClick={() => setShowFullImage(false)}
                >
                    <img
                        src={fullImage}
                        alt="Full Size"
                        className="max-h-full max-w-full"
                    />
                </div>
            )}
        </div>
    );
};

export default DetailsPage;