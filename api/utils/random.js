'use strict';

/**
 * Random.js
 *
 * @module			:: Random String Generator
 * @description	:: Generate Random String
 *
 */

module.export = {
  string: function (length) {
    var text = "",
        possible = "abcdefghijklmnopqrstuvwxyz0123456789";

    for (var i = 0; i < length; i++) {
      text += possible.charAt(Math.floor(Math.random() * possible.length));
    }

    return text;
  }
};
