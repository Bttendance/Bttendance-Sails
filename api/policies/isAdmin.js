/**
 * Allow any authenticated user.
 */
module.exports = function isAdmin (req, res, ok) {

	var admin = req.param('admin');

	if (!admin) {
		console.log("isAdmin : Admin is required");
		return res.send(400, { error: "Admin is required"});
	}

	if (admin != 'utopia' && admin != 'Utopia') {
		console.log("isAdmin : Admin is wrong");
		return res.send(400, { error: "Admin is wrong"});
	}
  
  console.log("Admin is logined");

	ok();
};