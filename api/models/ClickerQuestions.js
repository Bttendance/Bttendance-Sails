/**
* ClickerQuestions.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

		message: {
			type: 'string',
			required: true
		},

		choice_count: {
			type: 'integer'
		},

    progress_time: {
      type: 'integer',
      defaultsTo: 90
    },

    show_info_on_select: {
      type: 'boolean',
      defaultsTo: true
    },

    detail_privacy: { //all, none, professor
      type: 'string',
      defaultsTo: 'professor'
    },

    author: {
      model: 'Users'
    },

		course: {
			model: 'Courses'
		},

    toJSON: function() {
      var obj = this.toObject();
      delete obj.createdAt;
      delete obj.updatedAt;
      delete obj.course;
      return obj;
    },

    toWholeObject: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      obj.createdAt = this.createdAt;
      obj.updatedAt = this.updatedAt;
      obj.course = this.course;
      return obj;
    }

  },

  beforeValidate: function(values, next) {
    next();
  },

  afterValidate: function(values, next) {
    next();
  },

  beforeCreate: function(values, next) {
    if (!values.choice_count)
      values.choice_count = 4;
    if (values.choice_count < 2)
      values.choice_count = 2;
    if (values.choice_count > 5)
      values.choice_count = 5;

    next();
  },

  afterCreate: function(values, next) {
    next();
  },

  beforeUpdate: function(values, next) {
    next();
  },

  afterUpdate: function(values, next) {
    next();
  },

  beforeDestroy: function(values, next) {
    next();
  },

  afterDestroy: function(values, next) {
    next();
  }
};

