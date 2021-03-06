'use strict';

import logger from './logger';

export default (error, request, response, next) => { // eslint-disable-line no-unused-vars
  logger.log(logger.ERROR, '__ERROR_MIDDLEWARE__');
  logger.log(logger.ERROR, error);

  if (error.status) {
    logger.log(logger.INFO, `Responding with a ${error.status} code and message ${error.message}`);
    return response.sendStatus(error.status);
  }

  const errorMessage = error.message.toLowerCase();
  logger.log(logger.INFO, errorMessage);

  if (errorMessage.includes('objectid failed')) {
    logger.log(logger.INFO, 'Responding with 404');
    return response.sendStatus(404);
  }
  if (errorMessage.includes('jwt malformed')) {
    logger.log(logger.INFO, 'Responding with 401');
    return response.sendStatus(401);
  }
  if (errorMessage.includes('validation failed')) {
    logger.log(logger.INFO, 'Responding with 400');
    return response.sendStatus(400);
  }
  if (errorMessage.includes('duplicate key')) {
    logger.log(logger.INFO, 'Responding with 409');
    return response.sendStatus(409);
  }
  if (errorMessage.includes('unauthorized')) {
    logger.log(logger.INFO, 'Responding with 401');
    return response.sendStatus(401);
  }
  logger.log(logger.ERROR, 'Responding with 500');
  logger.log(logger.ERROR, error);
  logger.log(logger.INFO, `LOGGER 500 ERROR, ${error}`);
  return response.sendStatus(500);
};
