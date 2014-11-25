'use strict';

/**
 * Development
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors');

module.exports = function isDev (req, res, next) {

  // Development Policy
  if (process.env.NODE_ENV === 'development') {
    return next();
  }

  return res.send(403, error.log(req, "Develop Policy Error", "Forbidden in production mode."));
};
