const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';

const supabase = createClient(supabaseUrl, supabaseKey);

const express = require('express');
const router = express.Router();

// Endpoint to create a profile
router.post('/', async (req, res) => {
  const { id, email, name, surname } = req.body;

  const { error } = await supabase
    .from('profiles')
    .insert([
      { id, email, name, surname, favorites: [] } // Initialize favorites as an empty array
    ]);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Profile created successfully' });
});

// Endpoint to get a profile by user id
router.get('/:id', async (req, res) => {
  const { id } = req.params;

  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .eq('id', id)
    .single();

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json(data);
});

// Endpoint to update favorites
router.put('/favorites', async (req, res) => {
  const { id, favorites } = req.body;

  const { error } = await supabase
    .from('profiles')
    .update({ favorites })
    .eq('id', id);

  if (error) {
    return res.status(400).json({ error: error.message });
  }

  res.status(200).json({ message: 'Favorites updated successfully' });
});

module.exports = router;