define(['./module'], function (module) {
    'use strict';

    module.factory("core/datamart/queries/CriteriaContainer", [
        'Restangular', '$q', 'lodash', 'core/common/auth/Session', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/common/Common',
        'core/datamart/query/QueryService',
        function (Restangular, $q, lodash, Session, async, promiseUtils, $log, Common, QueryService) {

            var CriteriaContainer = function () {
                this.families = [];
            };

            CriteriaContainer.prototype.filter = function(str) {
                //TODO filter selectors by label
            };

            CriteriaContainer.prototype.findPropertySelector = function(selectorId) {
                var foundSelector = "";
                this.families.forEach(function (family){
                    var selector = lodash.find(family.selectors, function(selector){
                        return selector.id === selectorId;
                    });
                   if (selector) {
                       foundSelector = selector;
                   }
                });
                return foundSelector;
            };

            CriteriaContainer.loadPropertySelectors = function(selectors) {
                var criteriaContainer = new CriteriaContainer();

                var selectorContainers = selectors.map(function(selector){
                    return new PropertySelectorContainer(selector);
                });

                var byFamilySelectorContainers = lodash.groupBy(selectorContainers, function(selectorContainer){
                   return selectorContainer.familyName;
                });

                criteriaContainer.families = Object.keys(byFamilySelectorContainers).map(function (familyName) {
                    return new FamilyContainer(familyName, byFamilySelectorContainers[familyName]);
                });

                return criteriaContainer;
            };

            var FamilyContainer = function (familyName, propertySelectorContainers) {
                this.id = familyName.replace(/\s/g, '_');
                this.name = familyName;
                this.selectors = propertySelectorContainers;
            };

            var PropertySelectorContainer = function (value) {
                this.value = value;
                this.id = value.id;
                this.label = QueryService.getPropertySelectorDisplayName(value.selector_name, value.selector_parameters, value.expression, value.label);
                this.familyName = QueryService.getSelectorFamilyName(value.selector_family, value.family_parameters);
            };

            return CriteriaContainer;

        }
    ]);
});