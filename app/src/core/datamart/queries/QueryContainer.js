define(['./module'], function (module) {
    'use strict';

    module.factory("core/datamart/queries/QueryContainer", [
        'Restangular', '$q', 'lodash', 'core/common/auth/Session', "async", 'core/common/promiseUtils', '$log',

        function (Restangular, $q, lodash, Session, async, promiseUtils, $log) {

            var ConditionGroupContainer = function ConditionGroupContainer(queryContainer, value) {
                if (value) {
                    this.value = value;
                    this.id = value.id;
                } else {
                    this.value = {excluded: false};
                }

                this.queryContainer = queryContainer;

                this.conditions = [];
                this.removedConditions = [];
            };

            ConditionGroupContainer.prototype.toggleExclude = function () {
                this.value.excluded = !this.value.excluded;
            };

            ConditionGroupContainer.prototype.loadConditions = function () {
                var self = this;
                return this.value.all('conditions').getList().then(function (conditions) {
                    self.conditions = conditions;
                    return self.conditions;
                });
            };

            ConditionGroupContainer.prototype.removeCondition = function (condition) {
                if (condition.id) {
                    this.removedConditions.push(condition);
                }
                var i = this.conditions.indexOf(condition);
                this.conditions.splice(i, 1);
            };

            ConditionGroupContainer.prototype.createCondition = function (propertySelector) {

                var condition = {
                    condition_group_id: this.id,
                    property_selector_family: propertySelector.selector_family,
                    property_selector_id: propertySelector.id,
                    property_selector_name: propertySelector.selector_name,
                    property_selector_parameters: propertySelector.selector_parameters,
                    property_selector_value_type: propertySelector.value_type
                };

                if (conditionIsAbsent(this.conditions, condition)) {
                    this.conditions.push(condition);
                }
            };

            var conditionIsAbsent = function (conditions, condition) {
                var found = lodash.find(conditions, function (cond) {
                    return cond.property_selector_id === condition.property_selector_id;
                });
                return !found;
            };

            ConditionGroupContainer.prototype.saveTasks = function () {
                var addConditions = lodash.filter(this.conditions, function (condition) {
                    return !condition.id;
                });

                var updateConditions = lodash.filter(this.conditions, function (condition) {
                    return condition.id;
                });

                var self = this;
                var pAddConditionTasks = lodash.map(addConditions, function (condition) {
                    return ConditionGroupContainer.addConditionTask(self, condition);
                });

                var pUpdateConditionTasks = lodash.map(updateConditions, function (condition) {
                    return ConditionGroupContainer.updateConditionTask(condition);
                });

                var pDeleteConditionTasks = lodash.map(this.removedConditions, function (condition) {
                    return ConditionGroupContainer.deleteConditionTask(condition);
                });

                var pList = [];
                pList = pList.concat(pDeleteConditionTasks);
                pList = pList.concat(pUpdateConditionTasks);
                pList = pList.concat(pAddConditionTasks);

                return pList;
            };

            ConditionGroupContainer.updateConditionTask = function (condition) {
                return function (callback) {
                    $log.info("update condition : ", condition.id);
                    var promise = condition.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            ConditionGroupContainer.addConditionTask = function (conditionGroupContainer, condition) {
                return function (callback) {
                    $log.info("saving condition on groupId : " + conditionGroupContainer.id + ', ', condition);
                    var conditionsEndpoint;
                    if (conditionGroupContainer.conditions.length === 0) {
                        var datamartId = conditionGroupContainer.queryContainer.datamartId;
                        var queryId = conditionGroupContainer.queryContainer.id;
                        var groupId = conditionGroupContainer.id;
                        conditionsEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId).one('condition_groups', groupId).all('conditions');
                    } else {
                        conditionsEndpoint = conditionGroupContainer.conditions;
                    }
                    var promise = conditionsEndpoint.post(condition);
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            ConditionGroupContainer.deleteConditionTask = function (condition) {
                return function (callback) {
                    $log.info("delete condition : ", condition.id);
                    var promise = condition.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            ConditionGroupContainer.prototype.buildInfoResource = function () {
                return {excluded:this.value.excluded,conditions:Restangular.stripRestangular(this.conditions)};
            };


            var QueryContainer = function QueryContainer(value) {
                if (value){
                    this.value = value;
                    this.datamartId = value.datamart_id;
                    this.id = value.id;
                }

                this.conditionGroupContainers = [];
                this.removedConditionGroupContainers = [];
            };

            QueryContainer.load = function (datamartId, queryId) {

                var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);

                var pQuery = queryEndpoint.get();
                var pConditionGroups = queryEndpoint.all('condition_groups').getList();

                return $q.all([pQuery, pConditionGroups]).then(function (result) {
                    //query
                    var queryContainer = new QueryContainer(result[0]);
                    //conditionGroups
                    queryContainer.conditionGroupContainers = lodash.sortBy(result[1], function (group) {
                        return group.id;
                    }).map(function (conditionGroup) {
                        return new ConditionGroupContainer(queryContainer, conditionGroup);
                    });

                    var conditionsP = lodash.map(queryContainer.conditionGroupContainers, function (groupContainer) {
                        return groupContainer.loadConditions();
                    });

                    return $q.all(conditionsP).then(function () {
                        return queryContainer;
                    });

                });
            };

            QueryContainer.prototype.addConditionGroup = function () {
                this.conditionGroupContainers.push(new ConditionGroupContainer(this));
            };

            QueryContainer.prototype.removeConditionGroup = function (conditionGroupContainer) {
                if (conditionGroupContainer.id) {
                    this.removedConditionGroupContainers.push(conditionGroupContainer);
                }
                var i = this.conditionGroupContainers.indexOf(conditionGroupContainer);
                this.conditionGroupContainers.splice(i, 1);
            };

            QueryContainer.prototype.save = function () {
                var addConditionGroupContainers = lodash.filter(this.conditionGroupContainers, function (conditionGroupContainer) {
                    return !conditionGroupContainer.id;
                });

                var updateConditionGroupContainers = lodash.filter(this.conditionGroupContainers, function (conditionGroupContainer) {
                    return conditionGroupContainer.id;
                });

                var pAddConditionGroupTasks = lodash.map(addConditionGroupContainers, function (conditionGroupContainer) {
                    return QueryContainer.addConditionGroupTask(conditionGroupContainer);
                });

                var pUpdateConditionGroupTasks = lodash.map(updateConditionGroupContainers, function (conditionGroupContainer) {
                    return QueryContainer.updateConditionGroupTask(conditionGroupContainer);
                });

                var pDeleteConditionGroupTasks = lodash.map(this.removedConditionGroupContainers, function (conditionGroupContainer) {
                    return QueryContainer.deleteConditionGroupTask(conditionGroupContainer);
                });

                var pConditionTasks = lodash.flatten(lodash.map(updateConditionGroupContainers, function (conditionGroupContainer) {
                    return conditionGroupContainer.saveTasks();
                }));

                var pList = [];
                pList = pList.concat(pAddConditionGroupTasks);
                pList = pList.concat(pDeleteConditionGroupTasks);
                pList = pList.concat(pUpdateConditionGroupTasks);
                pList = pList.concat(pConditionTasks);

                return async.series(pList);
            };

            QueryContainer.addConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("saving condition group : ", conditionGroupContainer.value);

                    var deferred = $q.defer();
                    var promise = deferred.promise;

                    var datamartId = conditionGroupContainer.queryContainer.datamartId;
                    var queryId = conditionGroupContainer.queryContainer.id;

                    var queryEndpoint = Restangular.one('datamarts', datamartId).one('queries', queryId);
                    var pConditionGroup = queryEndpoint.all('condition_groups').post(conditionGroupContainer.value);

                    pConditionGroup.then(function (savedGroup) {
                        var pConditions = lodash.map(conditionGroupContainer.conditions, function (condition) {
                            return ConditionGroupContainer.addConditionTask(new ConditionGroupContainer(conditionGroupContainer.queryContainer, savedGroup), condition);
                        });
                        async.series(pConditions, function (err, res) {
                            if (err) {
                                deferred.reject(err);
                            } else {
                                deferred.resolve(savedGroup);
                            }
                        });

                    });

                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.updateConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("update condition group : ", conditionGroupContainer.id);
                    var promise = conditionGroupContainer.value.put();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.deleteConditionGroupTask = function (conditionGroupContainer) {
                return function (callback) {
                    $log.info("delete condition group : ", conditionGroupContainer.id);
                    var promise = conditionGroupContainer.value.remove();
                    promiseUtils.bindPromiseCallback(promise, callback);
                };
            };

            QueryContainer.prototype.prepareJsonQuery = function () {
                var conditionGroups = lodash.map(this.conditionGroupContainers, function(conditionGroupContainer){
                    return conditionGroupContainer.buildInfoResource();
                });
                return {
                  /*id:this.id,*/
                  datamart_id:this.datamartId,
                  condition_groups:conditionGroups
                };
            };

            return QueryContainer;
        }

    ]);
});
