define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/common');
  module.filter('offset', function() {
    return function(input, start) {
      if (!input) {
        return;
      }
      start = parseInt(start, 10);
      return input.slice(start);
    };
  });
});
