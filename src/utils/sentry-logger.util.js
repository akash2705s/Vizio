import { getBrowserVersion, logger } from './helper.util';

export const sentryLog = (message) => {
  try {
    if (getBrowserVersion() < 80) {
      return null;
    }
    if (window?.Sentry) {
      return window?.Sentry?.captureMessage(message);
    }
  } catch (error) {
    logger.log(error, 'error');
  }
  return null;
};

export const sentryException = (e) => {
  try {
    if (getBrowserVersion() < 80) {
      return null;
    }
    if (window?.Sentry) {
      return window?.Sentry?.captureException(e);
    }
  } catch (error) {
    logger.log(error, 'error');
  }
  return null;
};
