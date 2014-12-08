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

      service.init = function () {

        var defered = $q.defer();
        var self = this;

        Restangular.one('connected_user').get().then(function(userProfile){

          // TODO : remove this hack
          for(var i = 0; i < userProfile.workspaces.length; i++) {
            var workspace = userProfile.workspaces[i];
            if (workspace.organisation_id === "501") {
              workspace.datamart_id = "8";
            } else {
              workspace.datamart_id = "0";
            }
          }

          self.userProfile = userProfile;
          self.currentWorkspace = userProfile.workspaces[userProfile.default_workspace];

          self.initialized = true;

          pluginService.registerPlugin("admin", coreConfig.ADMIN_PLUGIN_URL, "/admin");

          defered.resolve();
          $log.debug("User Profile :", userProfile);
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
        var w = _.select(this.userProfile.workspaces, function (w) {
          return w.organisation_id === id;
        })[0];

        return w.organisation_name;
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

      service.updateWorkspace = function(organisationId) {
        if(organisationId) {
          service.switchWorkspace(organisationId)
        } else {
          service.switchWorkspace(service.getCurrentWorkspace().organisation_id)
        }

      };

      service.switchWorkspace = function(organisationId) {
        var self = this;
        if(organisationId != self.currentWorkspace.organisation_id) {
        var promise = Restangular.one('organisations', organisationId).one('workspace').get()
          promise.then(function (result) {
            self.currentWorkspace = result;
            $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);
            $location.path(result.organisation_id+'/campaigns');
          })
        }

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
