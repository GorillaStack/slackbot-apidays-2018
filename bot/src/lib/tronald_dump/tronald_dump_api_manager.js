/**
* tronald_dump_api_manager
*
* Interface with the tronald dump api to generate laughs!
*/

import rp from 'request-promise-native';

// =============
// Constants
// =============
const TRONALD_DUMP_API_BASE_URL = 'https://api.tronalddump.io';
const RANDOM_QUOTE_PATH = '/random/quote';

export default class NumbersApiManager {
  setLogger(logger) {
    this.logger = logger;
  }

  setSlackApiManager(slackApiManager) {
    this.slackApiManager = slackApiManager;
  }

  /**
  * interpretSlashCommand
  *
  * The method responsible for:
  *   - slack request verification against token
  *   - slash command format validation
  *   - delegation to other methods based on command syntax
  *
  * @param {Object} - request - request
  * @return {Promise}
  */
  async interpretSlashCommand(request) {
    this.slackApiManager.checkValidVerificationToken(request);
    const responseUrl = this.slackApiManager.getResponseUrl(request);
    const result = await this.request();
    return this.slackApiManager.sendSlackMessage(responseUrl, result.value);
  }

  request() {
    this.logger.debug('TronaldDumpApiManager.search');
    return rp({
      uri: `${TRONALD_DUMP_API_BASE_URL}${RANDOM_QUOTE_PATH}`,
      json: true,
    });
  }
}
