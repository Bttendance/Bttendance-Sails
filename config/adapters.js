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

 // if (req.wantsJSON) {
 //    console.log("json");
 //    console.log(response);
 //    var message = response.errors[0].message;
 //    if (!durableJsonLint(message).json)
 //      return res.json({error : message}, response.status);
 //    else {
 //      var messageJson = JSON.parse(durableJsonLint(message).json);
 //      if (messageJson.ValidationError) {
 //        var ValidationError = messageJson.ValidationError;
 //        var ValidationAttribute = Object.keys(ValidationError)[0];

 //        if (!ValidationAttribute)
 //          return res.json({error : errorMessage}, response.status);
 //        else {
 //          var AlertMessage, ToastMessage, UUIDMessage;
 //          switch (ValidationAttribute) {
 //            case username:
 //              ToastMessage = "Username "
 //              break;
 //            case password:
 //              ToastMessage = "Password "
 //              break;
 //            case device_uuid:
 //              UUIDMessage = "Username "
 //              break;
 //            default:
 //              break;
 //          }
 //          return res.json({error : errorMessage, alert : AlertMessage, toast : ToastMessage, uuid : UUIDMessage}, response.status);
 //        }
 //      } else {
 //        return res.json({error : durableJsonLint(message).json}, response.status);
 //      }
 //    }
 //  }

 // if (req.wantsJSON) {
 //    var message = response.errors[0].message;
 //    if (!durableJsonLint(message).json)
 //      return res.json({error : message}, response.status);
 //    else {
 //      var messageJson = durableJsonLint(message).json;
 //      console.log("message");
 //      console.log(messageJson);
 //      return res.json({error : durableJsonLint(message).json}, response.status);
 //    }
 //  }

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