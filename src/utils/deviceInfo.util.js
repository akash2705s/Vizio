import { v4 as uuidv4 } from 'uuid';

export const getDeviceId = () => uuidv4();

export const getDeviceModel = () => 'Model';

export const getUserAgent = () => window.navigator.userAgent;

export const getDeviceDimensions = () => ({ width: 1920, height: 1080 });

export const getDeviceOs = () => 'Ubuntu';

export const getDeviceOsVersion = () => '22.04';

export const getAllDeviceInfo = () => ({
  uid: getDeviceId(),
  model: getDeviceModel(),
  ua: getUserAgent(),
  dimensions: getDeviceDimensions(),
  os: getDeviceOs(),
  osv: getDeviceOsVersion(),
});
