/**
 * Default 404 (not found) handler
 *
 * If no matches are found, Sails will respond using this handler:
 *
 * For more information on 404/notfound handling in Sails/Express, check out:
 * http://expressjs.com/faq.html#404-handling
 */

module.exports[404] = function pageNotFound(req, res, express404Handler) {

  var statusCode = 404;
  var result = {
    status: statusCode
  };

  // If the user-agent wants a JSON response, send json
  if (req.wantsJSON) {
    var message = response.errors[0].message;
    if (!durableJsonLint(message).json)
      return res.json({error : message}, response.status);
    else
      return res.json({error : durableJsonLint(message).json}, response.status);
  }

  // Otherwise, serve the `views/404.*` page
  var view = '404';
  res.render(view, result, function (err) {
    if (err) {
      return express404Handler();
    }
    res.render(view);
  });

};