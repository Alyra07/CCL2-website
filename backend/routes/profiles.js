const { createClient } = require('@supabase/supabase-js');

const supabaseUrl = 'https://asfguipgiafjfgqzzoky.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImFzZmd1aXBnaWFmamZncXp6b2t5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MTgwMzU0MDYsImV4cCI6MjAzMzYxMTQwNn0.Q9U0z8vo4BRNII-ufAWi6fjNdrR88aukpB6FD6gx_AY';  // Ensure this is correct and secure
const supabase = createClient(supabaseUrl, supabaseKey);

const express = require('express');
const router = express.Router();

// Endpoint to create a profile
router.post('/', async (req, res) => {
  const { id, email, name, surname } = req.body;

  try {
    // Check if profile already exists
    const { data: existingProfile, error: fetchError } = await supabase
      .from('users')
      .select('*')
      .eq('email', email)
      .single();

    if (fetchError && fetchError.code !== 'PGRST116') {
      // If fetchError is not 'PGRST116', something went wrong
      return res.status(500).json({ error: `Fetch error: ${fetchError.message}` });
    }

    if (existingProfile) {
      // If profile exists, update it
      const { data, error } = await supabase
        .from('users')
        .update({ name, surname })
        .eq('email', email);

      if (error) {
        return res.status(500).json({ error: `Update error: ${error.message}` });
      }

      return res.status(200).json({ message: 'Profile updated successfully', data });
    }

    // If profile does not exist, create it
    const { data, error } = await supabase
      .from('users')
      .insert([{ id, email, name, surname }]);

    if (error) {
      return res.status(500).json({ error: `Insert error: ${error.message}` });
    }

    return res.status(200).json({ message: 'Profile created successfully', data });

  } catch (error) {
    return res.status(500).json({ error: `Server error: ${error.message}` });
  }
});

module.exports = router;