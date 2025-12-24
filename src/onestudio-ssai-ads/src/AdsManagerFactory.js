/* eslint-disable no-unreachable */
import VastAdsManager from './VastAdsManager';
import SSAIAdsManager from './SSAIAdsManager';

export default class AdsManagerFactory {
  static getAdsManager(config, player) {
    switch (config.type) {
      case 'vast':
        return new VastAdsManager(config, player);
        break;
      case 'ssai':
      default:
        return new SSAIAdsManager(config, player);
        break;
    }
  }
}
