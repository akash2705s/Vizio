import React, { useEffect } from 'react';
import showExitApp from '../../utils/app-exist.util';
import lang from '../../assets/locale/default.json';
import PromptLayout from '../../layout/prompt.layout';
import logoImg from '../../assets/images/logo.png';
import voiceSpeak from '../../utils/accessibility.util';

const ExitPrompt = () => {
  const currentTTSContent = "Are you sure you want to exit the application? No button";
  const resumeApp = () => {
    showExitApp();
  };

  const closeApp = () => {
    if (window.VIZIO) {
      window.VIZIO.exitApplication();
    } else {
      resumeApp();
    }
  };

  const handleOnButtonFocus = (title) => {
    voiceSpeak(`${title} button`);
  }

  useEffect(() => {
    voiceSpeak(currentTTSContent);
  }, [])

  return (
    <PromptLayout>
      <div className="dialog view popup user-active pop-up-logout-exit-content">
        <div className="dialog-body">
          <div className="logo">
            <img src={logoImg} alt="logo" />
          </div>
          <div className="desciption">
            {lang.exit_confirmation.exit_dialog_message}
          </div>
          <div className="actions">
            <button
              type="button"
              className="pop-up-done pop-up-btn-yes btn confirm left prj-element"
              onClick={closeApp}
              id="resume-app"
              data-focus-down="#close-app"
              data-focus-in="#resume-app-focus-in"
            >
              {lang.common.yes}
            </button>
            <button
              type="button"
              className="pop-up-done pop-up-btn-no btn cancel prj-element focused"
              onClick={resumeApp}
              id="close-app"
              data-focus-up="#resume-app"
              data-focus-in="#close-app-focus-in"
            >
              {lang.common.no}
            </button>
          </div>
          <button
            className="hide"
            type="button"
            id="resume-app-focus-in"
            onClick={() => handleOnButtonFocus(lang.common.yes)}
          >
            Focus In
          </button>
          <button
            className="hide"
            type="button"
            id="close-app-focus-in"
            onClick={() => handleOnButtonFocus(lang.common.no)}
          >
            Focus In
          </button>
        </div>
      </div>
    </PromptLayout>
  );
};

export default ExitPrompt;
