/* eslint-disable no-param-reassign */
/* eslint-disable one-var */
/* eslint-disable no-underscore-dangle */
/* eslint-disable no-unused-vars */
/* eslint-disable import/extensions */
/* eslint-disable import/first */
/**
 * SSAI and CSAI Ads plugin for Video.JS
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org> for One Studio
 */

import videojs from 'video.js';
import 'videojs-contrib-ads';

const Plugin = videojs.getPlugin('plugin');

import AdsUI from './ui/AdsUI';
import './ui/AdSkipButton.js';

import AdsManagerFactory from './AdsManagerFactory';

export default class OneStudioSSAIAdsPlugin extends Plugin {
  constructor(player, options) {
    super(player, options);

    const defaults = {
      skipad: 'Skip Ad',
      skippable: false,
      skipDelay: 5,
      adURLDelay: 5,
      seekEnabled: false,
      controlsEnabled: false,
      wrapperLimit: 10,
      withCredentials: true,
      midrollInterval: 7,
      midrollSeek: false,
      playMidroll: true,
      playPreroll: true,
      playPostroll: false,
      stitchedAds: true,
      adMarkers: false,
      adSlotPrerollDuration: 150,
      adSlotMidrollDuration: 150,
      type: 'vast',
      // type: "ssai"
    };

    const config = videojs.mergeOptions(defaults, options);

    player.adsConfig = config;

    this.adsManager = AdsManagerFactory.getAdsManager(config, player);

    // generate ad cue markers
    if (config.adMarkers)
      this.adsManager.on('adcues', (e, cues) => this.setAdCueMarkers(cues));

    this.adsManager.init();

    this.setupAdsUI(config);

    // player.ads(config);
  }

  /**
   * Setup the ads ui components
   * @param {*} config
   */
  setupAdsUI(config) {
    const adsUI = this.player.addChild('AdsUI');

    if (config.skippable) {
      const skipButton = adsUI.addChild('adSkipButton');
      skipButton.skipDelay = config.skipDelay;
    }
  }

  /**
   * Generate ad cue markers
   * @param {*} cues
   */
  setAdCueMarkers(cues) {
    const controls = this.player.getChild('ControlBar'),
      seekBar = controls.getChild('progressControl').getChild('seekBar'),
      seekBarEl = seekBar.el_,
      seekBarElWidth = parseFloat(getComputedStyle(seekBarEl).width),
      mouseTimeDisplay = seekBar.getChild('mouseTimeDisplay');

    let timeTooltip;

    if (mouseTimeDisplay) {
      timeTooltip = mouseTimeDisplay.getChild('timeTooltip');
      timeTooltip.el_.style.width = 'max-content';
    }

    const els = seekBarEl.querySelector('.vjs-ads-cue');

    if (els && els.length) {
      els.forEach((el) => {
        el.parentNode.removeChild(el);
      });
    }

    cues.forEach((cue) => {
      const marker = document.createElement('div');
      marker.setAttribute('role', 'button');
      marker.style.left = `${((cue.startTime / this.player.duration()) * 100).toString()}%`;
      marker.style.width = '0.5em';
      marker.style.height = '100%';
      marker.style.backgroundColor = '#CCCCCC';
      marker.style.position = 'absolute';
      marker.style.zIndex = 100;
      marker.className = 'vjs-ads-cue';

      // console.log(marker.style.left);

      marker.addEventListener('click', (e) => {
        this.player.currentTime(cue.startTime - 0.5);
      });

      seekBarEl.appendChild(marker);
    });
  }
}

// videojs.registerPlugin('onestudioads', OneStudioSSAIAdsPlugin);
