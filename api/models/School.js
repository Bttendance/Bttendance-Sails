/**
 * Schools
 *
 * @module      :: Model
 * @description :: A short summary of how this model works and what it represents.
 * @docs		:: http://sailsjs.org/#!documentation/models
 */

module.exports = {

  attributes: {

    // This has to be English
    name: {
      type: 'string',
      required: true
    },

    type: {
      type: 'string',
      enum: ['university', 'school', 'institute', 'etc'],
      required: true
    },

    // One-to-many
    courses: {
      collection: 'Course',
      via: 'school'
    },

    // One-to-many
    managers: {
      collection: 'EmployedSchool',
      via: 'school'
    },

    // One-to-many
    students: {
      collection: 'EnrolledSchool',
      via: 'school'
    },

    toJSON: function () {
      var obj = this.toObject();

      delete obj.createdAt;
      delete obj.updatedAt;

      return obj;
    },

    toWholeObject: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;

      return obj;
    }
  }
};
