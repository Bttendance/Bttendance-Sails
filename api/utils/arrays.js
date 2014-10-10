/**
 * Arrays.js
 *
 * @module			:: JSON Array Handler
 * @description	:: Contains logic for JSON Array handling.
 *
 */

exports.getIds = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].id);
	return ids;
}

exports.getEmails = function(jsonArray) {
	if (!jsonArray)
		return new Array();

  var ids = new Array();
  for (var i = 0; i < jsonArray.length; i++)
  	ids.push(jsonArray[i].email);
	return ids;
}