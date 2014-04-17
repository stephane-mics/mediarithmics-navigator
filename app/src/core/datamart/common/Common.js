(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.factory('core/datamart/common/Common', [
    '$route',
    function($route) {

      // Locations for navs
      var locations = {};
      locations.all = [
        { href: '/datamart', name: 'Datamart' },
        { href: '/datamart/items', name: 'Items' },
        { href: '/datamart/categories/', name: 'Categories'},
        { href: '/datamart/users', name: 'Users'}
      ];

      locations.isCurrent = function(location) {
        return location.href === $route.current.$$route.originalPath;
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

      return { locations: locations };
    }
  ]);

})();
