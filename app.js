// Start sails and pass it command line arguments
require('newrelic');
require('sails').lift(require('optimist').argv);

var express = require('express');
var app = express.createServer(express.logger());
var port = process.env.PORT || 3000;
app.listen(port, function() {
  console.log("Listening on " + port);
});
