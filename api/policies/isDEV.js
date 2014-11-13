/**
 * isDev
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function isDev (req, res, next) {

	// isDev Policy
	if (process.env.NODE_ENV == 'development')
		return next();

	return res.send(403, Error.log(req, "Develop Policy Error", "Forbidden in production mode."));
};