define(['./module', 'jquery'], function (module, $) {
  'use strict';

  module.controller('core/settings/sites/EditOneController', [
    '$scope', '$log', '$location', '$state', '$stateParams', '$uibModal', '$filter', 'Restangular', 'core/common/auth/Session', 'core/common/ErrorService',
    function ($scope, $log, $location, $state, $stateParams, $uibModal, $filter, Restangular, Session, ErrorService) {
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
      $scope.ruleTypes = {
        CATALOG_AUTO_MATCH: "Catalog Auto Match",
        USER_ACCOUNT_ID_CREATION: "User Account Id Creation"
      };
      $scope.autoMatchTypes = {
        CATEGORY: "Category",
        PRODUCT: "Product",
        PRODUCT_AND_CATEGORY: "Product And Category"
      };

      $scope.filteredAliases = function () {
        return $filter('filter')($scope.aliases, $scope.filteredAlias);
      };

      $scope.filteredEventRules = function () {
        return $filter('filter')($scope.rules, $scope.filteredRule);
      };

      $scope.$watch('filteredRule', function (rule) {
        if (rule) {
          $scope.selectedRule = undefined
        }
      });

      $scope.$watchGroup(["datamartId", "organisationId"], function (values) {
        if (values && $stateParams.siteId) {
          $scope.editMode = true;
          Restangular.one("datamarts/" + datamartId + "/sites/" + $stateParams.siteId).get({organisation_id: organisationId}).then(function (site) {
            $scope.site = site;
            $scope.siteToken = site.token;
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

      $scope.showDetails = function (rule) {
        $scope.selectedRule = rule;
      };

      $scope.newCatalogAutoMatchRule = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.rule.auto-match.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/settings/sites/CreateRuleAutoMatchController',
          size: 'md'
        }).result.then(function (rule) {
            $scope.rules.push(rule)
          });
      };

      $scope.newUserAccountIdRule = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.rule.user-account-id.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/settings/sites/CreateRuleUserAccountController',
          size: 'md'
        }).result.then(function (rule) {
            $scope.rules.push(rule)
          });
      };

      $scope.newAlias = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.alias.html',
          scope: $scope,
          backdrop: 'static',
          controller: 'core/settings/sites/CreateAliasController',
          size: 'md'
        }).result.then(function (alias) {
            $scope.aliases.push(alias)
          });
      };

      $scope.removeAlias = function (alias) {
        var idx = $scope.aliases.indexOf(alias);
        if (idx != -1) {
          $scope.aliases.splice(idx, 1);
        }
      };

      $scope.removeRule = function (rule) {
        var idx = $scope.rules.indexOf(rule);
        if (idx != -1) {
          $scope.rules.splice(idx, 1);
        }
        $scope.selectedRule = undefined;
      };

      $scope.getSummary = function (rule) {
        switch (rule.type) {
          case "CATALOG_AUTO_MATCH":
            return $scope.autoMatchTypes[rule.auto_match_type];
            break;
          case "USER_ACCOUNT_ID_CREATION":
            return "Property " + rule.property_source + " is hashed to " + rule.hash_function;
            break;
        }
      };

      $scope.cancel = function () {
        $location.path("/" + organisationId + "/settings/sites");
      };

      function removeAliases() {
        var finalIds = _.pluck($scope.aliases, 'id');
        _.forEach($scope.originalAliasesIds, function (id) {
          if (finalIds.indexOf(id) === -1) {
            Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/aliases/" + id).remove({organisation_id: organisationId});
          }
        })
      }

      function addAliases() {
        _.forEach($scope.aliases, function (elem) {
          if (elem.id === undefined) {
            elem.site_id = $stateParams.siteId;
            elem.organisation_id = organisationId;
            Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/aliases").post(elem);
          }
        });
      }

      function removeRules() {
        var finalIds = _.pluck($scope.rules, 'id');
        _.forEach($scope.originalRulesIds, function (id) {
          if (finalIds.indexOf(id) === -1) {
            Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules/" + id).remove({organisation_id: organisationId});
          }
        })
      }

      function addRules() {
        _.forEach($scope.rules, function (elem) {
          if (elem.id === undefined) {
            elem.site_id = $stateParams.siteId;
            var rule = {organisation_id: organisationId, properties: elem};
            Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules").post(rule);
          }
        });
      }

      function handleSiteError(e) {
        if ($scope.siteToken == undefined) { // siteToken be null or undefined
          ErrorService.showErrorModal({error: {message: "This site token is already taken."}});
        } else {
          ErrorService.showErrorModal(e);
        }
      }

      $scope.done = function () {
        if ($scope.editMode) {
          removeAliases();
          addAliases();
          removeRules();
          addRules();
          Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId).customPUT($scope.site, undefined, {organisation_id: organisationId}).then(function () {
            $location.path("/" + organisationId + "/settings/sites");
          }, handleSiteError);
        } else {
          Restangular.all("datamarts/" + datamartId + "/sites").post($scope.site).then(function (site) {
            $scope.rules.forEach(function (ruleInfo) {
              var rule = {
                organisation_id: organisationId,
                properties: ruleInfo
              };
              Restangular.all("datamarts/" + datamartId + "/sites/" + site.id + "/event_rules").post(rule);
            });
            $scope.aliases.forEach(function (alias) {
              alias.site_id = site.id;
              alias.organisation_id = organisationId;
              Restangular.all("datamarts/" + datamartId + "/sites/" + site.id + "/aliases").post(alias);
            });
            $location.path("/" + organisationId + "/settings/sites");
          }, handleSiteError);
        }
      }
    }
  ]);
});
