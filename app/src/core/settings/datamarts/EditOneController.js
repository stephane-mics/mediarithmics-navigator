define(['./module', 'jquery'], function(module, $) {
  'use strict';

  module.controller('core/settings/datamarts/EditOneController', [
    '$scope', '$log', '$location', '$state', '$stateParams', '$uibModal', '$filter', '$q', 'Restangular', 'core/common/auth/Session', 'lodash',
    'core/common/ErrorService', 'core/common/WarningService',
    function($scope, $log, $location, $state, $stateParams, $uibModal, $filter, $q, Restangular, Session, _, ErrorService, WarningService) {
      var datamartId = Session.getCurrentDatamartId();
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.editMode = true;
      $scope.rules = [];
      $scope.originalRulesIds = [];

      /**
       * Watchers
       */
      $scope.$watchGroup(["datamartId", "organisationId"], function(values) {
        if (values && $stateParams.datamartId) {

          Restangular.one("datamarts/" + datamartId).get({
            organisation_id: organisationId
          }).then(function(datamart) {
            $scope.datamart = datamart;
            if (datamart.token !== null) {
              $scope.datamartToken = datamart.token;
            }

          });

          Restangular.all("datamarts/" + datamartId + "/event_rules").getList({
            organisation_id: organisationId
          }).then(function(rules) {
            _.forEach(rules, function(rule) {
              $scope.originalRulesIds.push(rule.id);
            });
            $scope.rules = rules;
            $scope.selectedRule = undefined;
          });

        }
      });


      /**
       * Helpers
       */

      function removeRules() {
        var finalIds = _.pluck($scope.rules, 'id');
        return _.forEach($scope.originalRulesIds, function(id) {
          if (finalIds.indexOf(id) === -1) {
            return Restangular.all("datamarts/" + datamartId + "/event_rules/" + id).remove({
              organisation_id: organisationId
            });
          }
        });
      }

      function upsertRules() {
        return _.map($scope.rules, function(elem) {

          if (elem.id === undefined) {
            var rule = {
              organisation_id: organisationId,
              properties: elem
            };
            return Restangular.all("datamarts/" + datamartId + "/event_rules").post(rule);
          } else {
            return Restangular.all("datamarts/" + datamartId + "/event_rules/" + elem.id).customPUT(elem, undefined, {
              organisation_id: organisationId
            });
          }
        });
      }

      function handleDatamartError(e) {
        if ($scope.datamartToken === undefined) {
          ErrorService.showErrorModal({
            error: {
              message: "This datamart token is already taken."
            }
          });
        } else {
          ErrorService.showErrorModal(e);
        }
      }

      function sendSiteEdit() {
        $q.all(_.flatten([
          removeRules(),
          upsertRules(),
          Restangular.all("datamarts/" + datamartId).customPUT($scope.datamart, undefined, {
            organisation_id: organisationId
          })
          .catch(handleDatamartError)
        ])).then(function() {
          $location.path("/" + organisationId + "/settings/datamarts");
        }).catch(function(e) {
          ErrorService.showErrorModal(e);
        });
      }


      // ---------------- DATAMART ----------------

      $scope.cancel = function() {
        $location.path("/" + organisationId + "/settings/datamarts");
      };

      $scope.done = function() {
        if ($scope.editMode) {
          if ($scope.datamartToken !== $scope.datamart.token) {
            WarningService.showWarningModal("A site token is already set. Are you sure that you want to override it?").then(sendSiteEdit, function() {
              $scope.datamart.token = $scope.datamartToken;
            });
          } else {
            sendSiteEdit();
          }
        } else {
          Restangular.all("datamarts/" + datamartId).post($scope.datamart).then(function(datamart) {
            $scope.rules.forEach(function(ruleInfo) {
              var rule = {
                organisation_id: organisationId,
                properties: ruleInfo
              };
              Restangular.all("datamarts/" + datamartId + "/event_rules").post(rule);
            });

            $location.path("/" + organisationId + "/settings/datamarts");

          }, handleDatamartError);
        }
      };
    }
  ]);
});