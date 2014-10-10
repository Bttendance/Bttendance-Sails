/**
* Comment.js
*
* @description :: TODO: You might write a short summary of how this model works and what it represents here.
* @docs        :: http://sailsjs.org/#!documentation/models
*/

module.exports = {

  attributes: {

    // One Way
    author: {
      model: 'User',
      required: true
    },

    message: {
      type: 'string',
      required: true
    },

    post: {
      model: 'Post'
    },

    toSimpleJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      delete obj.createdAt;
      delete obj.updatedAt;
      if (this.post)
        obj.post = this.post.id;
      return obj;
    },

    toWholeJSON: function() {
      var json = JSON.stringify(this);
      var obj = JSON.parse(json);
      if (this.post)
        obj.post = this.post.toSimpleJSON();
      return obj;
    }
  }
  
};

