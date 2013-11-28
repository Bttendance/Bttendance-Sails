/**
 * Allow any authenticated user.
 */
module.exports = function isAdmin (req, res, ok) {

	var admin = req.param('admin');

	if (!admin) {
		console.log("isAdmin : Admin is required");
		return res.send(400, { message: "Admin is required"});
	}

	if (admin != 'utopia' && admin != 'Utopia') {
		console.log("isAdmin : Admin is wrong");
		return res.send(400, { message: "Admin is wrong"});
	}
  
  console.log("Admin is logined");

	ok();
};