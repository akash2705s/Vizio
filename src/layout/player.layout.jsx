import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';

// Layout for player
const PlayerLayout = ({ children }) => {
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

  return <div className="player-view layout">{children}</div>;
};

PlayerLayout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default PlayerLayout;
