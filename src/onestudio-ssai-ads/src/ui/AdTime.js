/* eslint-disable react/sort-comp */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

// import './AdTimeRemaining.js';

export default class AdTime extends Component {
  constructor(player, options) {
    super(player, options);

    this._totalPodTime = 0;

    player.on('addurationchange', () => this.onAdDurationChange());

    if (player.adsConfig.vast) {
      player.on('adtimeupdate', () => this.onAdVastProgress());
      // player.on('addurationchange', () => this.onAdVastDurationChange());
    } else {
      player.on('adtimeupdate', () => this.onAdsProgress());
    }

    player.on('ads-ad-ended', () => {
      this._totalPodTime = 0;
    });

    player.on('adended', () => {
      this._totalPodTime += this._adDuration;
    });
  }

  buildCSSClass() {
    return 'vjs-ads-time';
  }

  createEl() {
    const el = super.createEl('div', {
      className: 'vjs-ads-time',
    });

    el.innerHTML = '00:00';

    return el;
  }

  onAdDurationChange() {
    this.duration = this.player_.adsConfig.adTagDuration
      ? this.player_.adsConfig.adTagDuration
      : this.player_.duration();

    this._adDuration = this.player_.duration();
  }

  onAdVastProgress() {
    // const _totalPodTime = (this.duration - (this._totalPodTime + this.player_.currentTime()));
    // console.log((this._totalPodTime + this.player_.currentTime()));
    // if an ad cue tag use the duration of the end cue
    this.update(
      this.duration - (this._totalPodTime + this.player_.currentTime())
    );
  }

  onAdsProgress() {
    // if an ad cue tag use the duration of the end cue
    this.update(this.duration - this.player_.currentTime());
  }

  update(sec) {
    this.el_.innerHTML = videojs.formatTime(sec);
  }
}

Component.registerComponent('adTime', AdTime);
