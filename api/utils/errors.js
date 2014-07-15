/**
 * Errors.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for error JSON handling.
 *
 *	{ 
 *   	"type" : "type", (log, toast, alert)
 *  	"title": "title",
 *   	"message": "message"
 *	}
 */

exports.log = function(req, message) {
	var url = req.url;
	sails.log.debug(url + ' : ' + message);

	var locale = req.param('locale');
	if (!locale)
		locale = 'en';
	
	var json = {};
	json.type = 'log';
	json.message = sails.__({ phrase: message, locale: locale });
	return json;
}

exports.toast = function(req, message) {
	var url = req.url;
	sails.log.warn(url + ' : ' + message);

	var locale = req.param('locale');
	if (!locale)
		locale = 'en';

	var json = {};
	json.type = 'toast';
	json.message = sails.__({ phrase: message, locale: locale });
	return json;
}

exports.alert = function(req, title, message) {
	var url = req.url;
	sails.log.error(url + ' : ' + title + ' : ' + message);

	var locale = req.param('locale');
	if (!locale)
		locale = 'en';

	var json = {};
	json.type = 'alert';
	json.title = sails.__({ phrase: title, locale: locale });
	json.message = sails.__({ phrase: message, locale: locale });
	return json;
}