/* eslint-disable no-nested-ternary */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
// import Popbackground from '../assets/images/Popbackground.png';

// Layout for prompt dialogs
const subPrompt = ({ children }) => {
  const previousActiveView = useRef(null);
  useEffect(() => {
    const element = window.document.querySelector('.user-active');
    if (element) {
      previousActiveView.current = element?.id || null;
      element.classList.remove('user-active');
    }

    return () => {
      if (previousActiveView.current) {
        const id = previousActiveView.current;
        const previousElement = window.document.querySelector(`#${id}`);
        if (previousElement) {
          previousElement.classList.add('user-active');
        } else {
          // In case screen changed, get the first view element
          const fallbackElement = window.document.querySelector('.view');
          if (fallbackElement) {
            fallbackElement.classList.add('user-active');
          }
        }
      }
    };
  }, []);

  return <div className="prompt-dialog layout">{children}</div>;
};

subPrompt.propTypes = {
  children: PropTypes.any.isRequired,

  lockPOpUpp: PropTypes.bool.isRequired,
};

export default subPrompt;
