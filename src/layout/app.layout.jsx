import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { Toaster } from 'react-hot-toast';
import ExitPrompt from '../components/prompts/exit-prompt.component';

// App wide common layout
const AppLayout = ({ children }) => {
  const [showExitConfirmation, setShowExitConfirmation] = useState(false);

  const toggleExitConfirmation = () => {
    setShowExitConfirmation(!showExitConfirmation);
  };

  return (
    <div className="app-container layout">
      {children}

      <Toaster
        toastOptions={{
          className: 'toast-container',
          style: {
            border: '0px',
            padding: '15px',
            color: '#ffffff',
            fontSize: '22px',
          },
          success: {
            style: {
              background: '#2e7d32',
            },
          },
          error: {
            style: {
              background: '#d32f2f',
            },
          },
        }}
      />

      {showExitConfirmation && <ExitPrompt />}
      <button
        type="button"
        className="app-exit-confirmation hide"
        onClick={toggleExitConfirmation}
      >
        ShowExitConfirmation
      </button>
    </div>
  );
};

AppLayout.propTypes = {
  children: PropTypes.any.isRequired,
};

export default AppLayout;
