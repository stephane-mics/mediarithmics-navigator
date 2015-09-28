define(['./module','moment-duration-format', 'moment'], function (module, momentDuration, moment) {
  'use strict';

  module.filter('humanDuration', function () {
    return function (input) {
      if (typeof input === "undefined") {
        return "";
      }

      return moment.duration(input,'seconds').format("d[d] h[h] m[m] s[s]");
    };
  });


});
