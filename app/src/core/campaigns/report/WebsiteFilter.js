define(['./module'], function () {
  'use strict';

  var module = angular.module('core/campaigns/report');


  module.filter('website', function () {
    return function (input) {
      input = input || '';
      var out = input.replace(/site\:web\:/, "");
      return out;
    };
  });


});
