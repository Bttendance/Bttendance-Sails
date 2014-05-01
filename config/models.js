/**
 * Models
 * (sails.config.models)
 *
 * Unless you override them, the following properties will be included
 * in each of your models.
 */

var connections = require('./connections');

module.exports.models = {
 
  // Your app's default connection.
  // i.e. the name of one of your app's connections (see `config/connections.js`)
  connection: connections.getPostgres(),

  // When sails lift it migrate whole database from server to local 
  // and create and update database as model 
  // and migrate back to server
  // so set it safe if you want to skip this process
  // migrate: 'safe'

};
