define(['./module'], function (module) {
  'use strict';

  /**
   * Display Ad Property Container
   */

  module.factory("core/creatives/PropertyContainer", [
    "$q", "Restangular",

    function($q, Restangular) {

      var PropertyContainer = function PropertyContainer(property) {
        this.value = property;
        this.id = property.id;
      };

      PropertyContainer.prototype.update = function update() {
        var deferred = $q.defer();
        this.value.put().then(function(property) {
          deferred.resolve(property);
        }, function(reason) {
          deferred.reject(reason);
        });
        return deferred.promise;
      };

      PropertyContainer.prototype.persist = function persist(creativeId) {
        return Restangular.one("display_ads", creativeId).one("renderer_properties").customPUT([this.value]);
      };

      return PropertyContainer;
    }
  ]);
});


