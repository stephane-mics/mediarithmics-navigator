define(['./module'], function (module) {
    'use strict';

    module.factory("core/datamart/queries/QueryContainer", [
        'Restangular', '$q', 'lodash', 'core/common/auth/Session', "async", 'core/common/promiseUtils', '$log', 'core/datamart/queries/common/Common',
        'core/datamart/query/QueryService',
        function (Restangular, $q, lodash, Session, async, promiseUtils, $log, Common, QueryService) {

            /**
             * CONDITION CONTAINER
             */

            var ConditionContainer = function ConditionContainer(value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                }
            };

            ConditionContainer.prototype.getSelectorLabel = function () {
                var condition = this.value;
                return QueryService.getPropertySelectorDisplayName(condition.property_selector_name, condition.property_selector_parameters, condition.property_selector_expression, condition.property_selector_label);
            };

            ConditionContainer.prototype.getSelectorValueType = function () {
                var condition = this.value;
                return QueryService.getPropertySelectorValueType(condition.property_selector_value_type, condition.property_selector_expression);
            };

            ConditionContainer.prototype.getFamilyName = function () {
                var condition = this.value;
                return QueryService.getSelectorFamilyName(condition.property_selector_family, condition.property_selector_family_parameter);
            };

            /**
             * ELEMENT CONTAINER
             */

            var ElementContainer = function ElementContainer(groupContainer, value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                }

                this.family = "";

                this.groupContainer = groupContainer;

                this.conditions = [];
                this.removedConditions = [];
            };

            ElementContainer.prototype.getLabel = function () {
                if (Common.elementLabels[this.family]){
                    return Common.elementLabels[this.family];
                }else {
                    return this.family;
                }
            };

            ElementContainer.prototype.allowedSelector = function(propertySelector){
                return this.family === QueryService.getSelectorFamilyName(propertySelector.selector_family, propertySelector.family_parameters);
            };

            ElementContainer.prototype.createCondition = function (propertySelector) {

                if (this.allowedSelector(propertySelector)){
                    var condition = {
                        property_selector_family: propertySelector.selector_family,
                        property_selector_id: propertySelector.id,
                        property_selector_name: propertySelector.selector_name,
                        property_selector_family_parameter: propertySelector.family_parameters,
                        property_selector_parameters: propertySelector.selector_parameters,
                        property_selector_value_type: propertySelector.value_type,
                        property_selector_expression: propertySelector.expression,
                        property_selector_label: propertySelector.label
                    };

                    this.conditions.push(new ConditionContainer(condition));
                } else {
                    $log.warn("selector family is not allowed here");
                }

            };

            ElementContainer.prototype.removeCondition = function (condition) {
                if (condition.id) {
                    this.removedConditions.push(condition);
                }
                var i = this.conditions.indexOf(condition);
                this.conditions.splice(i, 1);
            };

            ElementContainer.prototype.buildInfoResource = function () {
                return {conditions:Restangular.stripRestangular(this.conditions.map(function(condition){
                    return condition.value;
                }))};
            };

            ElementContainer.prototype.loadConditions = function () {
                var self = this;
                return this.value.all('conditions').getList().then(function (conditions) {
                    self.conditions = conditions.map(function(condition){
                        return new ConditionContainer(condition);
                    });

                    if (conditions.length > 0){
                        self.family = self.conditions[0].getFamilyName();
                    }

                    return self.conditions;
                });
            };

            ElementContainer.prototype.saveTasks = function () {
                var addConditions = lodash.filter(this.conditions, function (condition) {
                    return !condition.id;
                });

                var updateConditions = lodash.filter(this.conditions, function (condition) {
                    return condition.id;
                });

                var self = this;
                var pAddConditionTasks = lodash.map(addConditions, function (condition) {
                    return ElementContainer.addConditionTask(self, condition);
                });

                var pUpdateConditionTasks = lodash.map(updateConditions, function (condition) {
                    return ElementContainer.updateConditionTask(condition);
                });

                var pDeleteConditionTasks = lodash.map(this.removedConditions, function (condition) {
                    return ElementContainer.deleteConditionTask(condition);
                });

                var pList = [];
                pList = pList.concat(pDeleteConditionTasks);
                pList = pList.concat(pUpdateConditionTasks);
                pList = pList.concat(pAddConditionTasks);

                return pList;
            };

            ElementContainer.updateConditionTask = function (condition) {
                return function (callback) {
                    $log.info("update condition : ", condition.id);
                    var promise = condition.value.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            ElementContainer.addConditionTask = function (elementContainer, condition) {
                return function (callback) {
                    $log.info("saving condition on elementId : " + elementContainer.id + ', ', condition.value);
                    var datamartId = elementContainer.groupContainer.queryContainer.datamartId;
                    var queryId = elementContainer.groupContainer.queryContainer.id;
                    var groupId = elementContainer.groupContainer.id;
                    var elementId = elementContainer.id;
                    var conditionsEndpoint = Restangular
                        .one('datamarts', datamartId)
                        .one('queries', queryId)
                        .one('groups', groupId)
                        .one('elements', elementId)
                        .all('conditions');

                    var promise = conditionsEndpoint.post(condition.value);
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            ElementContainer.deleteConditionTask = function (condition) {
                return function (callback) {
                    $log.info("delete condition : ", condition.id);
                    var promise = condition.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            /**
             * GROUP CONTAINER
             */

            var GroupContainer = function GroupContainer(queryContainer, value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                } else {
                    this.value = {excluded: false};
                }

                this.queryContainer = queryContainer;

                this.elementContainers = [];
                this.removedElementContainers = [];
            };

            GroupContainer.prototype.toggleExclude = function () {
                this.value.excluded = !this.value.excluded;
            };

            GroupContainer.prototype.loadElements = function () {
                var self = this;
                return this.value.all('elements').getList().then(function (elements) {
                    return $q.all(lodash.map(elements, function(element){
                        var elementContainer = new ElementContainer(self,element);
                        self.elementContainers.push(elementContainer);
                        return elementContainer.loadConditions();
                    }));
                }).then(function () {
                    return self;
                });
            };

            GroupContainer.prototype.removeElementContainer = function (element) {
                if (element.id) {
                    this.removedElementContainers.push(element);
                }
                var i = this.elementContainers.indexOf(element);
                this.elementContainers.splice(i, 1);
            };

            GroupContainer.prototype.createElementWithCondition = function (propertySelector) {

                var condition = {
                    property_selector_family: propertySelector.selector_family,
                    property_selector_id: propertySelector.id,
                    property_selector_name: propertySelector.selector_name,
                    property_selector_family_parameter: propertySelector.family_parameters,
                    property_selector_parameters: propertySelector.selector_parameters,
                    property_selector_value_type: propertySelector.value_type,
                    property_selector_expression: propertySelector.expression,
                    property_selector_label: propertySelector.label
                };

                var elementContainer = new ElementContainer(this);
                elementContainer.family = QueryService.getSelectorFamilyName(propertySelector.selector_family, propertySelector.family_parameters);
                elementContainer.conditions.push(new ConditionContainer(condition));

                this.elementContainers.push(elementContainer);
            };

            GroupContainer.prototype.saveTasks = function () {
                var addElementContainers = lodash.filter(this.elementContainers, function (elementContainer) {
                    return !elementContainer.id;
                });

                var updateElementContainers = lodash.filter(this.elementContainers, function (elementContainer) {
                    return elementContainer.id;
                });

                var pAddElementTasks = lodash.map(addElementContainers, function (elementContainer) {
                    return GroupContainer.addElementWithConditionsTask(elementContainer, elementContainer.conditions);
                });

                var pDeleteElementTasks = lodash.map(this.removedElementContainers, function (elementContainer) {
                    return GroupContainer.deleteElementTask(elementContainer);
                });

                var pElementTasks = lodash.flatten(lodash.map(updateElementContainers, function (elementContainer) {
                    return elementContainer.saveTasks();
                }));

                var pList = [];
                pList = pList.concat(pAddElementTasks);
                pList = pList.concat(pDeleteElementTasks);
                pList = pList.concat(pElementTasks);

                return pList;
            };

            GroupContainer.addElementWithConditionsTask = function (elementContainer, conditions) {
                return function (callback) {
                    $log.info("saving a new element");

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    var datamartId = elementContainer.groupContainer.queryContainer.datamartId;
                    var queryId = elementContainer.groupContainer.queryContainer.id;
                    var groupId = elementContainer.groupContainer.id;

                    var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);
                    var pElement = queryEndpoint.one('groups',groupId).all('elements').post();

                    pElement.then(function success (savedElement) {
                        var pConditions = lodash.map(conditions, function (condition) {
                            return ElementContainer.addConditionTask(new ElementContainer(elementContainer.groupContainer, savedElement), condition);
                        });
                        async.series(pConditions, function (err, res) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(savedElement);
                            }
                        });

                    }, function error(reason) {
                        deferred.reject(reason);
                    });

                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            GroupContainer.deleteElementTask = function (elementContainer) {
                return function (callback) {
                    $log.info("delete element : ", elementContainer.id);
                    var promise = elementContainer.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            GroupContainer.prototype.buildInfoResource = function () {
                var _elements = lodash.map(this.elementContainers, function(elementContainer){
                    return elementContainer.buildInfoResource();
                });
                return {
                    excluded:this.value.excluded,
                    elements:_elements
                };
            };

            /**
             * SELECTED VALUE CONTAINER
             */

            var SelectedValueContainer = function SelectedValueContainer(value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                }
            };

            SelectedValueContainer.prototype.getSelectorLabel = function () {
                var selectorSelection = this.value;
                return QueryService.getPropertySelectorDisplayName(selectorSelection.selector_name, selectorSelection.selector_parameters, null, selectorSelection.label);
            };

            SelectedValueContainer.prototype.getFamilyName = function () {
                var selectorSelection = this.value;
                return QueryService.getSelectorFamilyName(selectorSelection.selector_family, selectorSelection.family_parameters);
            };

            SelectedValueContainer.prototype.addExpression = function (expression) {
                if (QueryService.isExpressionApplicable(this, expression)){
                    this.value.expression = expression.name;
                }
            };


            /**
             * QUERY CONTAINER
             */

            var QueryContainer = function QueryContainer(datamartId) {

                this.datamartId = datamartId;

                this.selectedValues = [];
                this.removedSelectedValues = [];

                this.groupContainers = [];
                this.removedGroupContainers = [];
            };

            QueryContainer.prototype.load = function (queryId) {

                var queryEndpoint = Restangular.one('datamarts', this.datamartId).one('queries', queryId);

                var pQuery = queryEndpoint.get();
                var pGroups = queryEndpoint.all('groups').getList();
                var pSelectedValues = queryEndpoint.all('property_selectors').getList();
                var self = this;

                return $q.all([pQuery, pGroups, pSelectedValues]).then(function (result) {

                    self.id = queryId;
                    self.value = result[0];

                    self.groupContainers = lodash.sortBy(result[1], function (group) {
                        return group.id;
                    }).map(function (group) {
                        return new GroupContainer(self, group);
                    });

                    var elementsP = lodash.map(self.groupContainers, function (groupContainer) {
                        return groupContainer.loadElements();
                    });

                    self.selectedValues = result[2].map(function (selectedValue){
                        return new SelectedValueContainer(selectedValue);
                    });

                    return $q.all(elementsP).then(function () {
                        return self;
                    });

                });
            };

            QueryContainer.prototype.addGroupContainer = function () {
                this.groupContainers.push(new GroupContainer(this));
            };

            QueryContainer.prototype.removeGroupContainer = function (groupContainer) {
                if (groupContainer.id) {
                    this.removedGroupContainers.push(groupContainer);
                }
                var i = this.groupContainers.indexOf(groupContainer);
                this.groupContainers.splice(i, 1);
            };

            QueryContainer.prototype.createSelectedValue = function (propertySelector) {

                var selectedValue = {
                    selector_family: propertySelector.selector_family,
                    selector_name: propertySelector.selector_name,
                    family_parameters: propertySelector.family_parameters,
                    selector_parameters: propertySelector.selector_parameters,
                    value_type: propertySelector.value_type,
                    property_selector_id: propertySelector.id,
                    expression: propertySelector.expression,
                    label: propertySelector.label
                };

                var selectedValueContainer = new SelectedValueContainer(selectedValue);
                selectedValueContainer.wrapperEvaluationType = propertySelector.wrapper_evaluation_type;

                var alreadySelected = lodash.find(this.selectedValues, function (selector) {
                    return selector.property_selector_id === propertySelector.id;
                });
                if (!alreadySelected){
                    this.selectedValues.push(selectedValueContainer);
                }
            };

            QueryContainer.prototype.removeSelectedValue = function (selectedValue) {
                this.removedSelectedValues.push(selectedValue);

                var i = this.selectedValues.indexOf(selectedValue);
                this.selectedValues.splice(i, 1);
            };

            QueryContainer.prototype.save = function () {
                var self = this;
                if (!self.id){
                    return Restangular.one('datamarts', self.datamartId).all('queries').post().then(function(query) {
                        self.id = query.id;
                        return self.update();
                    });
                } else {
                    return self.update();
                }


            };

            QueryContainer.prototype.update = function() {
                var self = this;
                var addGroupContainers = lodash.filter(this.groupContainers, function (groupContainer) {
                    return !groupContainer.id;
                });

                var updateGroupContainers = lodash.filter(this.groupContainers, function (groupContainer) {
                    return groupContainer.id;
                });

                var pAddGroupTasks = lodash.map(addGroupContainers, function (groupContainer) {
                    return QueryContainer.addGroupTask(groupContainer);
                });

                var pUpdateGroupTasks = lodash.map(updateGroupContainers, function (groupContainer) {
                    return QueryContainer.updateGroupTask(groupContainer);
                });

                var pDeleteGroupTasks = lodash.map(this.removedGroupContainers, function (groupContainer) {
                    return QueryContainer.deleteGroupTask(groupContainer);
                });

                var pGroupTasks = lodash.flatten(lodash.map(updateGroupContainers, function (groupContainer) {
                    return groupContainer.saveTasks();
                }));

                var addPropertySelectors = lodash.filter(this.selectedValues, function (selectedValue) {
                    return !selectedValue.id;
                });

                var pAddPropertySelectorTasks = lodash.map(addPropertySelectors, function (selectedValue) {
                    return QueryContainer.addPropertySelectorTask(self, selectedValue);
                });

                var pDeletePropertySelectorTasks = lodash.map(this.removedSelectedValues, function (selectedValue) {
                    return QueryContainer.removePropertySelectorTask(selectedValue);
                });

                var deferred = $q.defer();
                var promise = deferred.promise;

                var pList = [];
                pList = pList.concat(pAddGroupTasks);
                pList = pList.concat(pDeleteGroupTasks);
                pList = pList.concat(pUpdateGroupTasks);
                pList = pList.concat(pGroupTasks);
                pList = pList.concat(pAddPropertySelectorTasks);
                pList = pList.concat(pDeletePropertySelectorTasks);

                async.series(pList, function (err, res) {
                    if (err) {
                        deferred.reject(err);
                    } else {
                        deferred.resolve(self);
                    }
                });

                return promise;
            };

            QueryContainer.addGroupTask = function (groupContainer) {
                return function (callback) {
                    $log.info("saving group : ", groupContainer.value);

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    var datamartId = groupContainer.queryContainer.datamartId;
                    var queryId = groupContainer.queryContainer.id;

                    var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);
                    var pGroup = queryEndpoint.all('groups').post(groupContainer.value);

                    pGroup.then(function success (savedGroup) {
                        var pElements = lodash.map(groupContainer.elementContainers, function (elementContainer) {
                            var saveGroupContainer = new GroupContainer(groupContainer.queryContainer, savedGroup);
                            return GroupContainer.addElementWithConditionsTask(new ElementContainer(saveGroupContainer), elementContainer.conditions);
                        });
                        async.series(pElements, function (err, res) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(savedGroup);
                            }
                        });

                    }, function error(reason) {
                        deferred.reject(reason);
                    });

                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.addPropertySelectorTask = function (queryContainer, propertySelector) {
                return function (callback) {
                    $log.info("saving property selector on queryId : " + queryContainer.id + ', ', propertySelector.value);
                    var datamartId = queryContainer.datamartId;
                    var queryId = queryContainer.id;
                    var propertySelectorsEndpoint = Restangular
                        .one('datamarts', datamartId)
                        .one('queries', queryId)
                        .all('property_selectors');

                    var promise = propertySelectorsEndpoint.post(propertySelector.value);
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.removePropertySelectorTask = function (propertySelector) {
                return function (callback) {
                    $log.info("delete property selector : ", propertySelector.id);
                    var promise = propertySelector.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.updateGroupTask = function (groupContainer) {
                return function (callback) {
                    $log.info("update group : ", groupContainer.id);
                    var promise = groupContainer.value.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.deleteGroupTask = function (groupContainer) {
                return function (callback) {
                    $log.info("delete group : ", groupContainer.id);
                    var promise = groupContainer.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.prototype.prepareJsonQuery = function () {
                var _groups = lodash.map(this.groupContainers, function(groupContainer){
                    return groupContainer.buildInfoResource();
                });
                return {
                  /*id:this.id,*/
                  datamart_id:this.datamartId,
                  groups:_groups,
                  property_selector_selections:this.selectedValues.map(function (container){
                      return container.value;
                  })
                };
            };

            return QueryContainer;
        }

    ]);
});
