import React, { useState } from "react";
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';

const AddListing = () => {
    const { user } = useUser();
    const [form, setForm] = useState({
        name: '',
        address: '',
        country: '',
        price: '',
        guests: '',
        description: '',
        images: ['', '', ''],
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
        if (name in form.amenities) {
            setForm({
                ...form,
                amenities: {
                    ...form.amenities,
                    [name]: checked
                }
            });
        } else if (name === "start" || name === "end") {
            setForm({
                ...form,
                availability: {
                    ...form.availability,
                    [name]: value
                }
            });
        } else {
            setForm({
                ...form,
                [name]: value
            });
        }
    };

    const handleImageChange = (index, e) => {
        const newImages = [...form.images];
        newImages[index] = e.target.files[0];
        setForm({ ...form, images: newImages });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
    
        if (!user) {
            setMessage('User is not logged in.');
            return;
        }
    
        const imageUrls = []; // Store image URLs to be saved in the database
    
        const listingData = {
            ...form,
            images: imageUrls.filter(url => url !== ''), // Filter out any empty strings
            user_id: user.id,
        };
    
        const { data, error } = await supabase
            .from('listings')
            .insert([listingData]);
    
        if (error) {
            console.error('Error adding listing:', error.message);
            setMessage('Error adding listing.');
        } else {
            setMessage('Listing added successfully.');
            setForm({
                name: '',
                address: '',
                country: '',
                price: '',
                guests: '',
                description: '',
                images: ['', '', ''],
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
        }
    };

    return (
        <div className="flex flex-col bg-background p-4 md:p-10 lg:p-16">
            <h1 className="text-center text-3xl font-semibold text-primary mb-4 md:mb-6 sm:mb-6">Publish Your Place</h1>
            <p className="text-center text-lg text-accent">
                {message}
            </p>
            <form className="flex flex-col md:flex-row md:gap-6 flex-grow" 
                    onSubmit={handleSubmit}>
                {/* Details Section */}
                <div className="flex flex-col md:w-1/2 mt-2">
                    <h2 className="text-xl mb-2">Details</h2>
                    <hr className="mb-4" />
                    <div className="mb-2">
                        <label htmlFor="name" className="block mb-1">Name:</label>
                        <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="name" id="name" value={form.name} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="address" className="block mb-1">Address:</label>
                        <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="address" id="address" value={form.address} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="country" className="block mb-1">Country:</label>
                        <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="country" id="country" value={form.country} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="price" className="block mb-1">Price/night:</label>
                        <input className="p-2 border-2 border-secondary rounded-lg w-full" type="text" name="price" id="price" value={form.price} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="guests" className="block mb-1">Guests:</label>
                        <input className="p-2 border-2 border-secondary rounded-lg w-full" type="number" name="guests" id="guests" value={form.guests} onChange={handleChange} />
                    </div>
                    <div className="mb-2">
                        <label htmlFor="description" className="block mb-1">Description:</label>
                        <textarea className="p-2 border-2 border-secondary rounded-lg w-full" name="description" id="description" value={form.description} onChange={handleChange} />
                    </div>
                </div>
                {/* Other Sections */}
                <div className="flex flex-col md:w-1/2 md:space-y-4 mt-2">
                    {/* Images Section */}
                    <div>
                        <h2 className="text-xl mb-2">Images</h2>
                        <hr className="mt-2 mb-4" />
                        {form.images.map((image, index) => (
                            <div key={index} className="mb-2">
                                <label htmlFor={`image${index}`} className="block mb-1">Image {index + 1}:</label>
                                <input className="p-2 border-2 border-secondary rounded-lg w-full" type="file" name={`image${index}`} id={`image${index}`} onChange={(e) => handleImageChange(index, e)} />
                            </div>
                        ))}
                    </div>
                    {/* Availability Section */}
                    <div className="my-2">
                        <h2 className="text-xl mb-2">Availability</h2>
                        <hr className="mt-2 mb-4" />
                        <div className="mb-2">
                            <label htmlFor="start" className="block mb-1">Start Date:</label>
                            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="date" name="start" id="start" value={form.availability.start} onChange={handleChange} />
                        </div>
                        <div className="mb-2">
                            <label htmlFor="end" className="block mb-1">End Date:</label>
                            <input className="p-2 border-2 border-secondary rounded-lg w-full" type="date" name="end" id="end" value={form.availability.end} onChange={handleChange} />
                        </div>
                    </div>
                    {/* Amenities Section */}
                    <div className="my-2">
                        <h2 className="text-xl mb-2">Amenities</h2>
                        <hr className="mt-2 mb-4" />
                        <div className="flex flex-row space-x-2 md:space-x-3">
                        {Object.keys(form.amenities).map(amenity => (
                            <div key={amenity} className="mb-2">
                                <label htmlFor={amenity} className="mb-1">{amenity.charAt(0).toUpperCase() + amenity.slice(1)}:</label>
                                <input className="ml-2" type="checkbox" name={amenity} id={amenity} checked={form.amenities[amenity]} onChange={handleChange} />
                            </div>
                        ))}
                        </div>
                    </div>
                </div>
                {/* Publish Button */}
                <div className="flex justify-center my-auto">
                    <button type="submit" className="text-md text-white p-2 bg-accent hover:bg-red-300 rounded-lg w-full sm:w-auto">
                        Publish Listing
                    </button>
                </div>
            </form>
        </div>
    );
};

export default AddListing;