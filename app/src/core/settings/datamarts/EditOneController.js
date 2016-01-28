define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/settings/datamarts/EditOneController', [
    '$scope', '$log', '$location', '$state', '$stateParams', '$uibModal', '$filter', '$q', 'Restangular', 'core/common/auth/Session', 'lodash',
    'core/common/ErrorService', 'core/common/WarningService',
    function ($scope, $log, $location, $state, $stateParams, $uibModal, $filter, $q, Restangular, Session, _, ErrorService, WarningService) {
      var datamartId = Session.getCurrentDatamartId();
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.rulesPerPage = 20;
      $scope.aliasesPerPage = 20;
      $scope.rulesCurrentPage = 0;
      $scope.aliasesCurrentPage = 0;
      $scope.editMode = true;
      $scope.aliases = [];
      $scope.rules = [];
      $scope.eventTemplate = [];
      $scope.originalAliasesIds = [];
      $scope.originalRulesIds = [];
      $scope.ruleEditMode = false;
      $scope.ruleCreationMode = false;
      $scope.ruleTypes = {
        CATALOG_AUTO_MATCH: "Catalog Auto Match",
        USER_ACCOUNT_ID_INSERTION: "User Account Id Creation",
        URL_MATCH: "Url Match"
      };
      $scope.autoMatchTypes = {
        CATEGORY: "Category",
        PRODUCT: "Product",
        PRODUCT_AND_CATEGORY: "Product And Category"
      };
      $scope.hashFunctions = ["SHA_256", "MD5"];


      /**
       * Watchers
       */

      $scope.$watch('filteredRule', function (rule) {
        if (rule) {
          $scope.selectedRule = undefined;
        }
      });

      $scope.$watchGroup(["datamartId", "organisationId"], function (values) {
        if (values && $stateParams.datamartId) {

         Restangular.one("datamarts/" + datamartId ).get({organisation_id: organisationId}).then(function (datamart) {
          $scope.datamart = datamart;
          if (datamart.token !== null) {
            $scope.datamartToken = datamart.token;
            }

         });

          Restangular.all("datamarts/" + datamartId + "/event_rules").getList({organisation_id: organisationId}).then(function (rules) {
            _.forEach(rules, function (rule) {
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
        return _.forEach($scope.originalRulesIds, function (id) {
          if (finalIds.indexOf(id) === -1) {
            return Restangular.all("datamarts/" + datamartId + "/event_rules/" + id).remove({organisation_id: organisationId});
          }
        });
      }

      function upsertRules() {
        return _.map($scope.rules, function (elem) {

          if (elem.id === undefined) {
            var rule = {organisation_id: organisationId, properties: elem};
            return Restangular.all("datamarts/" + datamartId + "/event_rules").post(rule);
          } else {
            return Restangular.all("datamarts/" + datamartId + "/event_rules/" + elem.id).customPUT(elem, undefined, {organisation_id: organisationId});
          }
        });
      }

      function handleDatamartError(e) {
        if ($scope.datamartToken === undefined) {
          ErrorService.showErrorModal({error: {message: "This datamart token is already taken."}});
        } else {
          ErrorService.showErrorModal(e);
        }
      }

      function resetRuleEdit() {
        if ($scope.ruleCreationMode) {
          $scope.selectedRule = undefined;
          $scope.tmpRule = undefined;
          $scope.tmpRuleProperties = undefined;
        } else {
          $scope.tmpRule = $.extend(true, {}, $scope.selectedRule);
          $scope.tmpRuleProperties = $scope.tmpRule.event_template ? $scope.tmpRule.event_template.$properties : undefined;
        }
      }

      function sendSiteEdit() {
        $q.all(_.flatten([
          removeRules(),
          upsertRules(),
          Restangular.all("datamarts/" + datamartId ).customPUT($scope.datamart, undefined, {organisation_id: organisationId})
            .catch(handleDatamartError)
        ])).then(function () {
          $location.path("/" + organisationId + "/settings/datamarts");
        }).catch(function (e) {
          ErrorService.showErrorModal(e);
        });
      }

      /**
       * Filters
       */

      $scope.filteredEventRules = function () {
        return $filter('filter')($scope.rules, $scope.filteredRule);
      };

      /**
       * Methods
       */

        // -------------- RULES ------------------

      $scope.showDetails = function (rule) {
        $scope.cancelRuleEdit();
        $scope.selectedRule = rule;
        $scope.tmpRule = $.extend(true, {}, rule);
        $scope.tmpRuleProperties = $scope.tmpRule.event_template ? $scope.tmpRule.event_template.$properties : undefined;
      };

      $scope.newRule = function (type) {
        $scope.ruleCreationMode = true;
        $scope.ruleEditMode = true;
        resetRuleEdit();
        if (type === "CATALOG_AUTO_MATCH") {
          $scope.tmpRule = {type: type, auto_match_type: "CATEGORY"};
        } else if (type === "USER_ACCOUNT_ID_INSERTION") {
          $scope.tmpRule = {
            type: type,
            hash_function: $scope.hashFunctions[0],
            remove_source: 'false',
            to_lower_case: 'false'
          };
        } else if (type === "URL_MATCH") {
          $scope.tmpRule = {type: type, event_template: {$event_name: "", $properties: {}}, pattern: ""};
          $scope.tmpRuleProperties = $scope.tmpRule.event_template.$properties;
        }
        $scope.selectedRule = $scope.tmpRule;
      };

      $scope.editRule = function () {
        $scope.ruleEditMode = true;
        $scope.tmpRule = $.extend(true, {}, $scope.selectedRule);
        $scope.tmpRuleProperties = $scope.tmpRule.event_template ? $scope.tmpRule.event_template.$properties : undefined;

      };

      $scope.removeRule = function (rule) {
        var idx = $scope.rules.indexOf(rule);
        if (idx !== -1) {
          $scope.rules.splice(idx, 1);
        }
        $scope.selectedRule = undefined;
      };

      $scope.shortenString = function (str, length) {
        if (str === undefined) {
          return "";
        }
        if (str.length > length) {
          return str.substring(0, length) + "...";
        }
        return str;
      };

      $scope.getSummary = function (rule) {
        if (rule === undefined) {
          return "";
        }
        var str = "";
        switch (rule.type) {
          case "CATALOG_AUTO_MATCH":
            if (rule.auto_match_type === undefined) {
              return "";
            }
            return $scope.autoMatchTypes[rule.auto_match_type];
          case "USER_ACCOUNT_ID_INSERTION":
            str = $scope.shortenString(rule.property_source, 25);
            return "Property " + str + " is hashed to " + rule.hash_function;
          case "URL_MATCH":
            str = $scope.shortenString(rule.pattern, 25);
            return "Matches " + str;
        }
      };

      $scope.cancelRuleEdit = function () {
        resetRuleEdit();
        $scope.ruleCreationMode = false;
        $scope.ruleEditMode = false;
      };

      $scope.confirmRuleEdit = function () {
        if ($scope.ruleCreationMode) {
          $scope.ruleCreationMode = false;
          $scope.rules.push($scope.tmpRule);
        }
        $scope.ruleEditMode = false;
        Object.keys($scope.selectedRule).map(function (a) {
          if (a in $scope.tmpRule) {
            $scope.selectedRule[a] = $scope.tmpRule[a];
          }
        });
      };

      // Auto Match Rule
      $scope.newEventTemplateProperty = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/datamarts/create.event-template-property.html',
          backdrop: 'static',
          controller: 'core/settings/datamarts/CreateEventTemplatePropertyController',
          size: 'md',
          resolve: {
            properties: function () {
              return $scope.tmpRule.event_template.$properties;
            }
          }
        }).result.then(function (prop) {
            if ($scope.tmpRule.event_template.$properties[prop.key] !== undefined) {
              WarningService.showWarningModal("This property has already been defined. ");
            } else {
              $scope.tmpRule.event_template.$properties[prop.key] = prop.value;
            }
          });
      };

      $scope.removeEventTemplateProperty = function (key) {
        delete $scope.tmpRule.event_template.$properties[key];
      };


      // ---------------- DATAMART ----------------

      $scope.cancel = function () {
        $location.path("/" + organisationId + "/settings/datamarts");
      };

      $scope.done = function () {
        if ($scope.editMode) {
          if ($scope.datamartToken !== $scope.datamart.token) {
            WarningService.showWarningModal("A site token is already set. Are you sure that you want to override it?").then(sendSiteEdit, function () {
              $scope.datamart.token = $scope.datamartToken;
            });
          } else {
            sendSiteEdit();
          }
        } else {
          Restangular.all("datamarts/" + datamartId).post($scope.datamart).then(function (datamart) {
            $scope.rules.forEach(function (ruleInfo) {
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
