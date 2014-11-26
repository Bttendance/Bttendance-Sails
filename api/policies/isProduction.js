'use strict';

/**
 * isProduction
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors');

module.exports = function isProduction (req, res, next) {

  if (process.env.NODE_ENV === 'production') {
    return next();
  }

  return res.send(403, error.log(req, "isProduction Policy Error", "Forbidden in development mode."));
};
