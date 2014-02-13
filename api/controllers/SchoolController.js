/**
 * SchoolController
 *
 * @module		:: Controller
 * @description	:: Contains logic for handling requests.
 */

module.exports = {

	all: function(req, res) {
		res.contentType('application/json');		

		School.find().done(function(err, schools) {
  			var schoolsObject = new Array();
				for (var index in schools)
					schoolsObject.push(schools[index]);
				var schoolsJSON = JSON.stringify(schoolsObject);
		  	return res.send(schoolsJSON);
		});
	},

	courses: function(req, res) {
		res.contentType('application/json');
		var school_id = req.param('school_id');

		School.findOne(school_id).done(function(err, school) {
			if (err || !school)
		    return res.send(500, { message: "School Find Error" });

  		Course.find({
  			where: {
  				or: getConditionFromIDs(school.courses)
  			}
  		}).done(function(err, courses) {
  			if (err || !courses)
	    		return res.send(JSON.stringify(new Array()));

  			var coursesObject = new Array();
				for (var index in courses)
					coursesObject.push(courses[index]);
				var coursesJSON = JSON.stringify(coursesObject);
		  	return res.send(coursesJSON);

  		});
		});
	}
};

// Function to get id list
var getConditionFromIDs = function(array) {
	var returnArray = new Array();
	for (var index in array) {
		var idObject = [];
		idObject["id"] = array[index];
		returnArray.push(idObject);
	}
	return returnArray;
}