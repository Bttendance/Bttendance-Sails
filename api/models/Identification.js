/**
 * Identification.js
 *
 * @description :: TODO: You might write a short summary of how this model works and what it represents here.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

	attributes: {

		identity: {
			type: 'string',
      required: true
		},

		owner: {
			model: 'User'
		},

		school: {
			model: 'School',
      required: true
		},

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.owner;
      if (this.school)
        obj.school = this.school.id;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);

      if (this.owner)
        obj.owner = this.owner.toSimpleJSON();

      if (this.school)
        obj.school = this.school.toSimpleJSON();
      
      return obj;
    }
	}

};
