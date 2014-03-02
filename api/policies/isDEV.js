/**
 * Allow any authenticated user.
 */

module.exports = function isUser (req, res, ok) {

	// var admin = req.param('admin');
	// if (admin == "bttendance")
	// 	ok();

	if (process.env.NODE_ENV == "development")
		ok();
	else
		return res.send(403, { message: "Forbidden"});
};