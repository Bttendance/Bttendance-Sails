/**
 * Error.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for error JSON handling.
 *
 *	{ 
 *   	"type" : "type", (log, alert, toast, loading)
 *  	"title": "title",
 *   	"message": "message"
 *	}
 */

exports.createJSON = function(type, title, message) {
	var json = {};
	json.type = type;
	json.title = title;
	json.message = message;
	return json;
}

exports.parseToJSON = function(err) {
	var json = {};
	console.log(err);
	// json.type = type;
	// json.title = title;
	// json.message = message;
	return json;
}