/**
 * Email.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for email JSON handling.
 *
 *	{ 
      "email": "email"
 *	}
 */

exports.json = function(email) {
	var json = {};
	json.email = email;
	return json;
}