import videojs from 'video.js';

const Component = videojs.getComponent('Component');

class AdTimeRemaining extends Component {

	buildCSSClass() {
	    return 'vjs-ads-time-remaining';
	}
}

Component.registerComponent('adTimeRemaining', AdTimeRemaining);
