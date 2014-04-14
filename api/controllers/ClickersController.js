/**
 * ClickersController.js 
 *
 * @description ::
 * @docs        :: http://sailsjs.org/#!documentation/controllers
 */

module.exports = {

	click: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var clicker_id = req.param('clicker_id');
		var post_id = req.param('post_id');

    Clickers
    .update({id:clicker_id}, {post:post_id})
    .exec(function update(err, clickers) {
      Clickers.publishUpdate(clickers[0].id, clickers[0].toWholeObject());
		  return res.send(clickers[0].toWholeObject());
    });
	},

	connect: function(req, res) {
		res.contentType('application/json; charset=utf-8');
		var username = req.param('username');
		var password = req.param('password');
		var socket_id = req.param('socket_id');
		var clicker_id = req.param('clicker_id');

		var socket = sails.io.sockets.sockets[socket_id];

		Clickers
		.findOneById(clicker_id)
		.exec(function callback(err, clicker){
      Clickers.subscribe(socket, clicker, ['update']);
	  	return res.send(clicker.toWholeObject());
    });
	}
	
};
