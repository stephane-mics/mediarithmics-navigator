define(['./module'], function (module) {

  'use strict';

  module.factory('core/datamart/common/Common', [
    '$state', '$stateParams',
    function($state, $stateParams) {

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
        { href: $stateParams.organisation_id + '/datamart/users', name: 'Users'},
        { href: $stateParams.organisation_id + '/datamart/categories/', name: 'Categories'},
        { href: $stateParams.organisation_id + '/datamart/items', name: 'Items' },
        { href: $stateParams.organisation_id + '/datamart/queries', name: 'Queries' }
      ];

      locations.isCurrent = function(location) {
        return locations.current.href.search(location.href) > -1;
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

      var propertySelectorOperators = {
        "STRING": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"is not"},
          {operator:"CONTAINS", label:"contains"},
          {operator:"NOT_CONTAINS", label:"doesn't contain"},
          {operator:"START_WITH", label:"start with"},
          {operator:"NOT_START_WITH", label:"doesn't start with"}],
        "NUMBER": [
          {operator:"EQUAL", label:"="},
          {operator:"NOT_EQUAL", label:"!="},
          {operator:"GT", label:">"},
          {operator:"GTE", label:">="},
          {operator:"LT", label:"<"},
          {operator:"LTE", label:"<="}],
        "DATE": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"is not"},
          {operator:"GT", label:"after"},
          {operator:"GTE", label:"after or equal"},
          {operator:"LT", label:"before"},
          {operator:"LTE", label:"before or equal"},
          {operator:"RELATIVE_GT", label:"more than"},
          {operator:"RELATIVE_LT", label:"less than"},
          {operator:"BETWEEN", label:"between date"}],
        "BOOLEAN": [
          {operator:"EQUAL", label:"is"},
          {operator:"NOT_EQUAL", label:"not"}]
      };

      return { collections: collections, locations: locations, languageMapping: languageMapping, propertySelectorOperators: propertySelectorOperators };
    }
  ]);

});
