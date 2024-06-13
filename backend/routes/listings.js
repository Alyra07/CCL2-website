const express = require('express');
const router = express.Router();
const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';
const supabase = createClient(supabaseUrl, supabaseKey);

// Endpoint to get listings for a specific user
router.get('/user/:userId', async (req, res) => {
  const { userId } = req.params;

  try {
    const { data: listings, error } = await supabase
      .from('listings')
      .select('*')
      .eq('user_id', userId);

    if (error) {
      throw error;
    }

    res.json(listings);
  } catch (error) {
    res.status(500).json({ error: `Fetch error: ${error.message}` });
  }
});

module.exports = router;