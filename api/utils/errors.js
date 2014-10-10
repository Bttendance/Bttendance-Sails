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

exports.log = function(req, title, message) {
	return log(req, title, message, undefined);
}

exports.toast = function(req, title, message) {
	return toast(req, title, message, undefined);
}

exports.alert = function(req, title, message) {
	return alert(req, title, message, undefined);
}

exports.log = function(req, title, message, param1) {
	return log(req, title, message, param1, undefined);
}

exports.toast = function(req, title, message, param1) {
	return toast(req, title, message, param1, undefined);
}

exports.alert = function(req, title, message, param1) {
	return alert(req, title, message, param1, undefined);
}

exports.log = function(req, title, message, param1, param2) {
	var url = req.url;
	sails.log.debug(url + ' : ' + title + ' : ' + message + ' : ' + param1 + ' : ' + param2);

	var locale = req.param('locale');
	if (!locale || locale != 'ko')
		locale = 'en';
	
	var json = {};
	json.type = 'log';
	json.title = sails.__({ phrase: title, locale: locale });
	json.message = sails.__({ phrase: message, locale: locale }, param1, param2);
	return json;
}

exports.toast = function(req, title, message, param1, param2) {
	var url = req.url;
	sails.log.warn(url + ' : ' + title + ' : ' + message + ' : ' + param1 + ' : ' + param2);

	var locale = req.param('locale');
	if (!locale || locale != 'ko')
		locale = 'en';

	var json = {};
	json.type = 'toast';
	json.title = sails.__({ phrase: title, locale: locale });
	json.message = sails.__({ phrase: message, locale: locale }, param1, param2);
	return json;
}

exports.alert = function(req, title, message, param1, param2) {
	var url = req.url;
	sails.log.error(url + ' : ' + title + ' : ' + message + ' : ' + param1 + ' : ' + param2);

	var locale = req.param('locale');
	if (!locale || locale != 'ko')
		locale = 'en';

	var json = {};
	json.type = 'alert';
	json.title = sails.__({ phrase: title, locale: locale });
	json.message = sails.__({ phrase: message, locale: locale }, param1, param2);
	return json;
}