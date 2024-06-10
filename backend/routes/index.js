const fs = require('fs');
const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
    res.send('Hello, World!');
});

router.post('/', async (req, res) => {
    const data = req.body;

    console.log(data);
    res.send('Data received');
});

module.exports = router;