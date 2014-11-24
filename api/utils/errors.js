'use strict';

/**
 * Errors.js
 *
 * @module			:: Json Handler
 * @description	:: Contains logic for error JSON handling.
 *
 *	{
 *   	"type" : "type", (log, toast, alert)
 *  	"title": "title",
 *   	"message": "message"
 *	}
 */

 module.exports = {

  log: function (req, title, message, param1, param2) {
    var url = req.url,
        log = url + ' : ' + title + ' : ' + message;

    if (param1) {
      log = log + ' : ' + param1;
    }
    if (param2) {
      log = log + ' : ' + param2;
    }

    sails.log.debug(log);

    var locale = req.param('locale');
    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    var json = {
      type: 'log',
      title: sails.__({ phrase: title, locale: locale }),
      message: sails.__({ phrase: message, locale: locale }, param1, param2)
    };

    return json;
  },

  toast: function (req, title, message, param1, param2) {
    var url = req.url,
        log = url + ' : ' + title + ' : ' + message;

    if (param1) {
      log = log + ' : ' + param1;
    }
    if (param2) {
      log = log + ' : ' + param2;
    }

    sails.log.warn(log);

    var locale = req.param('locale');
    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    var json = {
      type: 'toast',
      title: sails.__({ phrase: title, locale: locale }),
      message: sails.__({ phrase: message, locale: locale }, param1, param2)
    };

    return json;
  },

  alert: function (req, title, message, param1, param2) {
    var url = req.url,
        log = url + ' : ' + title + ' : ' + message;

    if (param1) {
      log = log + ' : ' + param1;
    }
    if (param2) {
      log = log + ' : ' + param2;
    }

    sails.log.error(log);

    var locale = req.param('locale');
    if (!locale || locale !== 'ko') {
      locale = 'en';
    }

    var json = {
      type: 'alert',
      title: sails.__({ phrase: title, locale: locale }),
      message: sails.__({ phrase: message, locale: locale }, param1, param2)
    };

    return json;
  }

};
