const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';

const supabase = createClient(supabaseUrl, supabaseKey);

const express = require('express');
const router = express.Router();
const { v4: uuidv4 } = require('uuid'); // Import UUID library for generating unique IDs

// Endpoint to create a profile
router.post('/', async (req, res) => {
  try {
    const { email, name, surname } = req.body;

    // Generate a unique ID for the profile
    const id = uuidv4();

    // Insert the new profile into the database
    const { data, error } = await supabase
      .from('profiles')
      .insert([{ id, email, name, surname, favorites: [] }]);

    if (error) {
      throw error;
    }

    res.status(200).json({ message: 'Profile created successfully', data });
  } catch (error) {
    console.error('Error creating profile:', error.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

module.exports = router;