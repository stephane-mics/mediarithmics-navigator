(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.factory('core/datamart/common/Common', [
    '$route',
    function($route) {

      /* Utility methods for collections */

      var collections = {};
      collections.findById = function(collection, id) {
        var i = 0;
        while (i < collection.length && collection[i].id !== id) {
          i++;
        }
        var item = collection[i];
        return item;
      };

      /* Locations for navigation */

      var locations = {};
      locations.all = [
        { href: '/datamart/users', name: 'Users'},
        { href: '/datamart/categories/', name: 'Categories'},
        { href: '/datamart/items', name: 'Items' }
      ];

      locations.isCurrent = function(location) {
        return $route.current.$$route.originalPath.search(location.href) > -1;
      };

      locations.set = function(location) {
        locations.current = location;
      };

      locations.refresh = function() {
        var path = $route.current.$$route.originalPath;
        for (var i=0; i<locations.all.length; i++) {
          if (locations.all[i].href === path && locations.current !== locations.all[i]) {
            locations.current = locations.all[i];
            return true;
          }
        }
        return false;
      };

      // try to match current path to a known location
      if (!locations.refresh()) {
        locations.current = locations.all[0];
      }

      return { collections: collections, locations: locations };
    }
  ]);

})();
