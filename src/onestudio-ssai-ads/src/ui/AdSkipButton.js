/* eslint-disable no-unused-vars */
/* eslint-disable no-bitwise */
/* eslint-disable no-param-reassign */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-underscore-dangle */
/* eslint-disable spaced-comment */
/* eslint-disable one-var */
import videojs from 'video.js';

const Button = videojs.getComponent('Button'),
  Component = videojs.getComponent('Component');

let _skipDelay = 5;

export default class AdSkipButton extends Button {
  constructor(player, options) {
    super(player, options);

    this.elapsedSkipTime = 0;
    //this.preSkip = player.getChild("adPreSkip");

    player.on('adstart', () => this.onAdStart());
  }

  set skipDelay(value) {
    _skipDelay = value;
  }

  createEl(tag, props = {}, attributes = {}) {
    tag = 'button';

    props = {
      className: this.buildCSSClass(),
    };

    // Add attributes for button element
    attributes = {
      // Necessary since the default button type is "submit"
      type: 'button',
    };

    const el = Component.prototype.createEl.call(this, tag, props, attributes);

    this.createControlTextEl(el);

    const icon = Component.prototype.createEl.call(
      this,
      'span',
      {
        className: 'vjs-icon-placeholder',
      },
      {
        'aria-hidden': 'true',
      }
    );

    el.appendChild(icon);
    return el;
  }

  onAdStart() {
    this.onTimeUpdateRef = () => this.onAdsProgress();
    this.elapsedSkipTime = this.player_.currentTime();

    this.player_.one('adtimeupdate', () => {
      this.elapsedSkipTime = this.player_.currentTime();
      //console.log("AdStart", this.elapsedSkipTime);
    });

    this.player_.on('adtimeupdate', this.onTimeUpdateRef);
  }

  onAdsProgress() {
    const elapsedTime = this.player_.currentTime() - this.elapsedSkipTime;

    //console.log("elapsed time", elapsedTime, this.player_.currentTime(), this.elapsedSkipTime);

    if (elapsedTime >= _skipDelay) {
      this.player_.toggleClass('vjs-ad-is-pre-skippable', false);
      this.player_.toggleClass('vjs-ad-is-skippable-now', true);
      this.player_.off('adtimeupdate', this.onTimeUpdateRef);
    }

    this.player_.trigger('adskipremaining', ~~(_skipDelay - elapsedTime));

    //this.elapsedSkipTime = this.player_.currentTime();
  }

  handleClick(event) {
    this.player_.off('adtimeupdate', this.onTimeUpdateRef);
    this.player_.toggleClass('vjs-ad-is-skippable-now', false);
    this.player_.trigger('adended');

    //this.player_.ads.endLinearAdMode();

    //vast ad skip tracker
    if (this.player_.tracker) {
      this.player_.tracker.skip();
    }
  }

  buildCSSClass() {
    return 'vjs-ads-skip-button vjs-control';
  }
}

AdSkipButton.prototype.controlText_ = 'Skip Ad';

Component.registerComponent('adSkipButton', AdSkipButton);
