'use strict';

/**
 * isDevelopment
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors');

module.exports = function isDevelopment (req, res, next) {

  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  return res.send(403, error.log(req, "isDevelopment Policy Error", "Forbidden in production mode."));
};
