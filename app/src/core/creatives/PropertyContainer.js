(function () {
  'use strict';

  var module = angular.module('core/creatives');
  /*
   * Display Ad Container
   */

  module.factory("core/creatives/PropertyContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async",
    
    function($q, Restangular, IdGenerator, async) {

      var PropertyContainer = function PropertyContainer() {


      };

      return PropertyContainer;
    }
    
  ]);
})();


