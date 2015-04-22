define(['./module'], function () {

  'use strict';


  var module = angular.module('core/queries');


  module.filter('mcsEnumLabel', function () {
      return function (input) {
        return  (input.toLowerCase().charAt(0).toUpperCase() + input.toLowerCase().substring(1)).replace(/_/g, ' ');
      };

    });
});

