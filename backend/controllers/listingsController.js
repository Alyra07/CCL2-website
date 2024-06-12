const { v4: uuidv4 } = require('uuid');

// Mock data store, replace with your database logic
let listings = [];

const addListing = (req, res) => {
    const { userId, name, address, price, description, images, amenities, startDate, endDate } = req.body;

    const newListing = {
        id: uuidv4(),
        userId,
        name,
        address,
        price,
        description,
        images,
        amenities,
        startDate,
        endDate,
    };

    listings.push(newListing);
    res.status(201).json(newListing);
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