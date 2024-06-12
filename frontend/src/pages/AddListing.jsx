import React, { useState } from "react";

const AddListing = () => {
    const [formData, setFormData] = useState({
        name: "",
        address: "",
        price: "",
        description: "",
        images: [],
        wifi: false,
        kitchen: false,
        parking: false,
        pool: false,
        startDate: "",
        endDate: "",
    });

    const handleChange = (e) => {
        const { name, value, type, checked, files } = e.target;
        if (type === "checkbox") {
            setFormData({
                ...formData,
                [name]: checked,
            });
        } else if (type === "file") {
            setFormData({
                ...formData,
                images: [...formData.images, ...files],
            });
        } else {
            setFormData({
                ...formData,
                [name]: value,
            });
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        // Add logic to send formData to the backend
        console.log(formData);
    };

    return (
        <div className="flex flex-col items-center">
            <h1 className="text-3xl text-cyan-900">Publish Your Place</h1>
            <p className="text-lg mb-2 text-gray-500">
                Describe your new listing...
            </p>
            <form className="flex flex-col gap-6 sm:flex-row" onSubmit={handleSubmit}>
                <div className="flex flex-col md:w-96 p-2">
                    <h2 className="text-xl">Details</h2>
                    <hr className="mt-2 mb-4" />
                    <label htmlFor="name">Name:</label>
                    <input type="text" name="name" id="name" value={formData.name} onChange={handleChange} />
                    <label htmlFor="address">Address:</label>
                    <input type="text" name="address" id="address" value={formData.address} onChange={handleChange} />
                    <label htmlFor="price">Price/night:</label>
                    <input type="text" name="price" id="price" value={formData.price} onChange={handleChange} />
                    <label htmlFor="description">Description:</label>
                    <textarea name="description" id="description" value={formData.description} onChange={handleChange} />
                </div>
                <div className="flex flex-col p-2 md:w-80">
                    <h2 className="text-xl">Upload images</h2>
                    <hr className="mt-2 mb-4" />
                    <label htmlFor="image">Image:</label>
                    <input type="file" name="image" id="image" multiple onChange={handleChange} />
                </div>
            </form>
            <form className="flex flex-col gap-6 sm:flex-row" onSubmit={handleSubmit}>
                <div className="flex flex-col w-auto p-2 md:w-96">
                    <h2 className="text-xl">Amenities</h2>
                    <hr className="mt-2 mb-4" />
                    <div>
                        <label htmlFor="wifi">Wifi:</label>
                        <input type="checkbox" name="wifi" id="wifi" checked={formData.wifi} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="kitchen">Kitchen:</label>
                        <input type="checkbox" name="kitchen" id="kitchen" checked={formData.kitchen} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="parking">Parking:</label>
                        <input type="checkbox" name="parking" id="parking" checked={formData.parking} onChange={handleChange} />
                    </div>
                    <div>
                        <label htmlFor="pool">Pool:</label>
                        <input type="checkbox" name="pool" id="pool" checked={formData.pool} onChange={handleChange} />
                    </div>
                </div>
                <div className="flex flex-col w-auto p-2 md:w-80">
                    <h2 className="text-xl">Availability</h2>
                    <hr className="mt-2 mb-4" />
                    <label htmlFor="start">Start Date:</label>
                    <input type="date" name="startDate" id="start" value={formData.startDate} onChange={handleChange} />
                    <label htmlFor="end">End Date:</label>
                    <input type="date" name="endDate" id="end" value={formData.endDate} onChange={handleChange} />
                </div>
            </form>
            <button type="submit" className="mt-4 bg-cyan-700 text-white py-2 px-4 rounded">
                Submit Your Listing
            </button>
        </div>
    );
};

export default AddListing;