/**
 * Allow any authenticated user.
 */

module.exports = function isUser (req, res, ok) {

	// if (process.env.NODE_ENV == "production")
	if (process.env.NODE_ENV == "development")
		ok();
	else
		return res.send(403, { message: "Forbidden"});
};