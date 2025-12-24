// Local storage values getter/setters
import { VIDEO_PROGRESS_KEY, CLIENT_IP } from '../config/app.config';

export const setLocalValue = (key, defaultValue = '') => {
  window.localStorage.setItem(key, defaultValue);
};

export const getLocalValue = (key, defaultValue = '') =>
  window.localStorage.getItem(key) || defaultValue;

export const setLocalValueObj = (key, defaultValue = {}) => {
  window.localStorage.setItem(key, JSON.stringify(defaultValue));
};

export const getLocalValueObj = (key, defaultValue = {}) =>
  JSON.parse(window.localStorage.getItem(key) || '{}') || defaultValue;

export const removeLocalValue = (key) => {
  window.localStorage.removeItem(key);
};

export const getAllVideoProgress = () => {
  if (VIDEO_PROGRESS_KEY in window.localStorage) {
    return JSON.parse(window.localStorage.getItem(VIDEO_PROGRESS_KEY));
  }
  return {};
};

export const getUserVideoProgress = (id) => {
  if (VIDEO_PROGRESS_KEY in window.localStorage) {
    const localObj =
      JSON.parse(window.localStorage.getItem(VIDEO_PROGRESS_KEY)) || {};
    return Number(localObj[id] || 0);
  }
  return 0;
};

export const setUserVideoProgress = (id, value) => {
  if (VIDEO_PROGRESS_KEY in window.localStorage) {
    const currentProgress =
      JSON.parse(window.localStorage.getItem(VIDEO_PROGRESS_KEY)) || {};
    currentProgress[id] = Number(value);
    window.localStorage.setItem(
      VIDEO_PROGRESS_KEY,
      JSON.stringify(currentProgress)
    );
  } else {
    const currentProgress = {
      [id]: Number(value),
    };
    window.localStorage.setItem(
      VIDEO_PROGRESS_KEY,
      JSON.stringify(currentProgress)
    );
  }
};

export const setUserIp = (value) => {
  window.localStorage.setItem(CLIENT_IP, value);
};

export const getUserIp = () => {
  if (CLIENT_IP in window.localStorage) {
    return window.localStorage.getItem(CLIENT_IP);
  }
  return '';
};

export const getLocalStorageData = (key) => window.localStorage.getItem(key);

export const addLocalStorageData = (key, data) => {
  window.localStorage.setItem(key, data);
};

export const localStorageKey = {
  lastFocusStack: '__free_movies_movieitaly_focusStack',
};
