/**
* SupervisingCourse.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One-to-many
    user: {
      model: 'User',
      required: true,
      index: true
    },

    // One-to-many
    course: {
      model: 'Course',
      required: true,
      index: true
    },

    state: {
      type: 'string',
      required: true,
      enum: ['teaching', 'assistting', 'dropped', 'removed']
    },

    toSimpleJSON: function () {
      var json = JSON.stringify(this),
          obj = JSON.parse(json);

      delete obj.createdAt;
      delete obj.updatedAt;
      if (this.user)
        obj.user = this.user.id;
      if (this.course)
        obj.course = this.course.id;
      obj.state = this.state;

      return obj;
    }

  }
};
