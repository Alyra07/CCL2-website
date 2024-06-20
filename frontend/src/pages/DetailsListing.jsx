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
import DeleteRoundedIcon from '@mui/icons-material/DeleteRounded';
import ModeEditRoundedIcon from '@mui/icons-material/ModeEditRounded';
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
            fetchImages(data.images);
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
            setLoading(false);
        } catch (error) {
            console.error('Error fetching listing:', error.message);
            setMessage('Error fetching listing.');
            setLoading(false);
        }
    };

    const fetchImages = async (imageNames) => {
        if (!imageNames || imageNames.length === 0) return;

        try {
            const imagePromises = imageNames.map(async (imageName) => {
                const { data, error } = await supabase.storage.from('images').download(imageName);

                if (error) throw error;

                const imageUrl = URL.createObjectURL(data);
                return { imageName, imageUrl };
            });

            const fetchedImages = await Promise.all(imagePromises);
            setImages(fetchedImages);

            if (imageNames.length > 0) {
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
        confirm('Are you sure you want to delete this listing?');

        if (confirm) {
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
        <div className="p-4 md:p-10 lg:p-16">
            <h1 className="text-3xl text-center text-primary font-bold">{listing.name}</h1>
            <div className='gap-2 lg:gap-6 flex flex-row justify-between my-2'>
                <button onClick={handleBack} className="bg-accent text-white p-2 rounded-lg hover:bg-red-300 transition duration-300">
                    <ArrowBackIosRoundedIcon />
                </button>
                <section>
                    <button
                        onClick={editMode ? handleEdit : () => setEditMode(true)}
                        className="bg-primary text-white p-2 rounded-lg hover:bg-secondary"
                    >
                        <ModeEditRoundedIcon />
                        <span className='ml-2'>{editMode ? "Save" : "Edit"}</span>
                    </button>
                    <button
                        onClick={handleDelete}
                        className="bg-accentred text-white p-2 rounded-lg ml-4 hover:bg-red-300"
                    >
                        <DeleteRoundedIcon />
                    </button>
                </section>
            </div>
            <div className="text-left">
                <img src={headerImage} alt={listing.name} className="w-full h-64 object-cover rounded-lg" />
                {!editMode && (
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
                    </div>
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
                            placeholder="Availability End" className="border p-2 rounded mb-2 w-full"
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
                {/* Display Images */}
                <>
                {images.length > 0 && (
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
                    )}
                {/* Amenities and Description */}
                <div className="text-center justify-center">
                    <p className="text-lg text-gray-900 pb-4 pt-4 xl:pt-16 font-semibold">Amenities</p>
                    <div className='mb-8 gap-4 flex justify-center flex-wrap'>
                        {Object.keys(listing.amenities).filter(amenity => listing.amenities[amenity]).map((amenity) => (
                            <div key={amenity} className={`p-2 rounded-lg bg-accent text-white`}>
                                <AmenityIcon amenity={amenity} />
                                <span className='font-semibold ml-2'>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}</span>
                            </div>
                        ))}
                    </div>
                    <p className="text-lg text-gray-900 font-semibold">Description:</p>
                    <div className="mx-4 lg:mx-32 my-4" dangerouslySetInnerHTML={{ __html: listing.description }} />
                </div>
            </>
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
    
    export default DetailsListing;