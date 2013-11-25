/**
 * Default 500 (Server Error) middleware
 *
 * If an error is thrown in a policy or controller, 
 * Sails will respond using this default error handler
 *
 * This middleware can also be invoked manually from a controller or policy:
 * res.serverError( [errors] )
 *
 *
 * @param {Array|Object|String} errors
 *      optional errors
 */

module.exports[500] = function serverErrorOccurred(errors, req, res) {

  /*
   * NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
   * work just like their Express equivalents to handle HTTP requests, they also simulate
   * the same interface for receiving socket messages.
   */

  var viewFilePath = '500',
      statusCode = 500,
      i, errorToLog, errorToJSON;

  var result = {
    status: statusCode
  };

  durableJsonLint = require('durable-json-lint');

  // Normalize a {String|Object|Error} or array of {String|Object|Error} 
  // into an array of proper, readable {Error}
  var errorsToDisplay = sails.util.normalizeErrors(errors);
  for (i in errorsToDisplay) {

    // Log error(s) as clean `stack`
    // (avoids ending up with \n, etc.)
    if ( errorsToDisplay[i].original ) {
      errorToLog = sails.util.inspect(errorsToDisplay[i].original);
    }
    else {
      errorToLog = errorsToDisplay[i].stack;
    }
    sails.log.error('Server Error (500)');
    sails.log.error(errorToLog);

    // Use original error if it exists
    errorToJSON = errorsToDisplay[i].original || errorsToDisplay[i].message;
    errorsToDisplay[i] = errorToJSON;
  }

  // Only include errors if application environment is set to 'development'
  // In production, don't display any identifying information about the error(s)
  if (sails.config.environment === 'development') {
    result.errors = errorsToDisplay;
  }

  // If the user-agent wants JSON, respond with JSON
  if (req.wantsJSON) {
    var AlertMessage, ToastMessage, UUIDMessage;
    var durable_result;
    if(durableJsonLint(JSON.stringify(result)).json){
      durable_result= durableJsonLint(JSON.stringify(result)).json;
    }
    else{
      durable_result = result;
    }
    console.log(durable_result);

    if(JSON.parse(durable_result).errors){
      if(JSON.parse(durable_result).errors[0].ValidationError){
        console.log("ValidationError");
        var ValidationError = JSON.parse(durable_result).errors[0].ValidationError;
        var ValidationAttribute = Object.keys(ValidationError)[0];

        switch(JSON.stringify(ValidationAttribute)){
          case '"username"':
            console.log(ValidationError.username[0].rule);
            AlertMessage = ValidationError.username[0].rule;
            break;
          case '"password"':
            console.log(ValidationError.password[0].rule);
            ToastMessage = ValidationError.password[0].rule;
            break;
          case '"device_uuid"':
            console.log(ValidationError.device_uuid[0].rule);
            ToastMessage = ValidationError.device_uuid[0].rule;
            break;
          default:
            break;
        }
        return res.json({message : result.errors, alert : AlertMessage, toast : ToastMessage, uuid : UUIDMessage}, result.status);
      }
      else{
        console.log("DuplicationError");
        var errorforparse = JSON.parse(durable_result).errors[0];
        var pasred_error = errorforparse.split(' ');
        var errforswitch = pasred_error[pasred_error.length - 1];

        switch (errforswitch) {
          case '"user_username_key"':
            AlertMessage = "Username";
            break;
          case '"user_email_key"':
            ToastMessage = "Email";
            break;
          case '"user_device_uuid_key"':
            UUIDMessage = "UUID";
            break;
          default:
            break;
        }
        console.log(AlertMessage);
        console.log(ToastMessage);
        console.log(UUIDMessage);
        return res.json({message : result.errors, alert : AlertMessage, toast : ToastMessage, uuid : UUIDMessage}, result.status);
      }
    }
    else{
      return res.json(result, result.status);
    }
    // return res.json(result, result.status);
  }

  // Set status code and view locals
  res.status(result.status);
  for (var key in result) {
    res.locals[key] = result[key];
  }
  // And render view
  res.render(viewFilePath, result, function (err) {
    // If the view doesn't exist, or an error occured, just send JSON
    if (err) { return res.json(result, result.status); }
    
    // Otherwise, if it can be rendered, the `views/500.*` page is rendered
    res.render(viewFilePath, result);
  });

};

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

 
