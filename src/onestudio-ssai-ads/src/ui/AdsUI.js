/* eslint-disable no-underscore-dangle */
/* eslint-disable react/no-unused-class-component-methods */
/* eslint-disable import/first */
/* eslint-disable no-useless-constructor */
/* eslint-disable import/extensions */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

import './AdInfoContainer.js';
import './AdTimelineContainer.js';
import './AdPreSkip.js';

export default class AdsUI extends Component {
  constructor(player, options) {
    super(player, options);
  }

  createEl() {
    return super.createEl('div', {
      className: 'vjs-ads-container',
      dir: 'ltr',
    });
  }
}

AdsUI.prototype.options_ = {
  children: ['adInfoContainer', 'adTimelineContainer', 'adPreSkip'],
};

Component.registerComponent('AdsUI', AdsUI);
