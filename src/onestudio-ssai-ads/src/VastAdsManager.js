/* eslint-disable no-plusplus */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-undef */
/* eslint-disable no-else-return */
/* eslint-disable no-unneeded-ternary */
/* eslint-disable one-var */
/* eslint-disable no-multi-assign */
/* eslint-disable no-empty */
/* eslint-disable prefer-destructuring */
/* eslint-disable spaced-comment */
/* eslint-disable no-unused-vars */
/* eslint-disable no-param-reassign */
/* eslint-disable no-underscore-dangle */
/**
 * SSAI and CSAI Ads plugin for Video.JS
 * VAST ads manager
 * @author Electroteque Media Daniel Rossi <danielr@electroteque.org> for One Studio
 */

import { VASTClient, VASTParser, VASTTracker } from '@dailymotion/vast-client';
import AdsManager from './AdsManager';

function createSourceObjects(mediaFiles) {
  return [
    mediaFiles.map((mediaFile) => ({
      type: mediaFile.mimeType,
      src: mediaFile.fileURL,
    }))[0],
  ];
}

export default class VastAdsManager extends AdsManager {
  constructor(config, player) {
    super(config, player);
    player.adsConfig.vast = true;
    player.ads._shouldBlockPlay = true;

    this.adSlotIndex = 0;

    this.adSlotTotalDuration = config.adSlotPrerollDuration;

    player.adsConfig.adSlotIndex = 1;
    player.adsConfig.adSlotsTotal = 1;

    this.vastClient = new VASTClient();
  }

  /**
   * On init request ads for preroll ads
   */
  init() {
    this.config.stitchedAds = false;
    super.init();

    this.getVast(this.config, true);
  }

  onNoPreroll() {
    this.getVast(this.config, false);
  }

  /**
   * Generate midroll cues for midroll ads
   */
  processCues() {
    if (!this.adCueTrack) {
      this.adCueTrack = this.player.addTextTrack('metadata', 'ad-cues', 'en');
    } else {
      this.adCueTrack.mode = 'hidden';
    }

    const Cue = window.WebKitDataCue || window.VTTCue;

    //console.log("cues for duration ", this.player.duration());

    //generate midroll cues from a set interval
    if (this.config.midrollInterval) {
      for (
        let i = this.config.midrollInterval;
        i < this.player.duration();
        i += this.config.midrollInterval
      ) {
        const startTime = i * 60;
        this.adCueTrack.addCue(new Cue(startTime, startTime + 1, ''));
      }
    }

    //console.log("ad cue track", this.adCueTrack);
  }

  /**
   * Request ads on content changed
   */
  onContentChanged() {
    // eslint-disable-next-line no-console
    //console.log('Content changed');
    this.getVast(this.config);
  }

  onAdsReady() {
    if (!this.config.playPreroll) {
      this.player.trigger('nopreroll');
    }
  }

  /**
   * Play preroll on ready
   */
  onReadyForPreroll() {
    if (!this.state.prerollPlayed && this.config.playPreroll) {
      this.state.prerollPlayed = true;
      //this.player.trigger("loadedmetadata");
      this._playAd(this.vastCreative);
    } else {
      this.player.trigger('nopreroll');
    }
  }

  /**
   * Play postroll on ready
   */
  onReadyForPostroll() {
    if (!this.state.postrollPlayed && this.config.playPostroll) {
      this.state.postrollPlayed = true;
      this._playAd(this.vastCreative);
    } else {
      this.player.trigger('nopostroll');
    }
  }

  /**
   * Setup ad events
   */
  setupAdEvents() {
    super.setupAdEvents();

    const player = this.player;

    let errorOccurred = false;

    let previousMuted = player.muted();
    let previousVolume = player.volume();

    // change from preroll duration limit to midroll duration limit
    player.one('adended', () => {
      this.adSlotTotalDuration = this.config.adSlotMidrollDuration;
    });

    /* player.on('adloadstart', () => {
            if (this.tracker) this.tracker.load();
        });*/
    /*player.on('adcanplay', () => {
            if (this.tracker) this.tracker.trackImpression();
        });*/

    player.one('adcanplay', () => {});

    player.on('addurationchange', () => {
      if (this.tracker) {
        // console.log("ad duration change ", player.duration(), player.ads.isInAdMode());
        this.tracker.setDuration(player.duration());
      }
    });

    player.on('adtimeupdate', () => {
      if (this.tracker) {
        /*if (isNaN(this.tracker.assetDuration)) {
                    this.tracker.setDuration(player.duration());
                }*/
        this.tracker.setProgress(player.currentTime());
      }
    });

    player.on('adpause', () => {
      if (this.tracker) {
        this.tracker.setPaused(true);
        player.one('adplay', () => {
          this.tracker.setPaused(false);
        });
      }
    });

    player.on('aderror', () => {
      const MEDIAFILE_PLAYBACK_ERROR = '405';

      if (this.tracker) this.tracker.errorWithCode(MEDIAFILE_PLAYBACK_ERROR);
      errorOccurred = true;
      // Do not want to show VAST related errors to the user
      //player.error(null);
      player.trigger('adended');
    });

    player.on('advolumechange', () => {
      const volumeNow = player.volume();
      const mutedNow = player.muted();

      if (previousMuted !== mutedNow) {
        this.tracker.setMuted(mutedNow);
        previousMuted = mutedNow;
      } else if (previousVolume !== volumeNow) {
        if (previousVolume > 0 && volumeNow === 0) {
          this.tracker.setMuted(true);
        } else if (previousVolume === 0 && volumeNow > 0) {
          this.tracker.setMuted(false);
        }

        previousVolume = volumeNow;
      }
    });

    //player.one('ads-ad-ended', () => {
    /*player.on('adended', () => {
            if (!errorOccurred) {
                this.tracker.complete();
            }
        });*/
  }

  /**
   * Play midroll ad on cue
   * @param {*} activeCue
   */
  startOnAdCue(activeCue) {
    if (this.vastCreative) this._playAd(this.vastCreative);
  }

  stopOnAdCue() {}

  /**
   * Request APS or vast ads url
   * @param {*} config
   * @param {*} preroll
   */
  async getVast(config, preroll = false) {
    if (config.apsURL) {
      this.requestAPS(config.apsURL, preroll);
    } else if (config.url) {
      this.requestAds(config.url, preroll);
    }
  }

  /**
   * Resolve vast ads url from a data service
   * @param {*} apsURL
   * @param {*} preroll
   */
  async requestAPS(apsURL, preroll = false) {
    try {
      const response = await fetch(apsURL);

      let vastURL;

      //if there is data set the resolved url or use the previous resolved url
      if (response) {
        const vast = await response.json();
        vastURL = this.resolvedVastURL = vast.content.vast_url;
      } else if (this.resolvedVastURL) {
        vastURL = this.resolvedVastURL;
      }

      this.player.trigger('resolvedvasturl', vastURL);
      this.requestAds(vastURL, preroll);
    } catch (err) {
      try {
        this.player.trigger('adscanceled');
      } catch (e) {}

      // eslint-disable-next-line no-console
      console.log(`Ad cancelled: ${err.message}`);
    }
  }

  /**
   * Request VAST ads
   * @param {*} url
   * @param {*} adStarted
   */
  requestAds(url, preroll = false) {
    this.state = {};

    url = url += `&preroll=${preroll}`;

    this._getVastContent(url)
      .then((res) => this._handleVast(res, preroll))
      .catch((err) => {
        try {
          this.player.trigger('adscanceled');
        } catch (e) {}

        // eslint-disable-next-line no-console
        console.log(`Ad cancelled: ${err.message}`);
      });
  }

  /**
   * handle parsed vast ads
   * @param {*} vast
   * @param {*} preroll
   * @returns
   */
  _handleVast(vast, preroll = false) {
    if (!vast.ads || vast.ads.length === 0) {
      this.player.trigger('adscanceled');
      return;
    }

    let adDurations = -1,
      limitAdDurations = -1;

    this.ads = vast.ads
      .map((ad, index, ads) => {
        const linearAds = ad.creatives.filter(
            (creative) => creative.type === 'linear'
          ),
          linearCreative = linearAds[0];
        const tracker = new VASTTracker(
          this.vastClient,
          ad,
          linearCreative,
          null
        );
        ad.tracker = tracker;

        //only obtain the top level resolution source
        linearCreative.sources = createSourceObjects(linearCreative.mediaFiles);
        ad.linearCreative = linearCreative;
        ad.duration = linearCreative.duration;

        //increment durations for 150 second ad total check
        adDurations += ad.duration;

        tracker.on('clickthrough', (url) => {
          window$.open(url, '_blank');
        });

        return ad;
      })
      .filter((ad) => {
        //if (!ad.description) return true;
        //filter out midroll creatives
        if (ad.description && ad.description.indexOf('Mid-roll') > -1)
          return false;

        //limit creatives on an ad slot duration of 150 seconds
        const adSlotTotalDuration = this.adSlotTotalDuration;

        //console.log("durations ", adDurations, limitAdDurations, adSlotTotalDuration);

        if (adSlotTotalDuration && adDurations > adSlotTotalDuration) {
          limitAdDurations += ad.duration;
          return limitAdDurations <= adSlotTotalDuration ? true : false;
        } else {
          return true;
        }
      });

    try {
      this.player.adsConfig.adTagDuration = this.ads
        .map((ad) => ad.duration)
        .reduce((a, b) => a + b);
    } catch (e) {}

    this.player.adsConfig.adSlotsTotal = this.ads.length;

    this.player.trigger('vastads', this.ads);

    const linearCreative = this.ads[0].linearCreative;

    this.setupCreative(this.ads[0]);

    if (preroll) {
      if (linearCreative.sources.length) {
        // console.log('Trigger ads ready');
        this.triggerAdsReady();
      } else {
        this.player.trigger('adscanceled');
      }
    }
  }

  setupCreative(ad) {
    this.vastCreative = ad.linearCreative;
    this.tracker = ad.tracker;
  }

  /**
   * Get Vast Content
   *
   * @private
   */
  _getVastContent(url) {
    return this.vastClient.get(url, {
      withCredentials: this.config.withCredentials,
      wrapperLimit: this.config.wrapperLimit,
    });
  }

  /**
   * Play ad creative
   * @param {*} vastCreative
   */
  _playAd(vastCreative) {
    const player = this.player,
      currentAd = this.ads[this.adSlotIndex];

    //console.log("tracker", this.tracker);

    player.one('adloadstart', () => {
      const tracker = currentAd.tracker;
      if (tracker) tracker.load();
    });

    player.one('adcanplay', () => {
      const tracker = currentAd.tracker;
      if (tracker) tracker.trackImpression();
    });

    player.one('adended', () => {
      const tracker = currentAd.tracker;

      //console.log("current ad", currentAd, tracker);
      if (tracker) tracker.complete();
    });

    player.one('adstart', () => {
      //disable play button during ad slots
      player.toggleClass('vjs-ad-content-resuming', true);
      player.trigger('ads-ad-started');
    });

    if (this.adSlotIndex === 0) player.ads.startLinearAdMode();

    //console.log("sources", vastCreative.sources);
    player.src(vastCreative.sources);

    let nextAd = null;

    //setup next ads
    if (this.ads.length) {
      this.adSlotIndex++;
      player.adsConfig.adSlotIndex = this.adSlotIndex;
      nextAd = this.ads[this.adSlotIndex];

      //console.log("next ad ", nextAd, this.adSlotIndex);
      //if (nextAd) this.setupCreative(nextAd);
    }

    player.one('adended', () => {
      //has more ads in the slot
      if (nextAd) {
        this.setupCreative(nextAd);
        //if (this.adSlotIndex < 2) {
        player.trigger('adslot', nextAd);
        //console.log("has next ad");
        //play configured ad
        this._playAd(this.vastCreative);
      } else {
        //console.log("ad complete");
        player.one('contentloadedmetadata', () => {
          //console.log("load ads");
          //request vast again on ad completion
          this.getVast(this.config);
        });

        if (this.adCueTrack) this.adCueTrack.mode = 'hidden';
        player.ads.endLinearAdMode();
        player.trigger('ads-ad-ended');
        this.adSlotIndex = player.adsConfig.adSlotIndex = 0;
      }
    });
  }
}
