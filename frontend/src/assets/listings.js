import { supabase } from "../supabaseClient";

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