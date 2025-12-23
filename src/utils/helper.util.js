/* eslint-disable no-console */
export const logger = {
  log: (...args) => {
    try {
      console.log(...args);
    } catch (err) {
      //
    }
  },
  warn: (...args) => {
    try {
      console.warn(...args);
    } catch (err) {
      //
    }
  },
  error: (...args) => {
    try {
      console.error(...args);
    } catch (err) {
      //
    }
  },
  info: (...args) => {
    try {
      console.info(...args);
    } catch (err) {
      //
    }
  },
};

export const getBrowserVersion = () => {
  const ua = window.navigator.userAgent;
  const match = ua.match(
    /(chrome|firefox|safari|edge|opr|msie|trident)\/?\s*(\d+)/i
  );

  if (!match) return null; // Return null if no match is found

  if (/trident/i.test(match[1])) {
    const ieVersion = /\brv[ :]+(\d+)/.exec(ua);
    return ieVersion ? +ieVersion[1] : null; // Convert to number
  }

  if (match[1] === 'Chrome') {
    const edgeOrOpera = ua.match(/\b(OPR|Edg)\/(\d+)/);
    if (edgeOrOpera) return +edgeOrOpera[2]; // Convert to number
  }

  return match[2] ? +match[2] : null; // Convert to number
};

export const CUSTOM_KEYBOARD_KEYS = [
  ['a', 'b', 'c', 'd', 'e', 'f'],
  ['g', 'h', 'i', 'j', 'k', 'l'],
  ['m', 'n', 'o', 'p', 'q', 'r'],
  ['s', 't', 'u', 'v', 'w', 'x'],
  ['y', 'z', '1', '2', '3', '4'],
  ['5', '6', '7', '8', '9', '0'],
];
