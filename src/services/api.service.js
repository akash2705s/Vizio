import { CACHE_BUSTER } from '../config/app.config';

// Helper to append cache buster if needed
const appendCacheBuster = (url) => {
  if (CACHE_BUSTER.FORCE) {
    return (
      url +
      (url.includes('?')
        ? CACHE_BUSTER.VALUE.replace('&', '&')
        : CACHE_BUSTER.VALUE.replace('&', '?'))
    );
  }
  return url;
};

// To fetch menu details
export const getMainMenuData = async (signal) => {
  let url = `${window.CB.channelBase}${window.CB.apiVersion}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return response;
};

// To get menu categories
export const getMenuDetails = async (id, signal) => {
  let url = `${window.CB.channelBase}${window.CB.apiVersion}/tab/${id}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return response;
};

// To get video based on menu and category selection
export const getMenuVideoDetails = async (id, catId, page, perPage, signal) => {
  let url = `${window.CB.channelBase}${window.CB.apiVersion}/tab/${id}/${catId}/all?page=${page}&per_page=${perPage}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return response;
};

// To get video based on menu and category selection
export const getMenuVideoDetailsForAll = async (
  id,
  catId,
  page,
  perPage,
  signal
) => {
  let url = `${window.CB.channelBase}${window.CB.apiVersion}/tab/${id}/${catId}/all?page=${page}&per_page=${perPage}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return { res: response, id: catId };
};

// To get episodes
export const getEpisodes = async (id, catId, sId, page, perPage, signal) => {
  let url = `${window.CB.channelBase}${window.CB.apiVersion}/tab/${id}/${catId}/all?page=${page}&per_page=${perPage}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return response;
};

// Search data
export const searchData = async (query, signal, page = 1, perPage = 10) => {
  let url = `${
    window.CB.channelBase
  }${window.CB.apiVersion}/search?search=${encodeURIComponent(query)}&page=${page}&per_page=${perPage}`;
  url = appendCacheBuster(url);
  const jsonCall = await fetch(url, { signal });
  const response = await jsonCall.json();
  return response;
};

// setting data
export const getSettingData = async (url, signal) => {
  const finalUrl = appendCacheBuster(url);
  const jsonCall = await fetch(finalUrl, { signal });
  const response = await jsonCall.json();
  return response;
};

export const getVastUrlWithParam = async (url, signal) => {
  const finalUrl = appendCacheBuster(url);
  const jsonCall = await fetch(finalUrl, { signal });
  const response = await jsonCall.json();
  return response;
};
