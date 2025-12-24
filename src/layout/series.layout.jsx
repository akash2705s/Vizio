import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

const SeriesLayOut = ({ children }) => {
  const previousActiveView = useRef(null);

  useEffect(() => {
    const element = window.document.querySelector('.user-active');
    if (element) {
      // window?.document?.getElementById('home-preview-video')?.pause();
      previousActiveView.current = element?.id || null;
      element.classList.remove('user-active');
    }
    return () => {
      if (previousActiveView.current) {
        const id = previousActiveView.current;
        const previousElement = window.document.getElementById(id);
        if (previousElement) {
          previousElement.classList.add('user-active');
          // window?.document?.getElementById('home-preview-video')?.play();
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
  return (
    <div className="fullscreen-container-fixed sub-series-view-container layout">
      {children}
    </div>
  );
};

SeriesLayOut.propTypes = {
  children: PropTypes.element.isRequired,
};

export default SeriesLayOut;
