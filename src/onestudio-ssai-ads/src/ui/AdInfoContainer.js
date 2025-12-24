/* eslint-disable no-unused-vars */
/* eslint-disable no-underscore-dangle */
/* eslint-disable import/extensions */
/* eslint-disable react/sort-comp */
/* eslint-disable import/first */
/* eslint-disable react/no-unused-class-component-methods */
import videojs from 'video.js';

const Component = videojs.getComponent('Component');

import './AdTime.js';
// import './AdSlotsRemaining';
// import './AdLink.js';

export default class AdInfoContainer extends Component {
  createEl() {
    return super.createEl('div', {
      className: 'vjs-ads-info-container',
    });
  }

  handleClick(event) {
    // vast ad click tracker
    if (this.player_.tracker) {
      this.player_.tracker.click();
    }
  }
}

AdInfoContainer.prototype.options_ = {
  children: [
    'adTime',
    // 'adSlotsRemaining'
  ],
};

Component.registerComponent('adInfoContainer', AdInfoContainer);
