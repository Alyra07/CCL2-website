import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchListingById } from '../assets/listings'; // Assuming fetchListingById is a function to fetch listing details
import { supabase } from '../supabaseClient'; // Import Supabase client
// MUI Icons
import WhereToVoteRoundedIcon from '@mui/icons-material/WhereToVoteRounded';
import WifiIcon from '@mui/icons-material/Wifi';
import KitchenIcon from '@mui/icons-material/Kitchen';
import LocalParkingIcon from '@mui/icons-material/LocalParking';
import PoolIcon from '@mui/icons-material/Pool';
import AcUnitIcon from '@mui/icons-material/AcUnit';
// Importing MUI DateCalendar components
import dayjs from 'dayjs';
import { Day } from '../assets/DayPicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';
import { DateCalendar } from '@mui/x-date-pickers/DateCalendar';

const DetailsPage = () => {
    const { id } = useParams();
    const [listing, setListing] = useState(null);
    const [headerImage, setHeaderImage] = useState('/img/placeholder2.jpg');
    const [images, setImages] = useState([]);
    const [fullImage, setFullImage] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);
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

    const getAmenityIcon = (amenity) => {
        switch (amenity) {
          case 'wifi':
            return <WifiIcon fontSize='medium' />;
          case 'cooler':
            return <AcUnitIcon fontSize='medium' />;
          case 'kitchen':
            return <KitchenIcon fontSize='medium' />;
          case 'parking':
            return <LocalParkingIcon fontSize='medium' />;
          case 'pool':
            return <PoolIcon fontSize='medium' />;
          default:
            return <WhereToVoteRoundedIcon fontSize='medium' />;
        }
      };

    const handleBack = () => {
        navigate(-1);
    };

    if (!listing) {
        return <p>Loading...</p>;
    }

    const startDate = dayjs(listing.availability.start);
    const endDate = dayjs(listing.availability.end);

    return (
        <div className="p-4 md:p-10 lg:p-16">
            <h1 className="text-3xl text-center text-primary font-bold">{listing.name}</h1>
            <button onClick={handleBack}
                className="bg-accent text-white py-2 px-4 mb-4 rounded hover:bg-red-300">
                Back
            </button>
            <div className="mb-4 text-left">
                {/* Header Image */}
                <img
                    src={headerImage}
                    alt={listing.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                {/* Listing Details */}
                <div className="flex justify-between items-center mb-4">
                    <div>
                        <p className="text-base mb-2"><span className="font-semibold">Address:</span> {listing.address}</p>
                        <p className="text-base mb-2"><span className="font-semibold">Country:</span> {listing.country}</p>
                        <p className="text-base mb-2"><span className="font-semibold">Guests:</span> {listing.guests}</p>
                        <p className="text-base mb-2"><span className="font-semibold">Price:</span> ${listing.price} per night</p>
                        <p className="text-base mb-4">
                            <span className="font-semibold">Availability:</span>
                            From {listing.availability.start}
                            to {listing.availability.end}
                        </p>
                    </div>
                    {/* Date Calendar */}
                    <div className="ml-4">
                        <LocalizationProvider dateAdapter={AdapterDayjs}>
                            <DateCalendar
                                value={startDate}
                                minDate={startDate}
                                maxDate={endDate}
                                slots={{ day: Day }}
                                slotProps={{
                                    day: {
                                        start: startDate,
                                        end: endDate,
                                    },
                                }}
                                readOnly
                            />
                        </LocalizationProvider>
                    </div>
                </div>
                {/* Listing Images */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-4 mb-4">
                    {images.map((image, index) => (
                        <img
                            key={index}
                            src={image.imageUrl}
                            alt={`Image ${index + 1}`}
                            className="w-full h-48 lg:h-64 object-cover rounded-lg cursor-pointer transform transition duration-300 hover:scale-105"
                            // Open full image on click
                            onClick={() => {
                                setFullImage(image.imageUrl);
                                setShowFullImage(true);
                            }}
                        />
                    ))}
                </div>
                <div className="my-4 text-center justify-center">
                    <p className="text-base p-4 font-semibold">Amenities</p>
                    <div className='mb-8 gap-4 flex justify-center flex-wrap'>
                        {Object.keys(listing.amenities).filter(amenity => listing.amenities[amenity]).map((amenity) => (
                            <div key={amenity} className={`p-2 rounded-lg bg-accent text-white`}>
                                {getAmenityIcon(amenity)}
                                <span className='font-semibold ml-2'>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                    <p className="font-semibold">Description:</p>
                    <div className="mx-4 lg:mx-32 my-2" dangerouslySetInnerHTML={{ __html: listing.description }} />
                </div>
            </div>
            {/* Full Image Modal */}
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