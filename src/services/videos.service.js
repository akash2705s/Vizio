import doAPICall from '../utils/api.util';

// Get featured content videos
const getVideos = async () => {
  const response = await doAPICall('/products', 'GET', null, null, null);

  return response;
};

export default getVideos;
