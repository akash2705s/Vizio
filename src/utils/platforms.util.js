import APP_CONFIG from '../config/app.config';

// Utility to check platform
const isWeb = () => window?.CB?.platform === APP_CONFIG.PLATFORMS.WEB;

export default isWeb;
