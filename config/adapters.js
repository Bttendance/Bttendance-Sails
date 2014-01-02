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
  'default': 'herokupostgresql',

  // In-memory adapter for DEVELOPMENT ONLY
  memory: {
    module: 'sails-memory'
  },

  // Persistent adapter for DEVELOPMENT ONLY
  // (data IS preserved when the server shuts down)
  disk: {
    module: 'sails-disk'
  },

  // MongoLab has lots of options and stable and we are using it.
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

  // Heroku Postgre SQL has connection limit up to 500
  // psql "dbname=d8n4i2f6q5clp2 host=ec2-54-225-88-13.compute-1.amazonaws.com user=u7nsa3j4q3ng05 password=pf3koh48m9br384km90u7kng962 port=5642 sslmode=require"
  herokupostgresql: {
    module   : 'sails-postgresql',
    host     : 'ec2-54-225-88-13.compute-1.amazonaws.com',
    port     : 5642,
    user     : 'u7nsa3j4q3ng05',
    password : 'pf3koh48m9br384km90u7kng962',
    database : 'd8n4i2f6q5clp2',
    ssl      : true
  }

};