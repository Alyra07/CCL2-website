const express = require('express');
const router = express.Router();
const { addListing, getUserListings } = require('../controllers/listingsController');

router.post('/add', addListing);
router.get('/user/:userId', getUserListings);

module.exports = router;