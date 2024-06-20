import React, { useEffect, useState, useMemo } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { updateListing } from '../assets/listings';
import { LoadingSpinner, ErrorMessage } from '../assets/ErrorLoading';
// Text editor
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css';
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

const DetailsListing = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const [listing, setListing] = useState(null);
    const [message, setMessage] = useState('');
    const [loading, setLoading] = useState(true);
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
    const [description, setDescription] = useState('');
    const [fullImage, setFullImage] = useState(null);
    const [showFullImage, setShowFullImage] = useState(false);

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
            setDescription(data.description);

            fetchImages(data.images);
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listing:', error.message);
            setMessage('Error fetching listing.');
            setLoading(false);
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

                const imageUrl = URL.createObjectURL(data);
                return { imageName, imageUrl };
            });

            const fetchedImages = await Promise.all(imagePromises);
            setImages(fetchedImages);

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
                description: description,
            });
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

    const handleDescriptionChange = (content) => {
        setDescription(content);
    };

    const handleBack = () => {
        navigate(-1);
    };

    const startDate = useMemo(() => dayjs(listing?.availability.start), [listing]);
    const endDate = useMemo(() => dayjs(listing?.availability.end), [listing]);

    if (loading) return <LoadingSpinner />;
    if (message) return <ErrorMessage message={message} />;

    return (
        <div className="p-4 md:p-10 lg:p-16 text-center">
            <div className="text-center items-center mb-4">
                <h2 className="text-primary text-3xl font-bold mb-2">{listing.name}</h2>
                <div className='gap-2 lg:gap-6 flex flex-row justify-between my-2'>
                    <button
                        onClick={handleBack}
                        className="bg-gray-600 text-white p-2 rounded-lg hover:bg-dark-gray"
                    >
                        <ArrowBackIosRoundedIcon />
                        Back to Profile
                    </button>
                    <section>
                        <button
                            onClick={editMode ? handleEdit : () => setEditMode(true)}
                            className="bg-primary text-white p-2 rounded-lg hover:bg-secondary"
                        >
                            {editMode ? "Save" : "Edit"}
                        </button>
                        <button
                            onClick={handleDelete}
                            className="bg-accent text-white p-2 rounded-lg hover:bg-red-300"
                        >
                            Delete Listing
                        </button>
                    </section>
                </div>
            </div>
            <div className="mb-4">
                <img
                    src={headerImage}
                    alt={listing.name}
                    className="w-full h-64 object-cover rounded-lg mb-4"
                />
                {!editMode && (
                    <>
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
                        <div>
                            <p className="text-center text-lg text-gray-900 font-semibold my-2">Availability</p>
                            <LocalizationProvider dateAdapter={AdapterDayjs}>
                                <DateCalendar
                                    value={startDate}
                                    minDate={startDate}
                                    maxDate={endDate}
                                    slots={{ day: Day }}
                                    slotProps={{
                                        day: { start: startDate, end: endDate },
                                    }}
                                    readOnly
                                />
                            </LocalizationProvider>
                        </div>
                        <p className="text-center text-lg text-gray-900 font-semibold my-2">Amenities</p>
                        <div className='flex justify-center mb-2'>
                            {Object.keys(listing.amenities).map((amenity) =>
                                listing.amenities[amenity] && (
                                    <div className="flex flex-col items-center m-2" key={amenity}>
                                        <AmenityIcon amenity={amenity} />
                                        <span className="text-xs">{amenity}</span>
                                    </div>
                                )
                            )}
                        </div>
                        <p className="text-lg text-gray-900 font-semibold">Description</p>
                        <div className="p-4 border rounded-lg text-left text-lg text-gray-800">
                            <div dangerouslySetInnerHTML={{ __html: listing.description }} />
                        </div>
                    </>
                )}
                {editMode && (
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
                            type="text" name="country"
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
                        <ReactQuill
                            value={description}
                            onChange={handleDescriptionChange}
                            placeholder="Description"
                            className="mb-2"
                        />
                    </div>
                )}
            </div>
            {images.length > 0 && (
                <>
                    <p className="text-center text-lg text-gray-900 font-semibold my-2">Gallery</p>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {images.map((image, index) => (
                            <img
                                key={index}
                                src={image.imageUrl}
                                alt={`Image ${index + 1}`}
                                className="w-full h-48 object-cover rounded-lg cursor-pointer"
                                onClick={() => {
                                    setFullImage(image.imageUrl);
                                    setShowFullImage(true);
                                }}
                            />
                        ))}
                    </div>
                </>
            )}
            {showFullImage && (
                <div className="fixed inset-0 z-50 flex justify-center items-center bg-black bg-opacity-75">
                    <button
                        onClick={() => setShowFullImage(false)}
                        className="absolute top-4 right-4 text-white text-2xl"
                    >
                        &times;
                    </button>
                    <img
                        src={fullImage}
                        alt="Full Size"
                        className="max-w-full max-h-full"
                    />
                </div>
            )}
        </div>
    );
};

export default DetailsListing;