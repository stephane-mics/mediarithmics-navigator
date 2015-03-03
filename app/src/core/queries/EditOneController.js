define(['./module'], function () {

  'use strict';


  var module = angular.module('core/queries');

  // TODO retreive and use angular.module('keywords') instead ?

  module.controller('core/queries/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', '$state',
    function ($scope, $log, Restangular, Session, _, $stateParams, $location, $state) {
      var queryId = $stateParams.query_id;

      if (!queryId) {
        $scope.query = {};
        $scope.conditions = [];
      } else {
        Restangular.one("queries", queryId).get().then(function (query) {
          $scope.query = query;
          $scope.conditions = query.all("conditions").getList().$object;
        });
      }

      Restangular.all("selector_families").getList().then(function (families) {
        $scope.families = families;
      });
      $scope.updateFamily = function (family)  {
        Restangular.one("selector_families",family).all("values").getList().then(function (family) {
          $scope.family = family;
        });
      };

      $scope.addedCondition = {};

      $scope.addCondition = function (condition) {
        if (!queryId) {
          Restangular.all('queries').post($scope.query, {organisation_id: Session.getCurrentWorkspace().organisation_id}).then(function (q) {
            q.all("conditions").post(condition).then(function (r) {
              $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/queries/" + q.id);
            });
          });
        } else {

          $scope.conditions.post(condition).then(function (r) {
            $state.transitionTo($state.current, $stateParams, {
              reload: true, inherit: true, notify: true
            });
          });
        }

        return;
      };


      $scope.deleteCondition = function (condition) {
        Restangular.one('queries', queryId).all("conditions").one(condition.id).remove().then(function (r) {
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
        return;
      };


      $scope.done = function () {

        var promise = null;
        if (queryId) {
          promise = $scope.query.put();

        } else {
          promise = Restangular.all('queries').post($scope.query, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success() {
          $log.info("success");
          $location.path('/' + Session.getCurrentWorkspace().organisation_id + "/library/queries");
        }, function failure() {
          $log.info("failure");
        });

      };
      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/queries");
      };
    }


  ]);
});

