/* eslint-disable no-empty */
/* eslint-disable no-use-before-define */
/* eslint-disable no-underscore-dangle */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-sequences */
/* eslint-disable no-unused-expressions */
/* eslint-disable no-unused-vars */
/**
 * SSAI and CSAI Ads plugin for Video.JS
 * Ads base manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org> for One Studio
 */

import videojs from 'video.js';

import EventEmitter from './event/EventEmitter';

export default class AdsManager extends EventEmitter {
  constructor(config, player) {
    super();

    (this.config = config),
      (this.player = player),
      (this.state = {}),
      (this.originalPlayerState = {});
  }

  /**
   * init ads feature
   */
  init() {
    const { player } = this;

    player.ads(this.config);
    this.setupAdEvents();

    if (this.config.playMidroll) {
      this.initMidrollCues();
      // add seeking midroll limiter
      // if (!this.config.midrollSeek) this.setupMidrollLimiter();
    }
  }

  /**
   * Generate ad midroll cues on reloading content from a preroll
   */
  initMidrollCues() {
    this.player.on('loadstart', () => {
      // metadata from content reloading from a preroll
      if (this.config.playPreroll) {
        const onMetadata = () => {
          // fix a bug when still in ad mode
          if (
            this.player.ads.isInAdMode() &&
            !this.player.ads.isContentResuming()
          ) {
            // console.log("In Ads Break, reload meta")
            // massive bug. ads keep triggering metadata randomly. reload once more.
            this.player.one('contentloadedmetadata', onMetadata);
            return;
          }

          this.player.off('adscanceled', onNoPreroll);

          this.setupMidrolls();
        };

        const onNoPreroll = () => {
          onMetadata();
          this.onNoPreroll();
        };

        this.player.one('contentloadedmetadata', onMetadata);
        this.player.one('adscanceled', onNoPreroll);
      } else {
        this.player.one('loadedmetadata', () => this.setupMidrolls());
      }
    });
  }

  /**
   * Generate or get midroll cues
   * In CSAI cues are generated. In SSAI cues are obtained from the HLS
   * @returns
   */
  setupMidrolls() {
    try {
      this.player.adsConfig.contentDuration = this.player.duration();

      // console.log("process");

      // get or generate cues
      this.processCues();

      // process cues from metadata tracks
      this.player.ads.cueTextTracks.processMetadataTracks(
        this.player,
        (player, track) => {
          // console.log("track", track);

          if (track.label !== 'ad-cues') return;

          this.cueMap = new Map();
          this.adCueTrack = track;

          track.cues_.forEach((cue) => {
            this.cueMap.set(cue.startTime, { played: false });
          });

          this.emit('adcues', track.cues_);

          if (this.onCueChangeRef)
            track.removeEventListener('cuechange', this.onCueChangeRef);

          this.onCueChangeRef = (event) => this.adCueChange(track.activeCues);

          // display ads on cue change
          track.addEventListener('cuechange', this.onCueChangeRef);
        }
      );
    } catch (e) {}
  }

  processCues() {}

  triggerAdsReady() {
    this.player.trigger('adsready');
  }

  /*
    setupMidrollLimiter() {
        let seekingForward;
  
        const midrollMiddleware = (pl) => {
          return {
            currentTime: (ct) => {
              return ct;
            },
            setCurrentTime: (time) => {
              if (!this.cueMap.size) return time;
  
              seekingForward = time > pl.currentTime();
  
              const filteredCues = [...this.cueMap].filter(([key, value]) => seekingForward && key < time && !value.played);
  
              if (filteredCues.length) {
                  const adTime = filteredCues[filteredCues.length - 1][0];
  
                  this.cueMap.get(adTime).played = true;
  
                  time = adTime;
                  
              }
              return time;
            }
          };
        };
        
        videojs.use('*', midrollMiddleware);
    } */

  /**
   * Setup ad events
   */
  setupAdEvents() {
    const { player } = this;
    player.on('contentchanged', () => this.onContentChanged());
    player.on('adsready', () => this.onAdsReady());
    player.on('readyforpreroll', () => this.onReadyForPreroll());
    player.on('readyforpostroll', () => this.onReadyForPostroll());

    player.ready(() => {
      this.controlsEnabled = player.controls();
    });
    player.on('ads-ad-started', () => {
      try {
        player.controls(false);
        player.controlBar.progressControl.disable();
      } catch (e) {}
    });

    player.on('ads-ad-ended', () => {
      try {
        player.controls(this.controlsEnabled);
        player.toggleClass('vjs-ad-content-resuming', false);

        player.controlBar.progressControl.enable();
      } catch (e) {}
    });
  }

  onContentChanged() {}

  onAdsReady() {}

  onReadyForPreroll() {
    this.player.trigger('nopreroll');
  }

  onReadyForPostroll() {}

  /**
   * Show midroll ads on cue change
   * @param {*} activeCues
   */
  adCueChange(activeCues) {
    // console.log("CUE CHANGE", activeCues);
    // let activeCues = this.adCueTrack.activeCues;

    if (activeCues.length) {
      const activeCue = activeCues[activeCues.length - 1];
      const cues = [activeCue];

      // videojs.log('Cue runs from ' + activeCue.startTime +
      // ' to ' + activeCue.endTime);

      // Make an ad request
      const processCue = (player, cue, cueId, startTime) => {
        if (this.cueMap.get(startTime).played) {
          // console.log("Ad Played");
          return;
        }

        this.player.trigger('admidrollstart', activeCue);

        // start midroll ad
        this.startOnAdCue(activeCue);

        // set as played to not play again
        this.cueMap.get(startTime).played = true;
      };

      this.player.ads.cueTextTracks.processAdTrack(
        this.player,
        cues,
        processCue
      );
    } else {
      this.stopOnAdCue();
    }
  }
}
