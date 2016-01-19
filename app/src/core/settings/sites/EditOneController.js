define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/settings/sites/EditOneController', [
    '$scope', '$log', '$location', '$state', '$stateParams', '$uibModal', '$filter', '$q', 'Restangular', 'core/common/auth/Session', 'lodash',
    'core/common/ErrorService', 'core/common/WarningService',
    function ($scope, $log, $location, $state, $stateParams, $uibModal, $filter, $q, Restangular, Session, _, ErrorService, WarningService) {
      var datamartId = Session.getCurrentDatamartId();
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.rulesPerPage = 20;
      $scope.aliasesPerPage = 20;
      $scope.rulesCurrentPage = 0;
      $scope.aliasesCurrentPage = 0;
      $scope.editMode = false;
      $scope.site = {datamart_id: datamartId, organisation_id: organisationId};
      $scope.aliases = [];
      $scope.rules = [];
      $scope.originalAliasesIds = [];
      $scope.originalRulesIds = [];
      $scope.ruleEditMode = false;
      $scope.ruleCreationMode = false;
      $scope.ruleTypes = {
        CATALOG_AUTO_MATCH: "Catalog Auto Match",
        USER_ACCOUNT_ID_INSERTION: "User Account Id Creation"
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
        if (values && $stateParams.siteId) {
          $scope.editMode = true;
          Restangular.one("datamarts/" + datamartId + "/sites/" + $stateParams.siteId).get({organisation_id: organisationId}).then(function (site) {
            $scope.site = site;
            if (site.token !== null) {
              $scope.siteToken = site.token;
            }
          });
          Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules").getList({organisation_id: organisationId}).then(function (rules) {
            $scope.originalRulesIds = _.pluck(rules, 'id');
            $scope.rules = rules;
            $scope.selectedRule = undefined;
          });
          Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/aliases").getList({organisation_id: organisationId}).then(function (aliases) {
            $scope.originalAliasesIds = _.pluck(aliases, 'id');
            $scope.aliases = aliases;
          });
        }
      });


      /**
       * Helpers
       */

      function removeAliases() {
        var finalIds = _.pluck($scope.aliases, 'id');
        return _.map($scope.originalAliasesIds, function (id) {
          if (finalIds.indexOf(id) === -1) {
            return Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/aliases/" + id).remove({organisation_id: organisationId});
          }
        });
      }

      function addAliases() {
        return _.map($scope.aliases, function (elem) {
          if (elem.id === undefined) {
            elem.site_id = $stateParams.siteId;
            elem.organisation_id = organisationId;
            return Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/aliases").post(elem);
          }
        });
      }

      function removeRules() {
        var finalIds = _.pluck($scope.rules, 'id');
        return _.forEach($scope.originalRulesIds, function (id) {
          if (finalIds.indexOf(id) === -1) {
            return Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules/" + id).remove({organisation_id: organisationId});
          }
        });
      }

      function addRules() {
        return _.map($scope.rules, function (elem) {
          if (elem.id === undefined) {
            elem.site_id = $stateParams.siteId;
            var rule = {organisation_id: organisationId, properties: elem};
            return Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules").post(rule);
          }
        });
      }

      function handleSiteError(e) {
        if ($scope.siteToken === undefined) {
          ErrorService.showErrorModal({error: {message: "This site token is already taken."}});
        } else {
          ErrorService.showErrorModal(e);
        }
      }

      function sendSiteEdit() {
        $q.all(_.flatten([
          removeAliases(),
          addAliases(),
          removeRules(),
          addRules(),
          Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId).customPUT($scope.site, undefined, {organisation_id: organisationId})
            .catch(handleSiteError)
        ])).then(function () {
          $location.path("/" + organisationId + "/settings/sites");
        }).catch(function (e) {
          ErrorService.showErrorModal(e);
        });
      }

      /**
       * Filters
       */

      $scope.filteredAliases = function () {
        return $filter('filter')($scope.aliases, $scope.filteredAlias);
      };

      $scope.filteredEventRules = function () {
        return $filter('filter')($scope.rules, $scope.filteredRule);
      };

      /**
       * Methods
       */

        // -------------- RULES ------------------

      $scope.showDetails = function (rule) {
        $scope.selectedRule = rule;
        $scope.tmpRule = $.extend({}, rule);
      };

      $scope.newRule = function (type) {
        $scope.ruleCreationMode = true;
        $scope.ruleEditMode = true;
        if (type === "CATALOG_AUTO_MATCH") {
          $scope.tmpRule = {type: "CATALOG_AUTO_MATCH", auto_match_type: "CATEGORY"};
        } else if (type === "USER_ACCOUNT_ID_INSERTION") {
          $scope.tmpRule = {
            type: "USER_ACCOUNT_ID_INSERTION",
            hash_function: $scope.hashFunctions[0],
            remove_source: 'false',
            to_lower_case: 'false'
          };
        }
        $scope.selectedRule = $scope.tmpRule;
      };

      $scope.editRule = function () {
        $scope.ruleEditMode = true;
        $scope.tmpRule = $.extend({}, $scope.selectedRule);
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
        switch (rule.type) {
          case "CATALOG_AUTO_MATCH":
            if (rule.auto_match_type === undefined) {
              return "";
            }
            return $scope.autoMatchTypes[rule.auto_match_type];
          case "USER_ACCOUNT_ID_INSERTION":
            var str = $scope.shortenString(rule.property_source, 25);
            return "Property " + str + " is hashed to " + rule.hash_function;
        }
      };


      $scope.cancelRuleEdit = function () {
        if ($scope.ruleCreationMode) {
          $scope.tmpRule = undefined;
          $scope.selectedRule = undefined;
        } else {
          $scope.tmpRule = $.extend({}, $scope.selectedRule);
        }
        $scope.ruleCreationMode = false;
        $scope.ruleEditMode = false;
      };

      $scope.confirmRuleEdit = function () {
        if ($scope.ruleCreationMode) {
          $scope.ruleCreationMode = false;
          $scope.rules.push($scope.tmpRule);
        }
        $scope.ruleEditMode = false;
        $scope.selectedRule = $.extend($scope.selectedRule, $scope.tmpRule);
      };


      // -------------- ALIASES ------------------

      $scope.newAlias = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.alias.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/settings/sites/CreateAliasController',
          size: 'md'
        }).result.then(function (alias) {
            $scope.aliases.push(alias);
          });
      };

      $scope.removeAlias = function (alias) {
        var idx = $scope.aliases.indexOf(alias);
        if (idx !== -1) {
          $scope.aliases.splice(idx, 1);
        }
      };


      // ---------------- SITE ----------------

      $scope.cancel = function () {
        $location.path("/" + organisationId + "/settings/sites");
      };

      $scope.done = function () {
        if ($scope.editMode) {
          if ($scope.siteToken !== $scope.site.token) {
            WarningService.showWarningModal("A site token is already set. Are you sure that you want to override it?").then(sendSiteEdit, function () {
              $scope.site.token = $scope.siteToken;
            });
          } else {
            sendSiteEdit();
          }
        } else {
          Restangular.all("datamarts/" + datamartId + "/sites").post($scope.site).then(function (site) {
            $scope.rules.forEach(function (ruleInfo) {
              var rule = {
                organisation_id: organisationId,
                properties: ruleInfo
              };
              Restangular.all("datamarts/" + datamartId + "/sites/" + site.id + "/event_rules").post(rule);
            });
            $q.all(
              $scope.aliases.map(function (alias) {
                alias.site_id = site.id;
                alias.organisation_id = organisationId;
                return Restangular.all("datamarts/" + datamartId + "/sites/" + site.id + "/aliases").post(alias);
              })
            ).then(function () {
                $location.path("/" + organisationId + "/settings/sites");
              });
          }, handleSiteError);
        }
      };
    }
  ]);
});
