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
        if (values && $stateParams.siteId) {
          $scope.editMode = true;
          Restangular.one("datamarts/" + datamartId + "/sites/" + $stateParams.siteId).get({organisation_id: organisationId}).then(function (site) {
            $scope.site = site;
            if (site.token !== null) {
              $scope.siteToken = site.token;
            }
          });
          Restangular.all("datamarts/" + datamartId + "/sites/" + $stateParams.siteId + "/event_rules").getList({organisation_id: organisationId}).then(function (rules) {
            _.forEach(rules, function(rule) {
              $scope.originalRulesIds.push(rule.id);
              if (rule.type === 'URL_MATCH') {
                rule.event_template = JSON.parse(rule.event_template);
              }
            });
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
            if (elem.event_template !== undefined) {
              elem.event_template = JSON.stringify(elem.event_template);
            }
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
        $scope.tmpRule = $.extend(true, {}, rule);
        $scope.tmpRuleProperties = $scope.tmpRule.event_template.$properties;
      };

      $scope.newRule = function (type) {
        $scope.ruleCreationMode = true;
        $scope.ruleEditMode = true;
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
        }
        $scope.selectedRule = $scope.tmpRule;
      };

      $scope.editRule = function () {
        $scope.ruleEditMode = true;
        $scope.tmpRule = $.extend(true, {}, $scope.selectedRule);
        $scope.tmpRuleProperties = $scope.tmpRule.event_template.$properties;
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
        if ($scope.ruleCreationMode) {
          $scope.tmpRule = undefined;
          $scope.selectedRule = undefined;
        } else {
          $scope.tmpRule = $.extend(true, {}, $scope.selectedRule);
          $scope.tmpRuleProperties = $scope.tmpRule.event_template.$properties;
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
        $scope.selectedRule = $.extend(true, $scope.selectedRule, $scope.tmpRule);
      };


      // Auto Match Rule
      $scope.newEventTemplateProperty = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.event-template-property.html',
          backdrop: 'static',
          controller: 'core/settings/sites/CreateEventTemplatePropertyController',
          size: 'md',
          resolve: {
            properties: function() {
              return $scope.tmpRule.event_template.$properties;
            }
          }
        }).result.then(function (prop) {
            if ($scope.tmpRule.event_template.$properties[prop.key] !== undefined) {
              WarningService.showWarningModal("This property has already been defined. ")
            } else {
              $scope.tmpRule.event_template.$properties[prop.key] = prop.value;
            }
          });
      };

      $scope.removeEventTemplateProperty = function (key) {
        delete $scope.tmpRule.event_template.$properties[key];
      };

      // -------------- ALIASES ------------------

      $scope.newAlias = function () {
        $uibModal.open({
          templateUrl: 'src/core/settings/sites/create.alias.html',
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
              if (ruleInfo.event_template !== undefined) {
                ruleInfo.event_template = JSON.stringify($scope.tmpRule.event_template);
              }
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
