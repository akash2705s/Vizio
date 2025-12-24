/* eslint-disable no-underscore-dangle */
/* eslint-disable no-undef */
/* eslint-disable camelcase */
/* eslint-disable no-unused-vars */
import React, {
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
} from 'react';
import PropTypes from 'prop-types';
import videojs from 'video.js';
import OneStudioSSAIAdsPlugin from '../../onestudio-ssai-ads/src/onestudio-ads';
import play from '../../assets/images/play.png';
import playActive from '../../assets/images/play-active.png';
import pause from '../../assets/images/pause.png';
import pauseActive from '../../assets/images/pause-active.png';
import forward from '../../assets/images/forward.png';
import forwardActive from '../../assets/images/forward-active.png';
import rewind from '../../assets/images/rewind.png';
import rewindActive from '../../assets/images/rewind-active.png';
import closedCaptionIcon from '../../assets/images/icons/caption_icon.png';
import closedCaptionIconActive from '../../assets/images/icons/caption_icon-active.png';
import captionClose from '../../assets/images/icons/captionClose.png';
import captionCloseActive from '../../assets/images/icons/captionCloseActive.png';
import backImg from '../../assets/images/back.png';
import backImgActive from '../../assets/images/back-active.png';
import { setUserVideoProgress } from '../../utils/local-cache.util';
import getIp from '../../services/ip.service';
import 'video.js/dist/video-js.css';
import '../../onestudio-ssai-ads/onestudioadsplayer/css/onestudio-ads.css';
import { VizioInfoContext } from '../../context/VizioInfoContext';
import voiceSpeak from '../../utils/accessibility.util';
// import { getVastUrl, getVideoDetail } from '../../services/channelData.service';
import NavigateBack from './navigate-back.component';
import PlayerLayout from '../../layout/player.layout';
import Loader from './loader.component';

const Player = ({ id, videoData, resumeFrom, handlePlayerClose, isDeepLink = false }) => {
  const videoPlayerContainer = useRef();
  const playerIns = useRef();
  const timeoutRef = useRef();
  const playerStart = useRef(false);
  const currentTime = useRef(0);
  const {
    getDeviceHeight,
    getDeviceWidth,
    getUUID,
    getUserAgent,
    ifa,
    deviceId,
    ifaType,
    isCCEnabled,
    lmt,
  } = useContext(VizioInfoContext);

  const playerObj = {
    played: false,
    videoUrl: '',
    vastUrl: '',
    vastCallType: 'Direct', // or 'APS'
    ip: '',
  };

  const speeds = [10, 20, 30, 60, 120];
  const isLive = false;
  const appStoreUrl = process.env.REACT_APP_VIZIO_APPSTORE_URL;
  const appName = process.env.REACT_APP_VIZIO_APP_NAME;
  const appBundleId = process.env.REACT_APP_VIZIO_APP_BUNDLE;
  const appChannelName = process.env.REACT_APP_VIZIO_CHANNEL_NAME;
  const contentSeries = '';
  const videoId = videoData.id || videoData._id;
  const { title, season, episode, channelId, duration } = videoData;
  let { rating } = videoData;
  const genres = videoData.genres || 'tvmovies';
  const liveStream = '';
  const producerName = '';
  const randomCB = Math.floor(Math.random() * 90000) + 10000;
  const isLmtEnabled = lmt === 1;
  const bufferTimeoutRef = useRef(null);
  const playerCurrentTime = useRef(null);
  const captionObserver = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [caption, setCaptions] = useState(null);
  const [selectedCap, setSelectedCap] = useState('');
  const [loader, setLoader] = useState(true);
  const [isBuffer, setIsBuffer] = useState(false);
  const [adPlay, setAdPlay] = useState(false);
  const [localCCEnabled, setLocalCCEnabled] = useState(isCCEnabled);
  const isProgrammaticChange = useRef(false);
  const playerConfig = useRef({
    speed: 10,
    rewindSpeedInterval: null,
    rewindInterval: null,
    isHold: false,
    speedIndex: 0,
    progressTime: null,
  });
  const videoTimer = useRef({
    // timer: null,
    started: false,
  });

  const timeFormat = (seconds) => {
    let secs = seconds;

    if (!secs && secs <= 0) {
      return '00:00:00';
    }

    let hours = null;
    if (secs / 3600 > 0) {
      hours = Math.floor(secs / 3600);
      secs -= hours * 3600;
    } else {
      hours = 0;
    }

    let mins = null;
    if (secs / 60 > 0) {
      mins = Math.floor(secs / 60);
      secs -= mins * 60;
    } else {
      mins = 0;
    }

    secs = Math.floor(secs);

    const hoursString = hours >= 10 ? String(hours) : `0${String(hours)}`;
    const minsString = mins >= 10 ? String(mins) : `0${String(mins)}`;
    const remainderString = secs >= 10 ? String(secs) : `0${String(secs)}`;

    return `${hoursString}:${minsString}:${remainderString}`;
  };

  const getUsPrivacy = () => (isLmtEnabled ? '1YYN' : '1YNN');

  // const generateNonPersistentID = () =>
  //   `nonPersistentID_${Math.random().toString(36).substr(2, 9)}`;

  const updateProgressBar = (current, total) =>
    (Math.floor(current) / Math.floor(total)) * 100;

  // const initMediaMelon = () => {
  //   const mmvjs7Plugin = new window.VideoJSMMSSIntgr();
  //   if (mmvjs7Plugin.getRegistrationStatus() === false) {
  //     mmvjs7Plugin.registerMMSmartStreaming('OTT Studio', '165163458');
  //     mmvjs7Plugin.reportPlayerInfo(
  //       '$PlayerBrand',
  //       '$PlayerModel',
  //       '$PlayerVersion'
  //     );
  //     mmvjs7Plugin.reportPlayerInfo('videojs-vhs', 'vhs', '7');
  //     mmvjs7Plugin.reportAppInfo('FreeMoviesPlus', '1.1.0');
  //     mmvjs7Plugin.setDeviceInfo('Fire TV');
  //   }

  //   const mmVideoAssetInfo = {
  //     assetName: title,
  //     assetId: channelId,
  //     videoId,
  //     contentType: isLive,
  //     genre: genres,
  //     title,
  //     drmProtection: 'none',
  //     episodeNumber: episode,
  //     season,
  //     seriesTitle: contentSeries,
  //     videoType: isLive ? 'LIVE' : 'VOD',
  //   };

  //   mmvjs7Plugin.initialize(
  //     playerIns.current,
  //     playerObj.videoUrl,
  //     mmVideoAssetInfo,
  //     null
  //   );
  // };

  const handlePlayerControlDisplay = (showHide = '') => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }

    if (showHide === '') {
      if (window.document.getElementById('player-overlay')) {
        window.document.getElementById('player-overlay').style.display =
          'block';
      }
      timeoutRef.current = setTimeout(() => {
        if (window.document.getElementById('player-overlay')) {
          window.document.getElementById('player-overlay').style.display =
            'none';
        }
        if (window.document.getElementById('caption-container')) {
          window.document
            .getElementById('caption-container')
            .classList.remove('show');
          window.document
            .getElementById('caption-container')
            .classList.add('hide');
        }
      }, 7000);
    } else if (window.document.getElementById('player-overlay')) {
      window.document.getElementById('player-overlay').style.display = showHide;
    }
  };

  const handleUpdateProgressBar = (updatedTime) => {
    const totalTime = Number(Math.floor(playerIns.current.duration()));
    let currentDuration = 0;
    let totalDuration = 0;
    const playerProgressBarWidth =
      window.document.getElementById('player-progress');
    playerProgressBarWidth.style.width = `${updateProgressBar(
      updatedTime,
      playerIns.current.duration()
    )}%`;

    if (Math.floor(playerIns.current.duration()) > 3600) {
      currentDuration = timeFormat(updatedTime);
      totalDuration = timeFormat(totalTime);
    } else {
      currentDuration = timeFormat(updatedTime, 'minutes');
      totalDuration = timeFormat(totalTime, 'minutes');
    }
    if (currentDuration === '') currentDuration = '00:00:00';
    window.document.getElementById('current-time').innerText = currentDuration;
    window.document.getElementById('total-time').innerText = totalDuration;
  };

  const handleProgressClick = (e) => {
    if (videoTimer.current.started) handlePlayerControlDisplay();
    const { left, right } = window.document
      .querySelector('.player-progress-track')
      .getBoundingClientRect();
    if (e.pageX >= left && e.pageX <= right) {
      const distance = right - left;
      const updatedDistance = e.pageX - left;
      const progress =
        (updatedDistance * playerIns.current.duration()) / distance;
      handleUpdateProgressBar(progress);
      playerConfig.current.progressTime = null;
      playerCurrentTime.current = progress;
      playerIns.current.currentTime(progress);
    }
  };

  const keyUpHandler = () => {
    clearInterval(playerConfig.current.rewindSpeedInterval);
    clearInterval(playerConfig.current.rewindInterval);
    playerConfig.current.isHold = false;
    playerConfig.current.speed = 10;
    playerConfig.current.speedIndex = 0;

    if (videoTimer.current.started) handlePlayerControlDisplay();

    if (playerConfig.current.progressTime !== null) {
      playerCurrentTime.current = playerConfig.current.progressTime;

      playerIns.current.currentTime(
        Math.floor(playerConfig.current.progressTime)
      );
    }
    document.removeEventListener('keyup', keyUpHandler);
  };

  const setRewindSpeed = () => {
    clearInterval(playerConfig.current.rewindSpeedInterval);
    playerConfig.current.rewindSpeedInterval = setInterval(() => {
      playerConfig.current.speedIndex += 1;
      if (playerConfig.current.speedIndex > speeds.length - 1)
        playerConfig.current.speedIndex = speeds.length - 1;
      if (playerConfig.current.speed <= speeds[speeds.length - 1]) {
        playerConfig.current.speed = speeds[playerConfig.current.speedIndex];
      } else {
        clearInterval(playerConfig.current.rewindSpeedInterval);
      }
    }, 1200);
  };
  const moveForward = () => {
    if (!playerConfig.current.isHold) {
      clearInterval(playerConfig.current.rewindInterval);
      playerConfig.current.isHold = true;
      setRewindSpeed();

      const interval = 50;
      playerIns.current.pause();
      playerConfig.current.rewindInterval = setInterval(() => {
        if (playerConfig.current.progressTime === null) {
          playerConfig.current.progressTime = playerCurrentTime.current;
        }
        playerConfig.current.progressTime += playerConfig.current.speed;
        if (playerConfig.current.progressTime > playerIns.current.duration()) {
          playerConfig.current.progressTime = playerIns.current.duration();
        }
        if (playerConfig.current.progressTime !== null) {
          handleUpdateProgressBar(playerConfig.current.progressTime);
        }
      }, interval);

      document.addEventListener('keyup', keyUpHandler);
    }
  };
  const moveBackward = () => {
    if (!playerConfig.current.isHold) {
      clearInterval(playerConfig.current.rewindInterval);
      playerConfig.current.isHold = true;
      setRewindSpeed();

      const interval = 50;
      playerIns.current.pause();
      playerConfig.current.rewindInterval = setInterval(() => {
        if (playerConfig.current.progressTime === null)
          playerConfig.current.progressTime = playerCurrentTime.current;
        playerConfig.current.progressTime -= playerConfig.current.speed;
        if (playerConfig.current.progressTime <= 0) {
          playerConfig.current.progressTime = 0;
        }
        if (playerConfig.current.progressTime !== null) {
          handleUpdateProgressBar(playerConfig.current.progressTime);
        }
      }, interval);

      document.addEventListener('keyup', keyUpHandler);
    }
  };

  const handlePlayerPlayPause = useCallback(() => {
    if (playerIns.current.paused()) {
      playerIns.current.play().catch(() => { });

      if (videoTimer.current.started === false) {
        videoTimer.current.started = true;
      }
    } else {
      playerIns.current.pause();
      if (videoTimer.current.started === true) {
        videoTimer.current.started = false;
      }
    }
  }, []);

  const handlePlayerBack = useCallback(() => {
    if (videoData?.id) {
      setUserVideoProgress(
        videoData.id || videoData._id,
        Number(playerCurrentTime.current)
      );
    }
    handlePlayerClose();
  }, []);

  const forceCaptionOverride = useCallback(() => {
    if (!caption || caption.length === 0) return;

    const cues = document.querySelectorAll('.vjs-text-track-cue');
    if (!cues || cues.length === 0) return;

    cues.forEach((cue) => {
      cue.style.setProperty('width', '100%', 'important');
      cue.style.setProperty('text-align', 'center', 'important');
      cue.style.setProperty('bottom', '20px', 'important');
      cue.style.setProperty('top', 'auto', 'important');
      cue.style.setProperty('inset', 'auto 0 20px 0', 'important');
      // cue.style.setProperty('height', 'auto', 'important');
    });
  }, [caption]);

  const changeCaption = (captionId, { skipFocus = false } = {}) => {
    const newCaption = caption;
    setSelectedCap(captionId);
    // eslint-disable-next-line no-return-assign
    newCaption.map((a, i) => (caption[i].mode = 'disabled'));
    const selectedTrack = newCaption.findIndex((c) => c.id === captionId);
    setLocalCCEnabled(selectedTrack > 0);
    if (selectedTrack > -1) {
      if (newCaption[selectedTrack].id) {
        newCaption[selectedTrack].mode = 'showing';
        playerIns.current.addRemoteTextTrack(newCaption[selectedTrack]);
      } else {
        const tt = playerIns.current.remoteTextTracks();
        for (let i = 0; i < tt.length; i += 1) {
          const track = tt[i];
          if (track.kind === 'subtitles' && track.mode === 'showing') {
            track.mode = 'disabled';
            playerIns.current.addRemoteTextTrack(track);
          }
        }
      }
    }
    if (adPlay) playerStart.current = true;

    if (skipFocus) return;
    const captionContainer = document.getElementById('caption-container');
    if (captionContainer) {
      captionContainer.classList.remove('show');
      captionContainer.classList.add('hide');
      document
        .getElementById(`caption-${selectedTrack}`)
        .classList.remove('focused');
      const captionBtn = document.getElementById('caption-btn');
      if (captionBtn && playerStart.current) {
        captionBtn.classList.add('focused');
      }
      playerStart.current = true;
      handlePlayerControlDisplay();
    }
  };

  const handleOnButtonFocus = (text) => {
    voiceSpeak(`${text} button`);
  }

  const setupPlayer = () => {
    try {
      if (playerIns.current) return;

      const onestudioPluginOptions = {
        type: 'vast',
        midrollInterval: 7,
        url: playerObj.vastUrl,
        debug: true,
        adMarkers: true,
      };
      // if (playerObj.vastCallType === 'APS') {
      //   delete onestudioPluginOptions.url;
      // } else {
      //   delete onestudioPluginOptions.apsURL;
      // }
      videojs.registerPlugin('onestudioads', OneStudioSSAIAdsPlugin);
      playerIns.current = videojs(videoPlayerContainer.current, {
        controls: true,
        autoplay: true,
        fluid: true,
        preload: true,
        controlBar: {
          pictureInPictureToggle: false,
        },
        html5: {
          vhs: {
            experimentalBufferBasedABR: true,
          },
        },
        plugins: {
          onestudioads: onestudioPluginOptions,
        },
        poster: videoData.poster,
        sources: [
          {
            type: 'application/x-mpegurl',
            src: playerObj.videoUrl,
          },
        ],
        tracks: [
          {
            src: videoData.vttUrl || videoData?.vtt_url,
            kind: 'subtitles',
            srclang: 'en',
            label: 'English',
          },
        ],
      });
      handleOnButtonFocus('Play');

      // initMediaMelon();

      playerIns.current.on('loadedmetadata', () => {
        const tracks = playerIns.current.remoteTextTracks();
        const subtitleTracks = [
          {
            id: '',
            kind: '',
            label: 'Off',
            language: '',
          },
        ];
        if (bufferTimeoutRef.current) {
          setIsBuffer(false);
          clearTimeout(bufferTimeoutRef.current);
          bufferTimeoutRef.current = null;
        }
        // setLoader(false);
        for (let i = 0; i < tracks.length; i += 1) {
          const track = tracks[i];
          if (track.kind === 'subtitles') {
            const tmp = {
              id: track.id,
              kind: track.kind,
              label: track.label,
              language: track.language,
              mode: track.mode,
              src: track.src,
            };
            subtitleTracks.push(tmp);
          }
        }

        setCaptions(subtitleTracks);
      });

      playerIns.current.on('adstart', (ad) => {
        setAdPlay(true);
        handlePlayerControlDisplay('none');
      });
      playerIns.current.on('ads-ad-ended', () => {
        setAdPlay(false);
        handlePlayerControlDisplay();
      });
      playerIns.current.on('adscanceled', () => {
        setAdPlay(false);
        handlePlayerControlDisplay();
      });

      playerIns.current.on('play', () => {
        setIsBuffer(false);
        setLoader(false);
        if (bufferTimeoutRef.current) {
          // setIsBuffer(false);
          clearTimeout(bufferTimeoutRef.current);
          bufferTimeoutRef.current = null;
        }
        if (videoTimer.current.started === false) {
          videoTimer.current.started = true;
        }
        handlePlayerControlDisplay();
        setIsPlaying(false);
        if (resumeFrom > 0 && !playerObj.played) {
          playerObj.played = true;
          playerIns.current.currentTime(resumeFrom);
        }
      });

      playerIns.current.on('timeupdate', () => {
        const watchTime = Number(Math.floor(playerIns.current.currentTime()));
        if (watchTime === 0) return;
        if (loader) setLoader(false);
        if (isBuffer) setIsBuffer(false);

        // Update ProgressBar
        if (watchTime !== currentTime.current) {
          currentTime.current = watchTime;
          handleUpdateProgressBar(watchTime);
          if (bufferTimeoutRef.current) {
            setIsBuffer(false);
            setLoader(false);
            clearTimeout(bufferTimeoutRef.current);
            bufferTimeoutRef.current = null;
          }
          playerCurrentTime.current = currentTime.current;
        }
        if (!playerConfig.current.isHold) {
          playerCurrentTime.current = watchTime;
          handleUpdateProgressBar(watchTime);
        }
      });

      playerIns.current.on('pause', () => {
        setIsPlaying(true);
        const watchTime = Math.floor(playerIns.current.currentTime());
        if (watchTime === 0) return;

        // setUserVideoProgress(videoData.id, Number(watchTime));
        handlePlayerControlDisplay('block');
      });

      playerIns.current.on('waiting', (e) => {
        setIsBuffer(true);
        setLoader(true);
        handlePlayerControlDisplay('block');
        if (bufferTimeoutRef.current) {
          clearTimeout(bufferTimeoutRef.current);
          bufferTimeoutRef.current = null;
        }
        bufferTimeoutRef.current = setTimeout(() => {
          setIsBuffer(false);
          setLoader(false);
        }, 1500);
        // bufferTimeoutRef.current = setTimeout(() => {
        //   showToastMessage(lang.video_playback_not_found, 'error');
        //   setIsBuffer(false);
        //   setTimeout(() => {
        //     handlePlayerClose();
        //   }, 3000);
        // }, 120000);
      });

      playerIns.current.on('seeked', () => {
        handlePlayerControlDisplay();
      });

      playerIns.current.on('ended', () => {
        setIsPlaying(false);
        videoTimer.current.started = false;
        handlePlayerBack();
      });

      playerIns.current.on('keyPressShowControls', () => {
        handlePlayerControlDisplay();
      });

      // Set total duration
      if (videoData.duration) {
        const totalDuration = timeFormat(Math.floor(videoData.duration));
        window.document.getElementById('total-time').innerText = totalDuration;
      }

    } catch (e) {
      // ignore
    }
  };

  const hideIP = (ip) => {
    if (!ip) {
      return ip;
    }
    const ipParts = ip.split('.');
    return `${ipParts[0]}.${ipParts[1]}.xxx.xxx`;
  };

  const prepareVizioVast = () => {
    const APP_BUNDLE = 'vizio.actionplus';
    const APP_NAME = 'Action_Plus';
    const CHANNEL_ID = '26996';

    /// Ads
    // Need to check for lmt
    // const lmt = isLmtEnabled ? getUUID() : ifa;
    const lmt1 = isLmtEnabled ? getUUID() : ifa;

    const videodetails = videoData;

    /// url params
    // const urlParams = new URLSearchParams(window.location.search);
    // const hls_url = urlParams.get('hls_url');
    // let isDeepLink = false;
    // if (hls_url) {
    //   videodetails = {
    //     hls_url,
    //   };
    //   isDeepLink = true;
    // }

    const ipAddress = playerObj.ip;

    const agent = navigator.userAgent.replace(/ /g, '');

    let content_genre = 'tvmovies';
    let content_livestream = '';
    let content_producer_name = '';

    // const appStoreUrl = "https://www.amazon.com/OTT-Studio-Free-Movies-Plus/dp/B08JPDLL1Z";

    if (videodetails.genre) {
      content_genre = videodetails.genre;
    }

    // if (videodetails.streamUrl) {
    //   isLive = true;
    // }

    content_livestream = isLive ? 1 : 0;

    if (videodetails.producer_name) {
      content_producer_name = videodetails.producer_name;
    }

    if (videodetails.rating) {
      rating = videodetails.rating;
    } else rating = undefined;

    // var hls = new Hls();
    // TODO : Need to check and enable if required.
    /*
    let videoURL = videoData.hlsUrl;
    console.log("videoURL ",videoURL);
    if (!isLive) {
      let sepr = "&"
      if (videoURL.indexOf("?") < 0) {
        sepr = "?"
      }

      videoURL += sepr + "deviceId=" + deviceId + "&us_privacy=" + getUsPrivacy() + "&ic=IAB1-5&content_title=" + encodeURIComponent(videodetails.title) + "&content_id=" + videodetails._id + "&content_series=" + encodeURIComponent(contentSeries) + "&content_season=" + encodeURIComponent(videodetails.season) + "&content_genre=" + encodeURIComponent(content_genre) + "&content_livestream=" + encodeURIComponent(content_livestream) + "&content_producer_name=" + (content_producer_name) + "&rating=" + encodeURIComponent(rating) + "&user-agent=" + encodeURIComponent(agent);
    } else {
      videoURL = videoURL.replace("[DEVICE-ID]", deviceId);
      videoURL = videoURL.replace("[DNT]", 1);
      videoURL = videoURL.replace("[US-PRIVACY]", getUsPrivacy());
      videoURL = videoURL.replace("[GDPR]", "0");
      videoURL = videoURL.replace("[CONSENT]", "");
      videoURL = videoURL.replace("[APP-NAME]", "");
      videoURL = videoURL.replace("[APP-BUNDLE]", "");
      videoURL = videoURL.replace("[APP-STORE-URL]", encodeURIComponent(appStoreUrl));
      videoURL = videoURL.replace("[DEVICE-ID-TYPE]", 3);
      videoURL = videoURL.replace("[DEVICE-MAKER]", "Vizio");
      videoURL = videoURL.replace("[DEVICE-MODEL]", "Vizio");
      videoURL = videoURL.replace("[CONTENT_LIVESTREAM]", content_livestream);
      videoURL = videoURL.replace("[CONTENT_PRODUCER_NAME]", content_producer_name);
      if (rating) videoURL = videoURL.replace("[RATING]", encodeURIComponent(rating));
    }
    // const config = {
    //   controls: false,
    //   "autoplay": false,
    //   "controlBar": {
    //     "pictureInPictureToggle": false
    //   },
    //   html5: {
    //     vhs: {
    //       experimentalBufferBasedABR: true
    //     }
    //   },
    //   aspectRatio: "16:9",
    //   "poster": videodetails.poster,
    //   sources: [
    //     { type: "application/x-mpegURL", src: videoURL }
    //   ]
    // };
*/
    if (!isLive) {
      // if (videodetails.vtt_url) {
      //   config.tracks = [
      //     { src: videodetails.vtt_url, kind: 'subtitles', srclang: 'en', label: 'English' }
      //   ]
      // }

      let vastURL = process.env.REACT_APP_VIZIO_VAST_URL;

      //   'https://tv.ads.vizio.com/rt/27047?w=1920&h=1080&cb={{CACHEBUSTER}}&ip={{IP}}&ua={{USER_AGENT}}&pod_max_dur=150&app_bundle=vizio.vhsplus&app_name=VHS_Plus&app_store_url=https://www.vizio.com/en/smart-tv-apps?appName=vhs+&appId=vizio.vhs+&did={{DEVICE_ID}}&us_privacy=1---&schain=1&DNT=0&ifa_type={{IFA_TYPE}}&lmt=0&gdpr={{GDPR}}&gdpr_consent={{CONSENT}}&content_genre={{CONTENT_GENRE}}&rating={{RATING}}&coppa=0&language=en&content_livestream=0&content_title={{CONTENT_TITLE}}';
      vastURL = vastURL.replace('{{APP_STORE_URL}}');
      vastURL = vastURL.replace('{{CHANNEL_ID}}', CHANNEL_ID);
      vastURL = vastURL.replace('{{CACHEBUSTER}}', randomCB);
      vastURL = vastURL.replace('{{IP}}', encodeURIComponent(ipAddress));
      vastURL = vastURL.replace(
        '{{USER_AGENT}}',
        encodeURIComponent(navigator.userAgent)
      );
      vastURL = vastURL.replace('{{DEVICE_ID}}', ifa);
      vastURL = vastURL.replace('{{LMT}}', lmt);
      vastURL = vastURL.replace('{{US_PRIVACY}}', getUsPrivacy());
      vastURL = vastURL.replace('{{IFA_TYPE}}', ifaType);
      vastURL = vastURL.replace('{{RATING}}', rating);
      vastURL = vastURL.replace('{{APP_BUNDLE}}', APP_BUNDLE);
      vastURL = vastURL.replace('{{APP_NAME}}', APP_NAME);
      vastURL = vastURL.replace('{{POD_MAX_DURATION}}', 120);
      vastURL = vastURL.replace(
        '{{CONTENT_GENRE}}',
        encodeURIComponent(content_genre)
      );
      vastURL = vastURL.replace('{{CONTENT_LIVESTREAM}}', content_livestream);
      vastURL = vastURL.replace(
        '{{CONTENT_TITLE}}',
        encodeURIComponent(videodetails.title)
      );
      vastURL = vastURL.replace('{{GDPR}}', '0');
      vastURL = vastURL.replace('{{CONSENT}}', '');

      // config.plugins = {
      //   "onestudioads": {
      //     type: "vast",
      //     midrollInterval: 7,
      //     url: vastURL
      //   }
      // };
      playerObj.vastUrl = vastURL;
    }
  };

  // const prepareVast = () => {
  //   let vastParams = process.env.REACT_APP_VAST_PARAMS;
  //   vastParams = vastParams.replace('{content_type}', '');
  //   vastParams = vastParams.replace('{slot_type}', '');
  //   vastParams = vastParams.replace(
  //     '{device_ifa}',
  //     encodeURIComponent(isLmtEnabled ? getUUID() : ifa)
  //   );
  //   vastParams = vastParams.replace('{ua}', encodeURIComponent(getUserAgent()));
  //   vastParams = vastParams.replace('{video_id}', videoId);
  //   vastParams = vastParams.replace(
  //     '{content_genre}',
  //     encodeURIComponent(genres)
  //   );
  //   vastParams = vastParams.replace(
  //     '{video_rating}',
  //     encodeURIComponent(rating)
  //   );
  //   vastParams = vastParams.replace('{content_duration}', duration);
  //   vastParams = vastParams.replace('{us_privacy}', '');
  //   vastParams = vastParams.replace('{device_height}', getDeviceHeight());
  //   vastParams = vastParams.replace('{device_width}', getDeviceWidth());
  //   vastParams = vastParams.replace('{player_height}', getDeviceHeight());
  //   vastParams = vastParams.replace('{player_width}', getDeviceWidth());
  //   vastParams = vastParams.replace('{dnt}', '');
  //   vastParams = vastParams.replace('{language}', 'en');
  //   vastParams = vastParams.replace('{connection_type}', '');
  //   vastParams = vastParams.replace('{category}', '');
  //   vastParams = vastParams.replace('{cb}', randomCB);
  //   vastParams = vastParams.replace('{content_episode}', episode);
  //   vastParams = vastParams.replace('{media_title}', encodeURIComponent(title));
  //   vastParams = vastParams.replace(
  //     '{series_title}',
  //     encodeURIComponent(contentSeries)
  //   );
  //   vastParams = vastParams.replace('{content_season}', season);
  //   vastParams += `&app_bundle=${appBundleId}`;
  //   vastParams += `&app_name=${encodeURIComponent(appChannelName)}`;
  //   vastParams += `&app_store_url=${encodeURIComponent(appStoreUrl)}`;

  //   playerObj.videoUrl = videoData.hlsUrl;
  //   playerObj.vastUrl = `${process.env.REACT_APP_VAST_BASE_URL}?${vastParams}`;
  // };

  // const prepareDirectVast = () => {
  //   let vastURL = process.env.REACT_APP_DIRECT_VAST_URL;
  //   vastURL += '?w=1920&h=1080';
  //   vastURL += `&cb=${randomCB}`;
  //   vastURL += `&ip=${encodeURIComponent(playerObj.ip)}`;
  //   vastURL += `&ua=${encodeURIComponent(getUserAgent())}`;
  //   vastURL += '&pod_max_dur=150';
  //   vastURL += `&app_bundle=${appBundleId}`;
  //   vastURL += `&app_name=${encodeURIComponent(appName)}`;
  //   vastURL += `&app_store_url=${encodeURIComponent(appStoreUrl)}`;
  //   vastURL += `&content_id=${videoId}`;
  //   vastURL += `&content_episode=${episode}`;
  //   vastURL += `&content_title=${encodeURIComponent(title)}`;
  //   vastURL += `&content_series=${encodeURIComponent(contentSeries)}`;
  //   vastURL += `&content_season=${season}`;
  //   vastURL += `&content_genre=${encodeURIComponent(genres)}`;
  //   vastURL += `&content_livestream=${encodeURIComponent(liveStream)}`;
  //   vastURL += `&content_producer_name=${encodeURIComponent(producerName)}`;
  //   vastURL += `&rating=${encodeURIComponent(rating)}`;
  //   vastURL += `&channel_name=${encodeURIComponent(appChannelName)}`;
  //   vastURL += '&language=en&network_name=';
  //   vastURL += `&did=${encodeURIComponent(getUUID())}`;
  //   vastURL += '&gdpr=0&us_privacy=1---&schain=&lmt=&ic=IAB1-5&max_dur=150';

  //   playerObj.videoUrl = videoData.hlsUrl;
  //   playerObj.vastUrl = vastURL;
  // };

  const initPlayer = () => {
    getIp()
      .then((ip) => {
        playerObj.ip = isLmtEnabled ? hideIP(ip) : encodeURIComponent(ip);
      })
      .finally(() => {
        prepareVizioVast();
        setupPlayer();
        // getVastUrl().then((vastUrl) => {
        //   if (vastUrl) {
        //     let vastUrlUpdated = vastUrl.replace('{cb}', randomCB);
        //     vastUrlUpdated = vastUrlUpdated.replace('{content_genre}', encodeURIComponent(genres));
        //     vastUrlUpdated = vastUrlUpdated.replace('{content_livestream}', encodeURIComponent(liveStream));
        //     vastUrlUpdated = vastUrlUpdated.replace('{dur}', duration);
        //     vastUrlUpdated = vastUrlUpdated.replace('{ifa_type}', ifaType);
        //     vastUrlUpdated = vastUrlUpdated.replace('{ip}', encodeURIComponent(playerObj.ip));
        //     vastUrlUpdated = vastUrlUpdated.replace('{lmt}', lmt);
        //     vastUrlUpdated = vastUrlUpdated.replace('{rating}', encodeURIComponent(rating));
        //     vastUrlUpdated = vastUrlUpdated.replace('{tv_ad_id}', isLmtEnabled ? generateNonPersistentID() : ifa);
        //     vastUrlUpdated = vastUrlUpdated.replace('{ua}', encodeURIComponent(getUserAgent()));
        //     vastUrlUpdated = vastUrlUpdated.replace('{us_privacy}', getUsPrivacy());
        //     vastUrlUpdated = vastUrlUpdated.replace('{pod_max_dur}', '180');
        //     playerObj.vastUrl = vastUrlUpdated;
        //     setupPlayer();
        //   }

        // });
      });
  };

  useEffect(() => {
    if (videoData.hlsUrl || videoData.hls_url) {
      playerObj.videoUrl = videoData.hlsUrl || videoData.hls_url;
      initPlayer();
    } else if (isDeepLink) {
      playerObj.videoUrl = videoData
      initPlayer();
    }
    else {
      getVideoDetail(videoId).then((response) => {
        playerObj.videoUrl = response.hlsUrl;
        initPlayer();
      });
    }

    return () => {
      if (playerIns.current) {
        setTimeout(() => {
          playerIns.current.dispose();
        }, 2000);
      }
    };
  }, []);

  const openCaptionDialog = () => {
    handlePlayerControlDisplay('block');
    document.getElementById('caption-container').classList.remove('hide');
    document.getElementById('caption-container').classList.add('show');
    document.getElementById('caption-btn').classList.remove('focused');
    document.getElementById('caption-0').classList.add('focused');
  };

  useEffect(() => {
    setLocalCCEnabled(isCCEnabled);
    isProgrammaticChange.current = true;
  }, [isCCEnabled]);

  useEffect(() => {
    if (caption && caption.length > 0) {
      const captionIndex = localCCEnabled && caption.length > 1 ? 1 : 0;
      changeCaption(caption[captionIndex].id, {
        skipFocus: isProgrammaticChange.current,
      });
      isProgrammaticChange.current = false;
    }
  }, [localCCEnabled, caption]);

  useEffect(() => {
    if (!caption || caption.length === 0) {
      // If captions become OFF, disconnect observer
      captionObserver.current?.disconnect();
      captionObserver.current = null;
      return;
    }
    if (captionObserver.current) return;

    captionObserver.current = new MutationObserver(() => {
      if (caption && caption.length > 0) {
        forceCaptionOverride();
      }
    });
    captionObserver.current.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // eslint-disable-next-line consistent-return
    return () => {
      captionObserver.current?.disconnect();
      captionObserver.current = null;
    };
  }, [caption]);

  return (
    <PlayerLayout>
      <div className="video-container view user-active" id="video-container">
        <button
          id="show-controlbar"
          type="button"
          className="control-btn hide"
          onClick={() =>
            videoTimer.current.started && handlePlayerControlDisplay()
          }
        >
          Show Control Bar
        </button>
        <NavigateBack onBack={handlePlayerBack} />
        <div id="video-player">
          <video
            id={id}
            className="video-js vjs-default-skin vjs-big-play-centered"
            width="auto"
            height="auto"
            ref={videoPlayerContainer}
          />
        </div>
        {!adPlay && loader && (
          <div className="player-background">
            <Loader />
          </div>
        )}
        {!adPlay && isBuffer && (
          <div
            className="player-background"
            style={{ background: 'transparent' }}
          >
            <Loader />
          </div>
        )}
        {!adPlay && (
          <div
            className="player-overlay"
            id="player-overlay"
            style={{ display: 'none' }}
          >
            <div className="player-text">
              <div className="back" id="player-view-back">
                <div
                  role="none"
                  id="player-back-btn"
                  className="back-img prj-element"
                  data-focus-down="#player-progress-track"
                  data-focus-in="#player-back-btn-focus-in"
                  onClick={handlePlayerBack}
                >
                  <img src={backImg} alt="back" className="img" />
                  <img src={backImgActive} alt="back" className="img-active" />
                </div>
                <button
                  className="hide"
                  type="button"
                  id="player-back-btn-focus-in"
                  onClick={() => handleOnButtonFocus("Back")}
                >
                  Focus In
                </button>
              </div>
              <div>
                <div className="player-title">{title}</div>
              </div>
            </div>

            <div className="player-bottom-bar" id="player-bottom-bar">
              <div
                role="none"
                className="player-progress-track prj-element"
                id="player-progress-track"
                onClick={handleProgressClick}
                data-focus-up="#player-back-btn"
                data-focus-down="#play-pause"
                data-focus-in="#player-progress-track-focus-in"
              >
                <div id="player-progress" className="player-progress-bar" />
              </div>
              <button
                className="hide"
                type="button"
                id="player-progress-track-focus-in"
                onClick={() => handleOnButtonFocus("Progress bar")}
              >
                Focus In
              </button>
              <div className="player-timer">
                <div id="current-time" className="player-time">
                  00:00:00
                </div>
                /
                <div id="total-time" className="player-time">
                  00:00:00
                </div>
                <div className="player-button-group">
                  <div
                    className="rewind media-btn prj-element"
                    id="rewind"
                    data-focus-left=""
                    data-focus-right="#play-pause"
                    data-focus-up="#player-progress-track"
                    data-focus-down=""
                    onClick={moveBackward}
                    role="none"
                    data-focus-in="#rewind-focus-in"
                  >
                    <img src={rewind} alt="" className="img" />
                    <img
                      src={rewindActive}
                      alt="rewind"
                      className="img-active"
                    />
                  </div>
                  <div
                    className="playpause media-btn prj-element focused active"
                    id="play-pause"
                    data-focus-left="#rewind"
                    data-focus-right="#fast-forward"
                    data-focus-up="#player-progress-track"
                    data-focus-down=""
                    role="none"
                    onClick={handlePlayerPlayPause}
                    data-focus-in="#play-pause-focus-in"
                  >
                    {isPlaying ? (
                      <div className="play-pause-btn">
                        <img src={play} alt="" className="img " />
                        <img src={playActive} alt="" className="img-active" />
                      </div>
                    ) : (
                      <div className="play-pause-btn">
                        <img src={pause} alt="" className="img" />
                        <img src={pauseActive} alt="" className="img-active " />
                      </div>
                    )}
                  </div>
                  <div
                    className="fastforward media-btn prj-element"
                    id="fast-forward"
                    data-focus-left="#play-pause"
                    data-focus-right={
                      videoData.vttUrl || videoData?.vtt_url
                        ? '#caption-btn'
                        : ''
                    }
                    data-focus-up="#player-progress-track"
                    data-focus-down=""
                    onClick={moveForward}
                    role="none"
                    data-focus-in="#fast-forward-focus-in"
                  >
                    <img src={forward} alt="forward" className="img" />
                    <img
                      src={forwardActive}
                      alt="forward"
                      className="img-active"
                    />
                  </div>
                  <button
                    className="hide"
                    type="button"
                    id="rewind-focus-in"
                    onClick={() => handleOnButtonFocus("Rewind")}
                  >
                    Focus In
                  </button>
                  <button
                    className="hide"
                    type="button"
                    id="play-pause-focus-in"
                    onClick={() => handleOnButtonFocus(
                      isPlaying ? 'Play' : 'Pause'
                    )}
                  >
                    Focus In
                  </button>
                  <button
                    className="hide"
                    type="button"
                    id="fast-forward-focus-in"
                    onClick={() => handleOnButtonFocus("Fast forward")}
                  >
                    Focus In
                  </button>
                  <div>
                    <div
                      id="caption-container"
                      className="caption-container hide"
                    >
                      <div className="caption-section">
                        {caption &&
                          caption.length > 0 &&
                          caption.map((c, idx) => (
                            <>
                              <div
                                id={`caption-${idx}`}
                                key={`caption-${c.id}`}
                                data-focus-left="#fast-forward"
                                data-focus-right={false}
                                data-focus-up={
                                  idx === 0 ? false : `#caption-${idx - 1}`
                                }
                                data-focus-down={
                                  idx + 1 === caption.length
                                    ? false
                                    : `#caption-${idx + 1}`
                                }
                                className={
                                  c.id === selectedCap
                                    ? 'caption-item caption-item-selected prj-element'
                                    : 'caption-item prj-element'
                                }
                                onClick={() => changeCaption(c.id)}
                                tabIndex={-1}
                                role="none"
                              // data-focus-in={`#caption-${idx}-focus-in`}
                              // onFocus={handleOnButtonFocus(c.label)}
                              >
                                {c.label}
                              </div>
                              <button
                                className="hide"
                                type="button"
                                id={`caption-${idx}-focus-in`}
                              // onClick={() => handleOnButtonFocus(c.label)}
                              >
                                Focus In
                              </button>
                            </>
                          ))}
                      </div>
                    </div>
                    {(videoData.vttUrl || videoData?.vtt_url) && (
                      <div
                        className="fastforward media-btn prj-element closed-caption"
                        id="caption-btn"
                        data-focus-left="#fast-forward"
                        data-focus-right={false}
                        data-focus-up="#player-progress-track"
                        data-focus-down={false}
                        onClick={() => {
                          if (caption && caption.length > 0) {
                            openCaptionDialog();
                          }
                        }}
                        tabIndex={-1}
                        // data-focus-in="#caption-btn-focus-in"
                        role="none"

                      // onFocus={handleOnButtonFocus('Closed Caption button')}
                      >{localCCEnabled ? (
                        <>
                          <img
                            src={closedCaptionIcon}
                            aria-hidden
                            alt=""
                            className="media-btn-img"
                          />
                          <img
                            src={closedCaptionIconActive}
                            aria-hidden
                            alt=""
                            className="media-btn-img-active"
                          />
                        </>
                      ) : (
                        <>
                          <img
                            src={captionClose}
                            aria-hidden
                            alt=""
                            className="media-btn-img"
                          />
                          <img
                            src={captionCloseActive}
                            aria-hidden
                            alt=""
                            className="media-btn-img-active"
                          />
                        </>
                      )}
                        <button
                          className="hide"
                          type="button"
                          id="caption-btn-focus-in"
                        // onClick={() => handleOnButtonFocus('Closed Caption')}
                        >
                          Focus In
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </PlayerLayout >
  );
};

Player.propTypes = {
  id: PropTypes.string.isRequired,
  videoData: PropTypes.object.isRequired,
  resumeFrom: PropTypes.number.isRequired,
  handlePlayerClose: PropTypes.func.isRequired,
  isDeepLink: PropTypes.bool.isRequired,
};

export default Player;
