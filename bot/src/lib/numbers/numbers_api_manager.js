/**
* numbers_api_manager
*
* Interface with the memegen.link api to generate our memes
*/

import rp from 'request-promise-native';

// =============
// Constants
// =============
const NUMBERS_API_BASE_URL = 'http://numbersapi.com';

export default class NumbersApiManager {
  setLogger(logger) {
    this.logger = logger;
  }

  setSlackApiManager(slackApiManager) {
    this.slackApiManager = slackApiManager;
  }

  /**
   * Take a string and split out the number and type.
   *
   * If the number of the arguments of the type of the arguments are not valid,
   * throw an exception
   * @param {String} slashCommandText
   */
  getArgs(slashCommandText) {
    const parts = slashCommandText.trim().split(/\s+/);
    if (parts.length !== 2
      || isNaN(parseInt(parts[0], 10))
      || ['trivia', 'math'].indexOf(parts[1]) === -1) {
      throw Error();
    }

    return { number: parts[0], type: parts[1] };
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
    const slashCommandText = this.slackApiManager.getSlashCommandText(request);
    try {
      const { number, type } = this.getArgs(slashCommandText);
      const result = await this.request(number, type);
      return this.slackApiManager.sendSlackMessage(responseUrl, result);
    } catch (err) {
      return this.sendHelpMessage(responseUrl);
    }
  }

  request(number, type) {
    this.logger.debug('NumbersApiManager.search', { number, type });
    return rp({
      uri: `${NUMBERS_API_BASE_URL}/${number}/${type}`,
      json: true,
    });
  }

  sendHelpMessage(responseUrl) {
    return this.slackApiManager.sendSlackMessage(responseUrl, '', [
      {
        fallback: 'numbers help',
        color: '#33495e',
        pretext: '*numbers commands*',
        mrkdwn_in: ['fields', 'pretext'],
        fields: [
          {
            title: '/numbers help',
            value: 'show this help',
            short: false,
          },
          {
            title: '/numbers <number> <type>',
            value: 'number can be any integer, type can be either trivia | math\n```/numbers 42 trivia\n```',
            short: false,
          },
        ],
        footer: ':memo: This is a sample respository to demo a serverless slackbot'
          + ' project, created by the awesome team at GorillaStack',
      },
    ]);
  }
}
