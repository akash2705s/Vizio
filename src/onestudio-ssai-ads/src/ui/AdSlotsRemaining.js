import videojs from 'video.js';

const Component = videojs.getComponent('Component');


export default class AdSlotsRemaining extends Component {

	constructor(player, options) {
		super(player, options);

		player.on('addurationchange', () => this.onAdDurationChange());
		
	}
	
	buildCSSClass() {
	    return 'vjs-ads-slots';
	}

	createEl() {
		const el = super.createEl('div', {
	      className: 'vjs-ads-slots'
	    });

	    //el.innerHTML = "1 of";

	    return el;
	}

	onAdDurationChange() {
	
        const adSlotIndex = this.player_.adsConfig.adSlotIndex,
        adSlotsTotal = this.player_.adsConfig.adSlotsTotal;

        this.update(adSlotIndex, adSlotsTotal);
	}

	update(index, total) {
		this.el_.innerHTML = `${index} of ${total}`;
	}
}

Component.registerComponent('adSlotsRemaining', AdSlotsRemaining);
