import { supabase } from "../supabaseClient";

// Fetch all listings from supabase (ListMain)
export const fetchAllListings = async () => {
    try {
      const response = await supabase
        .from('listings')
        .select('*');

      if (response.error) {
        throw response.error;
      }

      return response.data;

    } catch (error) {
      console.error('Error fetching listings:', error.message);
      setMessage('Error fetching listings.');
    }
};

// Fetch a single listing from supabase by ID (DetailsPage)
export const fetchListingById = async (id) => {
  try {
      const { data, error } = await supabase
          .from('listings')
          .select('*')
          .eq('id', id)
          .single();

      if (error) {
          throw error;
      }

      return data;

  } catch (error) {
      console.error(`Error fetching listing with ID ${id}:`, error.message);
      throw new Error(`Error fetching listing with ID ${id}.`);
  }
};

// Update a listing data in supabase by ID (DetailsListing)
export const updateListing = async (id, updatedFields) => {
  try {
    const { data, error } = await supabase
      .from('listings')
      .update(updatedFields)
      .eq('id', id);

    if (error) {
      throw error;
    }

    return data;
  } catch (error) {
    console.error(`Error updating listing with ID ${id}:`, error.message);
    throw new Error(`Error updating listing with ID ${id}.`);
  }
};