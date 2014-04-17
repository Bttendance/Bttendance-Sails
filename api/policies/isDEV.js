/**
 * isDev
 *
 * @module      :: Policy
 * @description :: 
 * @docs        :: http://sailsjs.org/#!documentation/policies
 */

var Error = require('../utils/errors');

module.exports = function isDev (req, res, next) {

	// Super Port Policy
	if (req.port == 7331)
		return next();

	// isDev Policy
	if (process.env.NODE_ENV == "development" || process.env.NODE_ENV == 'staging')
		return next();
	
	return res.send(403, Error.log("Forbidden in production mode."));
};