/**
* numbers_slash_command
*
* This file invokes logic from our dependency injection container and handles any
* interface with Lambda/API Gateway
*/

import 'babel-polyfill';
import qs from 'qs';
import getContainer from '../container';

// =============
// constants
// =============

const SUCCESS_RESPONSE = { statusCode: 200 };

const ERROR_RESPONSE = {
  statusCode: 500,
  body: JSON.stringify({
    message: 'Error invoking /numbers slash command',
  }),
};

const parseBody = body => {
  if (typeof body === 'string') {
    if (/^\{/.test(body)) {
      return JSON.parse(body);
    }
    return qs.parse(body);
  }
  return body;
};

export const handler = (request, context, callback) => {
  // Get our dependency injection container
  const container = getContainer();

  // Get an instance of the logger
  const logger = container.Logger;

  // Get our numbers api manager
  const numbersApiManager = container.NumbersApiManager;

  // Some debug level logging
  logger.debug('/numbers received request', request);


  numbersApiManager.interpretSlashCommand(Object.assign({}, request, { body: parseBody(request.body) }))
  .then(() => {
    // Success & validation errors/invlid commands
    logger.info('/numbers invocation successfully completed');
    callback(null, SUCCESS_RESPONSE);
  }).catch(err => {
    // Fatal errors
    logger.error('/numbers caught error', err);
    callback(err, ERROR_RESPONSE);
  });
};

export default handler;
