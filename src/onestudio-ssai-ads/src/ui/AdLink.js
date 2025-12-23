import videojs from 'video.js';

const ClickableComponent = videojs.getComponent('ClickableComponent'),
Component = videojs.getComponent('Component');

export default class AdLink extends ClickableComponent {

	constructor(player, options) {
		super(player, options);

		player.on('adsready', () => this.onAdsReady());
		player.on('readyforpreroll', () => this.onAdsReady());
		player.on('readyforpostroll', () => this.onAdsReady());
		
	}

	createEl(tag = 'div', props = {}, attributes = {}) {
    	
    	this.tabIndex_ = props.tabIndex;

    	props = {
	     // innerHTML: '<span aria-hidden="true" class="vjs-icon-placeholder"></span>',
	      className: this.buildCSSClass()
	    };

	    // Add attributes for button element
	    attributes = {

	      // Necessary since the default button type is "submit"
	      type: 'button'
	    };

	    const el = Component.prototype.createEl.call(this, tag, props, attributes);

	    this.createControlTextEl(el);

	    /*const link = Component.prototype.createEl.call(this, "a", {

	    }, {
	    	
	    });

	    link.setAttribute("href", );*/

	    const icon = Component.prototype.createEl.call(this, "span", {
	    	className: "vjs-icon-placeholder"
	    }, {
	    	"aria-hidden": "true"
	    });

	    el.appendChild(icon);


	    return el;
	}

	toggleView() {

		this.toggleClass("vjs-ads-link-hidden", false);
		
		this.setTimeout(() => {
			this.toggleClass("vjs-ads-link-hidden", true);
		}, this.player_.adsConfig.adURLDelay * 1000);
	}

	onAdsReady() {
		//hide when not configured
		if (!this.player_.options_.adUrl) {
			this.toggleClass("vjs-ads-link-hidden", true);
		} else {
			this.controlText(this.player_.options_.adTitle);
			this.player_.one("adtimeupdate", () => this.toggleView());
		}
		
		
	}

	buildCSSClass() {
	    return 'vjs-ads-link';
	}

	handleClick(event) {
		window.open(this.player_.options_.adUrl,'_blank');
		//location.href = this.player_.options_.adUrl;
	}
}

AdLink.prototype.controlText_ = 'Website';

ClickableComponent.registerComponent('adLink', AdLink);
