const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';

const supabase = createClient(supabaseUrl, supabaseKey);

const express = require('express');
const router = express.Router();

// Endpoint to create a profile
router.post('/', async (req, res) => {
  const { id, email, name, surname } = req.body;

  const { data, error } = await supabase
    .from('users')
    .insert([{ id, email, name, surname }]);

  if (error) {
    res.status(500).json({ error: error.message });
  } else {
    res.status(200).json({ message: 'Profile created successfully', data });
  }
});

module.exports = router;