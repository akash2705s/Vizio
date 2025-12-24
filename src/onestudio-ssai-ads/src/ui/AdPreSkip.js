/* eslint-disable import/extensions */
/* eslint-disable class-methods-use-this */
/* eslint-disable no-param-reassign */
/* eslint-disable import/first */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable no-underscore-dangle */
/* eslint-disable react/sort-comp */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

import './AdSkipRemaining.js';

export default class AdPreSkip extends Component {
  constructor(player, options) {
    super(player, options);

    player.on('adskipremaining', (e, time) => this.onSkipRemaining(e, time));
  }

  createEl(tag = 'div', props = {}, attributes = {}) {
    this.tabIndex_ = props.tabIndex;

    props = {
      className: this.buildCSSClass(),
    };

    return super.createEl(tag, props, attributes);
  }

  buildCSSClass() {
    return 'vjs-ads-pre-skip vjs-control';
  }

  onSkipRemaining(e, time) {
    this.el().innerHTML = time;
  }
}

Component.registerComponent('adPreSkip', AdPreSkip);
