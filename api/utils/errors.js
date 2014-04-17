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

exports.log = function(message) {
	var json = {};
	json.type = 'log';
	json.message = message;
	return json;
}

exports.toast = function(message) {
	var json = {};
	json.type = 'toast';
	json.message = message;
	return json;
}

exports.alert = function(title, message) {
	var json = {};
	json.type = 'alert';
	json.title = title;
	json.message = message;
	return json;
}