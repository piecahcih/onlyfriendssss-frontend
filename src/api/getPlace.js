import axios from "axios";


export default async function getPlaces(query) {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${query}.json`,
      {
        params: {
          access_token: import.meta.env.VITE_MAPBOX_TOKEN,
        },
      }
    );
    console.log('response', response)
    return response.data.features;
  } catch (error) {
    console.error("There was an error while fetching places:", error);
  }
}

export const reverseGeocode = async (lat, lng) => {
  try {
    const response = await axios.get(
      `https://api.mapbox.com/geocoding/v5/mapbox.places/${lng},${lat}.json`,
      {
        params: {
          access_token: import.meta.env.VITE_MAPBOX_TOKEN,
          language: 'th,en'
        },
      }
    );
    return response.data.features[0];
  } catch (error) {
    console.error("Reverse Geocoding Error:", error);
    return null;
  }
};
