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