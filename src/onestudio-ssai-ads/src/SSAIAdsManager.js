/* eslint-disable no-useless-constructor */
/**
 * SSAI and CSAI Ads plugin for Video.JS
 * SSAI ads manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org> for One Studio
 */

import AdsManager from './AdsManager';

export default class SSAIAdsManager extends AdsManager {
  constructor(config, player) {
    super(config, player);
  }

  set adDuration(value) {
    this.player.adsConfig.adTagDuration = value;
  }

  init() {
    super.init();
  }

  /**
   * Get midroll cues from HLS
   */
  initMidrollCues() {
    this.player.on('loadedmetadata', () => {
      this.triggerAdsReady();
      this.setupMidrolls();
    });
  }

  /* initAdCueTrack() {
        const adCueTrack = this.adCueTrack = this.player.textTracks().tracks_.filter(track => track.label === 'ad-cues')[0];
        adCueTrack.addEventListener('cuechange', () => this.adCueChange());
        return adCueTrack;
    } */

  onContentChanged() {
    this.triggerAdsReady();
  }

  /**
   * Setup ad events
   */
  setupAdEvents() {
    super.setupAdEvents();

    const { player } = this;

    player.on('adended', () => {
      // player.ads.endLinearAdMode();
      player.trigger('ads-ad-ended');
    });
  }

  /**
   * Start ads mode on HLS cues
   * @param {*} activeCue
   */
  startOnAdCue(activeCue) {
    const { player } = this;
    this.adDuration =
      this.player.currentTime() + (activeCue.endTime - activeCue.startTime);

    player.trigger('addurationchange');
    player.ads.startLinearAdMode();
    player.trigger('ads-ad-started');
  }

  /**
   * Stop ads mode on cue exit
   */
  stopOnAdCue() {
    const { player } = this;
    // player.ads.endLinearAdMode();
    player.trigger('ads-ad-ended');
    player.trigger('adended');
  }
}
