/**
 * Default 404 (Not Found) handler
 *
 * If no route matches are found for a request, Sails will respond using this handler.
 * 
 * This middleware can also be invoked manually from a controller or policy:
 * Usage: res.notFound()
 */

module.exports[404] = function pageNotFound(req, res) {

  /*
   * NOTE: This function is Sails middleware-- that means that not only do `req` and `res`
   * work just like their Express equivalents to handle HTTP requests, they also simulate
   * the same interface for receiving socket messages.
   */

  var viewFilePath = '404';
  var statusCode = 404;
  var result = {
    status: statusCode
  };

  // If the user-agent wants a JSON response, send json
  if (req.wantsJSON) {
    console.log(result);
    return res.json(result, result.status);
  }

  res.status(result.status);
  res.render(viewFilePath, function (err) {
    // If the view doesn't exist, or an error occured, send json
    if (err) { return res.json(result, result.status); }

    // Otherwise, serve the `views/404.*` page
    res.render(viewFilePath);
  });

};

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