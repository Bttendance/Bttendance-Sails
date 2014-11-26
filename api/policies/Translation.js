'use strict';

/**
 * Translation
 *
 * @module      :: Policy
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var error = require('../utils/Errors');

module.exports = function Translation (req, res, next) {
	if (req.param('locale') != 'ko')
		
	next();
};
