/* global _ */

define(['./module', 'navigator'], function (module, navigator) {
  'use strict';

  var authModule = angular.module('core/common/auth');

  /* define the Authentication service */
  authModule.factory('core/common/auth/Session', [
    '$q', '$location', '$log', '$rootScope','Restangular', 'core/login/constants', 'core/common/plugins/pluginService', 'core/configuration',
    function($q, $location , $log, $rootScope, Restangular, LoginConstants, pluginService, coreConfig) {

      var service = {};
      service.initialized = false;

      service.isInitialized = function () {
        return this.initialized;
      };

      service.init = function (organisationId) {

        var defered = $q.defer();
        var self = this;

        Restangular.one('connected_user').get().then(function(userProfile){

          $log.debug("User Profile :", userProfile);

          self.userProfile = userProfile;
          if(organisationId) {
            $log.debug("fetching organisation : ", organisationId)
            service.updateWorkspace(organisationId).then(function() {
              self.initialized = true;


              defered.resolve();
            })
          } else {

            self.currentWorkspace = userProfile.workspaces[userProfile.default_workspace];
            $log.debug("use default : ", self.currentWorkspace)
            self.initialized = true;


            defered.resolve();
          }
          pluginService.registerPlugin("admin", coreConfig.ADMIN_PLUGIN_URL, "/admin");



        }, defered.reject);

        return defered.promise;
      };

      service.getUserProfile = function() {
        return this.user;
      };

      service.getCurrentWorkspace = function() {
        return this.currentWorkspace;
      };

      service.getOrganisationName = function(id) {
        return this.getCurrentWorkspace().organisation_name;
      };

      service.getWorkspaces = function () {
        var result = [];
        for (var i = 0; i < this.userProfile.workspaces.length ; i++) {
          result.push({
            idx: i,
            organisationName: this.userProfile.workspaces[i].organisation_name,
            organisationId : this.userProfile.workspaces[i].organisation_id
          });
        }
        return result;

      };
      service.getCurrentDatamartId = function () {
        return service.getCurrentWorkspace().datamarts[0].datamart_id;
      }

      service.hasDatamart = function () {
        return service.getCurrentWorkspace().datamarts.length > 0;
      }

      service.updateWorkspace = function(organisationId) {
        if(organisationId) {
          return service.setWorkspace(organisationId, true);
        } else {
          return service.setWorkspace(service.getCurrentWorkspace().organisation_id, true);
        }

      };

      service.setWorkspace = function(organisationId, noredirect) {
        $log.debug("setWorkspace: ", organisationId);
        var self = this;
        if(!self.currentWorkspace || organisationId != self.currentWorkspace.organisation_id) {
        var promise = Restangular.one('organisations', organisationId).one('workspace').get()
          promise.then(function (result) {
            self.currentWorkspace = result;
            $log.debug("Broadcat workspace change event ", result);
            $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);
	        if(!noredirect) {
              $location.path(result.organisation_id+'/campaigns');
	        }
          })
        }
        return promise;

      };

      /**
       * Logout the user and reset the session.
       */
      service.logout = function () {
        this.initialized = false;
        this.currentWorkspace = null;
        this.userProfile = null;
      };

      return service;
    }
  ]);
});
