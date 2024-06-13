const { v4: uuidv4 } = require('uuid');

// Mock data store, replace with your database logic
let listings = [];

const addListing = async (req, res) => {
    try {
        const { userId, name, address, price, description, amenities, startDate, endDate } = req.body;
        // const images = req.files ? req.files.images : [];

        // Upload images to Supabase Storage
        // const imageUrls = await Promise.all(images.map(async (image) => {
        //     const { data, error } = await supabase.storage.from('images').upload(image.name, image.data);
        //     if (error) {
        //         console.error('Error uploading image:', error.message);
        //         throw new Error('Error uploading image to storage');
        //     }
        //     return `${process.env.SUPABASE_URL}/storage/v1/object/images/public/${data.Key}`;
        // }));

        // Create new listing object with image URLs
        const newListing = {
            id: uuidv4(),
            userId,
            name,
            address,
            price,
            description,
            // images: imageUrls,
            amenities,
            startDate,
            endDate,
        };

        listings.push(newListing);
        res.status(201).json(newListing);
    } catch (error) {
        console.error('Error adding listing:', error.message);
        res.status(500).json({ error: 'Server error' });
    }
};

const getUserListings = (req, res) => {
    const { userId } = req.params;
    const userListings = listings.filter(listing => listing.userId === userId);
    res.status(200).json(userListings);
};

module.exports = {
    addListing,
    getUserListings,
};