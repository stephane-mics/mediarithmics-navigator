define(['./module'], function (module) {

  'use strict';

  module.factory('core/datamart/common/Common', [
    '$state',
    function($state) {

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
        return $state.current.url.search(location.href) > -1;
      };

      locations.set = function(location) {
        locations.current = location;
      };

      locations.refresh = function() {
        var path = $state.current.url;
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

      /* Language mappings */

      var languageMapping = {};
      languageMapping.mappingTable = {
        'en': 'English',
        'fr': 'French',
        'es': 'Spanish'
      };
      languageMapping.map = function(key) {
        return this.mappingTable.hasOwnProperty(key) ? this.mappingTable[key] : key;
      };

      return { collections: collections, locations: locations, languageMapping: languageMapping };
    }
  ]);

});
