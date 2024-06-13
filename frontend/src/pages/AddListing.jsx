import React, { useState } from "react";
import { supabase } from '../supabaseClient';
import { useUser } from '../assets/UserContext.jsx';

const AddListing = () => {
    const { user } = useUser();
    const [form, setForm] = useState({
        name: '',
        address: '',
        price: '',
        guests: '',
        description: '',
        // images: ['', '', ''],
        amenities: {
            wifi: false,
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

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!user) {
            setMessage('User is not logged in.');
            return;
        }

        const listingData = {
            ...form,
            // images: imageUrls,
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
                price: '',
                guests: '',
                description: '',
                // images: ['', '', ''],
                amenities: {
                    wifi: false,
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
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-cyan-900">Publish Your Place</h1>
            <form className="flex flex-col gap-6 sm:flex-row" onSubmit={handleSubmit}>
                <div className="flex flex-col md:w-96 p-2">
                    <h2 className="text-xl">Details</h2>
                    <hr className="mt-2 mb-4" />
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" value={form.name} onChange={handleChange} />
                    <label htmlFor="address">Address:</label>
                    <input type="text" name="address" id="address" value={form.address} onChange={handleChange} />
                    <label htmlFor="price">Price/night:</label>
                    <input type="text" name="price" id="price" value={form.price} onChange={handleChange} />
                    <label htmlFor="guests">Guests:</label>
                    <input type="number" name="guests" id="guests" value={form.guests} onChange={handleChange} />
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={form.description} onChange={handleChange} />
                </div>
                {/* <div className="flex flex-col md:w-96 p-2">
                    <h2 className="text-xl">Images</h2>
                    <hr className="mt-2 mb-4" />
                    {form.images.map((image, index) => (
                        <div key={index}>
                            <label htmlFor={`image${index}`}>Image {index + 1}:</label>
                            <input type="file" name={`image${index}`} id={`image${index}`} onChange={(e) => handleImageChange(index, e)} />
                        </div>
                    ))}
                </div> */}
                <div className="flex flex-col md:w-96 p-2">
                    <h2 className="text-xl">Amenities</h2>
                    <hr className="mt-2 mb-4" />
                    {Object.keys(form.amenities).map(amenity => (
                        <div key={amenity}>
                            <label htmlFor={amenity}>{amenity.charAt(0).toUpperCase() + amenity.slice(1)}:</label>
                            <input type="checkbox" name={amenity} id={amenity} checked={form.amenities[amenity]} onChange={handleChange} />
                        </div>
                    ))}
                </div>
                <div className="flex flex-col md:w-80 p-2">
                    <h2 className="text-xl">Availability</h2>
                    <hr className="mt-2 mb-4" />
                    <label htmlFor="start">Start Date:</label>
                    <input type="date" name="start" id="start" value={form.availability.start} onChange={handleChange} />
                    <label htmlFor="end">End Date:</label>
                    <input type="date" name="end" id="end" value={form.availability.end} onChange={handleChange} />
                </div>
                <button type="submit" className="p-2 bg-cyan-200 rounded-md">
                    Publish Listing
                </button>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
};

export default AddListing;