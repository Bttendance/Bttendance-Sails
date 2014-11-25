'use strict';

/**
 * Translation
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/errors');

module.exports = function isDev (req, res, next) {
	if (req.param('locale') != 'ko')

	next();
};
