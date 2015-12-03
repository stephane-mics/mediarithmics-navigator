define(['./module'], function (module) {
  'use strict';

  /**
   * DISPLAY CAMPAIGN SERVICE
   */
  /* define the Authentication service */
  module.factory('core/datamart/query/QueryService', [
    '$q', 'lodash', 'Restangular', '$log', 'core/common/auth/Session', 'core/datamart/queries/common/Common',
    function ($q, _, Restangular, $log, Session, Common) {

      var service = {};

      service.getPropertySelectorDisplayName = function(selectorName, selectorParameter, selectorExpression, selectorLabel) {
          var name = selectorName;
          if (selectorName === 'CUSTOM_PROPERTY' || selectorName === 'CUSTOM_EVENT'){
              name = selectorParameter;
          }
          if (selectorExpression){
              name = name + "_" + selectorExpression.toLowerCase();
          }
          if (selectorLabel){
              name = selectorLabel;
          }
          return name;
      };

      service.getSelectorFamilyName = function(selectorFamily, familyParameter){
          if (selectorFamily === 'USER_EVENTS'){
              return familyParameter;
          } else if (Common.familyLabels[selectorFamily]) {
              return Common.familyLabels[selectorFamily];
          } else {
              return selectorFamily;
          }
      };

      service.getPropertySelectorValueType = function(type, expression){
          if (expression && expression === 'COUNT'){
              //an expression applied to a selector (eg: count(items_viewed))
              //change type from LIST_OF_STRINGS to INTEGER
              return 'INTEGER';
          } else {
              return type;
          }
      };

      return service;
    }
  ]);
});
