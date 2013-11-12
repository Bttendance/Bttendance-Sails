/**
 * Global adapter config
 * 
 * The `adapters` configuration object lets you create different global "saved settings"
 * that you can mix and match in your models.  The `default` option indicates which 
 * "saved setting" should be used if a model doesn't have an adapter specified.
 *
 * Keep in mind that options you define directly in your model definitions
 * will override these settings.
 *
 * For more information on adapter configuration, check out:
 * http://sailsjs.org/#documentation
 */

module.exports.adapters = {

  // If you leave the adapter config unspecified 
  // in a model definition, 'default' will be used.
  'default': 'mongolab',

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MySQL is the world's most popular relational database.
  // Learn more: http://en.wikipedia.org/wiki/MySQL
  mysql: {

    module: 'sails-mysql',
    host: 'us-cdbr-east-04.cleardb.com',
    user: 'b103f3b96d3f8c',
    // Psst.. You can put your password in config/local.js instead
    // so you don't inadvertently push it up if you're using version control
    password: 'e0cca0b9', 
    database: 'heroku_041cfbc7e4fa742'
  },

  // MONGOLAB_URI: mongodb://<dbuser>:<dbpassword>@ds053858.mongolab.com:53858/heroku_app18988288
  // mongo heroku_app18988288 --host ds053858.mongolab.com --port 53858 --username bttendance --password dsa372je382k8sgqa4hadm2g6g
  mongolab: {
    module   : 'sails-mongo',
    host     : 'ds053858.mongolab.com',
    port     : 53858,
    user     : 'utopia',
    password : 'dsa372je382k8sgqa4hadm2g6g',
    database : 'heroku_app18988288'
  },

  // mongo paulo.mongohq.com:10041/app18988288 -u utopia -p dsa372je382k8sgqa4hadm2g6g
  mongohq: {
    module   : 'sails-mongo',
    host     : 'paulo.mongohq.com',
    port     : 10041,
    user     : 'utopia',
    password : 'dsa372je382k8sgqa4hadm2g6g',
    database : 'app18988288'
  },

  // psql "dbname=d3f5bptpql8lqm host=ec2-107-22-190-179.compute-1.amazonaws.com user=mmynrzfrioignx password=panCrKVx8RcM-yz6lJDw9NghNl port=5432 sslmode=require"
  herokupostgresql: {
    module   : 'sails-postgresql',
    host     : 'ec2-107-22-190-179.compute-1.amazonaws.com',
    port     : 5432,
    user     : 'mmynrzfrioignx',
    password : 'panCrKVx8RcM-yz6lJDw9NghNl',
    database : 'd3f5bptpql8lqm',
    ssl      : true
  }

};