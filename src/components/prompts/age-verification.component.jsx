import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import lang from '../../assets/locale/default.json';
import PromptLayout from '../../layout/prompt.layout';
import logoImg from '../../assets/images/logo.png';
import voiceSpeak from '../../utils/accessibility.util';

const AgeVerificationPrompt = ({ onVerified, onReject }) => {
  const currentTTSContent = `Welcome to ${process.env.REACT_APP_NAME}; In Order to Watch Hundreds of Free Movies Please Confirm that You Are At Least 18 years Old. Are You at Least 18 Years Old? Yes button`;
  const handleYes = () => {
    // Store age verification in localStorage
    localStorage.setItem('ageVerified', 'true');
    if (onVerified) {
      onVerified();
    }
  };

  const handleNo = () => {
    // Exit the app if user is not 18+
    if (onReject) {
      onReject();
    }
    if (window.VIZIO) {
      window.VIZIO.exitApplication();
    }
  };

  const handleOnButtonFocus = (title) => {
    voiceSpeak(`${title} button`);
  }

  useEffect(() => {
    document.addEventListener("VIZIO_LIBRARY_DID_LOAD", (e) => {
      console.log("VIZIO_LIBRARY_DID_LOAD ", e);
      voiceSpeak(currentTTSContent);
    });
    voiceSpeak(currentTTSContent);
  }, [])

  return (
    <PromptLayout>
      <div className="dialog view popup user-active pop-up-age-verification-content">
        <div className="dialog-body">
          <div className="logo">
            <img src={logoImg} alt="logo" />
          </div>
          <div className="desciption">
            <h4>Welcome to {process.env.REACT_APP_NAME}</h4>
            <div className="info">
              In Order to Watch Hundreds of Free Movies
            </div>
            <p>Please Confirm that You Are At Least 18 years Old</p>
            <h4>Are You at Least 18 Years Old?</h4>
          </div>
          <div className="actions">
            <button
              id="age-verify-yes"
              type="button"
              className="pop-up-done pop-up-btn-yes btn confirm left prj-element focused"
              onClick={handleYes}
              data-focus-down="#age-verify-no"
              data-focus-in="#age-verify-yes-focus-in"
            >
              {lang.common.yes}
            </button>
            <button
              id="age-verify-no"
              type="button"
              className="pop-up-done pop-up-btn-no btn cancel prj-element"
              onClick={handleNo}
              data-focus-up="#age-verify-yes"
              data-focus-in="#age-verify-no-focus-in"
            >
              {lang.common.no}
            </button>
          </div>
          <button
            className="hide"
            type="button"
            id="age-verify-yes-focus-in"
            onClick={() => handleOnButtonFocus(lang.common.yes)}
          >
            Focus In
          </button>
          <button
            className="hide"
            type="button"
            id="age-verify-no-focus-in"
            onClick={() => handleOnButtonFocus(lang.common.no)}
          >
            Focus In
          </button>
        </div>
      </div>
    </PromptLayout>
  );
};

AgeVerificationPrompt.propTypes = {
  onVerified: PropTypes.func.isRequired,
  onReject: PropTypes.func.isRequired,
};

export default AgeVerificationPrompt;
