const { v4: uuidv4 } = require('uuid');

let listings = [];

const addListing = async (req, res) => {
    try {
        const { userId, name, address, price, description, amenities, startDate, endDate } = req.body;
        // const images = req.files ? req.files.images : [];

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