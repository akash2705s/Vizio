const ROW_SCROLL_BEHAVIOR = ['fixed-first', 'fixed-last', 'floating'];
const GRID_SCROLL_BEHAVIOR = ['fixed-first', 'fixed-last', 'floating'];

export const APP_PAGES = {
  HOME: 'home',
  SEARCH: 'search',
  SETTINGS: 'settings',
};
export const PAGE_LAYOUT = {
  RAIL: 'rail',
  GRID: 'grid',
};
export const VIDEO_TYPES = {
  EVENT: 'event',
  VIDEO: 'video',
  MOVIES: 'movies',
  SERIES: 'series',
};
export const VIDEO_PROGRESS_KEY = '__u_userProgress';
export const CLIENT_IP = '__u_ip';
export const SHOW_DETAIL_PAGE = true;
const APP_CONFIG = {
  CONFIG: {
    AUTH_TOKEN_EXPIRY_SECONDS: 3600,
    PREVIEW_VIDEO_START_MILLISECONDS: 3000,
    TRACK_API_MIN_PERCENTAGE: 2,
    TRACK_API_MAX_PERCENTAGE: 95,
    TOGGLE_VIDEO_CONTROLBAR_MILLISECONDS: 4000,
  },
  VIEWS: {
    SPLASH: 'v-splash',
    LOGIN: 'v-login',
    HOME: 'v-home',
    SEARCH: 'v-search',
    ACCOUNT: 'v-account',
    FAVOURITES: 'v-favourites',
  },
  REGISTRY: {
    ACCESS_TOKEN: '__cb_usmxvjguau1o',
    REFRESH_TOKEN: '__cb_ndbhp9rqhqfj',
    ACCESS_TOKEN_REFRESH_TIME: '__cb_pq5lzi0k72fh',
    DEVICE_ID: '__cb_0oo3dp4252hb',
  },
  PLATFORMS: {
    WEB: 'WEB',
  },
  VERSION: '1.0.0',
  ROWLIST_CURRENT_SCROLL_BEHAVIOR: ROW_SCROLL_BEHAVIOR[2],
  GRID_CURRENT_SCROLL_BEHAVIOR: GRID_SCROLL_BEHAVIOR[2],
};

// While there is issue of caching in API, keep this flag true.
// Change number each time giving build
export const CACHE_BUSTER = {
  FORCE: false,
  VALUE: `&cb=${Math.ceil(Math.random() * 1000000)}`,
};
export default APP_CONFIG;
