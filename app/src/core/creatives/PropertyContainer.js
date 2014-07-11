define(['./module.js'], function () {
  'use strict';

  var module = angular.module('core/creatives');
  /*
   * Display Ad Container
   */

  module.factory("core/creatives/PropertyContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async",
    
    function($q, Restangular, IdGenerator, async) {

      var PropertyContainer = function PropertyContainer(property) {

        this.value = property;
        this.id = property.id;

      };

      PropertyContainer.prototype.update = function update() {

          var deferred = $q.defer();

          var self = this;

          this.value.put().then(function(property) {
            deferred.resolve(property);

          }, function(reason) {
            deferred.reject(reason);

          });

          return deferred.promise;
      };      

      return PropertyContainer;
    }
    
  ]);
});


