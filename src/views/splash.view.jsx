/* eslint-disable no-unused-vars */
import React, { useEffect } from 'react';
import PropTypes from 'prop-types';
import NavigateBack from '../components/common/navigate-back.component';
import splashScreenImg from '../assets/images/splash.png';
import showExitApp from '../utils/app-exist.util';

// Show splash screen and check user login state
const SplashView = ({ activeView = 'splash-view' }) => {
  const handleBack = () => {
    showExitApp();
  };

  useEffect(() => {
    const existing = [...document.getElementsByTagName('script')].find((s) =>
      s.src.includes('player.js')
    );
    const cb = Math.random() * 1000000;
    const script = document.createElement('script');
    if (!existing && !window.playerScriptLoaded) {
      window.playerScriptLoaded = true;
      script.src = `http://lgwebtv.onestudio.tv/production/player/x9d2m4tq7v8z1p0s5k3bd36dfssd/player.js?c=${cb}`; // VIZIO Player
      // script.src = `./player.js`;
      document.head.appendChild(script);
    }
  }, []);

  return (
    <div className="view-container view user-active" id={activeView}>
      <div className="splashscreen">
        <img src={splashScreenImg} alt="Splashscreen" />
      </div>

      <button className="prj-element focused hide" type="button">
        Hidden
      </button>

      <NavigateBack onBack={handleBack} />
    </div>
  );
};

SplashView.propTypes = {
  /* eslint-disable react/require-default-props */
  activeView: PropTypes.string,
};
export default SplashView;
