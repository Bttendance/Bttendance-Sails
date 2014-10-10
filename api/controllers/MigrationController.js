/**
 * MigrationController
 *
 * @description :: Server-side logic for managing migrations
 * @help        :: See http://links.sailsjs.org/docs/controllers
 */

// For Develop (Drop all table and add new)
// psql "dbname=d9vocafm0kncoe host=ec2-54-204-42-178.compute-1.amazonaws.com user=neqpefgtcbgyym password=ub0oR3o9VsAbGsuiYarNsx4yqw port=5432 sslmode=require"
// heroku pgbackups:restore HEROKU_POSTGRESQL_MAROON 'https://s3-ap-northeast-1.amazonaws.com/herokubackup/b212.dump' --app bttendance-dev

// For Production
// heroku maintenance:on
// heroku ps:scale worker=0

/**** Do work ****/

// heroku ps:scale worker=1
// heroku maintenance:off

// 1. sails lift (migration alter)
// 2. migrate api

var Random = require('../utils/random');
var Arrays = require('../utils/arrays');

module.exports = {

	migrate: function(req, res) {
	}
	
};

