/* eslint-disable jsx-a11y/media-has-caption */
import React, { useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import 'video.js/dist/video-js.css';
import { logger } from '../../utils/helper.util';

const BgPlayer = ({ id, source, setShowVideo }) => {
  // const playerObj = {
  //   id: null,
  //   played: false,
  // };

  const playerIns = useRef();

  useEffect(() => {
    playerIns.current = videojs(
      id,
      {
        controls: false,
        autoplay: true,
        fluid: true,
      },
      () => {
        if (source) {
          playerIns.current.src(source);
          playerIns.current.one('canplay', () => {
            playerIns.current.play().catch((err) => {
              logger.warn('Play error:', err);
            });
          });
        }
      }
    );
    playerIns.current.on('error', () => {
      setShowVideo(false);
    });
    return () => {
      playerIns.current.dispose();
    };
  }, []);

  return (
    <div className="video-container" id="video-container">
      <div id="bg-video-player">
        <video
          id={id}
          className="video-js vjs-default-skin"
          width="100%"
          height="100%"
        />
      </div>
    </div>
  );
};

BgPlayer.propTypes = {
  id: PropTypes.string.isRequired,
  source: PropTypes.string.isRequired,
  setShowVideo: PropTypes.func.isRequired,
};

export default BgPlayer;
