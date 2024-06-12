import axios from 'axios';

export const fetchListings = async () => {
  try {
    const response = await axios.get('http://localhost:5000/list');
    return response.data;
  } catch (error) {
    console.error("Error fetching listings:", error);
    throw error;
  }
};