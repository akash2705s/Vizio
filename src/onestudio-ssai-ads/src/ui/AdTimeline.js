/* eslint-disable prefer-destructuring */
/* eslint-disable one-var */
/* eslint-disable prefer-template */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable react/sort-comp */
/* eslint-disable no-underscore-dangle */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

export default class AdTimeline extends Component {
  constructor(player, options) {
    super(player, options);

    this.originalPlayerState = {};
    this._totalPodTime = 0;

    this.onTimeUpdateRef = () => this.onAdsProgress();
    this.onVastTimeUpdateRef = () => this.onAdVastProgress();

    player.on('adstart', () => this.onAdStart());
    player.on('adended', () => this.onAdEnded());
    player.on('addurationchange', () => this.onAdDurationChange());

    player.on('ads-ad-ended', () => {
      this._totalPodTime = 0;
    });
  }

  createEl() {
    return super.createEl('div', {
      className: 'vjs-ads-timeline',
    });
  }

  onAdDurationChange() {
    this.duration = this.player_.adsConfig.adTagDuration
      ? this.player_.adsConfig.adTagDuration
      : this.player_.duration();

    this._adDuration = this.player_.duration();

    if (this.player_.adsConfig.vast)
      this.player_.on('adtimeupdate', this.onVastTimeUpdateRef);
    else this.player_.on('adtimeupdate', this.onTimeUpdateRef);
  }

  onAdVastProgress() {
    // if an ad cue tag use the duration of the end cue
    const perc =
      (this.player_.currentTime() + this._totalPodTime) / this.duration;
    this.width(perc * 100 + '%');
  }

  onAdsProgress() {
    // if an ad cue tag use the duration of the end cue
    const perc = this.player_.currentTime() / this.duration;
    this.width(perc * 100 + '%');
  }

  onAdStart() {
    const player = this.player_,
      adsConfig = player.adsConfig;

    this.originalPlayerState.controlsEnabled = player.controls();
    player.controls(adsConfig.controlsEnabled);

    this.originalPlayerState.seekEnabled =
      player.controlBar.progressControl.enabled();

    if (adsConfig.seekEnabled) {
      player.controlBar.progressControl.enable();
    } else {
      player.controlBar.progressControl.disable();
    }

    // player.on('adtimeupdate', this.onTimeUpdateRef);
  }

  onAdEnded() {
    const player = this.player_;

    this._totalPodTime += this._adDuration;

    this.width('0%');

    player.controls(this.originalPlayerState.controlsEnabled);

    if (this.originalPlayerState.seekEnabled) {
      player.controlBar.progressControl.enable();
    } else {
      player.controlBar.progressControl.disable();
    }

    player.off('adtimeupdate', this.onTimeUpdateRef);
  }
}

Component.registerComponent('adTimeline', AdTimeline);
