/* global _ */

define(['./module', 'navigator'], function (module, navigator) {
  'use strict';

  var authModule = angular.module('core/common/auth');

  /* define the Authentication service */
  authModule.factory('core/common/auth/Session', [
    '$q', '$location', '$log', '$rootScope','Restangular', 'core/login/constants', 'core/common/plugins/pluginService',
    function($q,$location , $log, $rootScope, Restangular, LoginConstants, pluginService ) {

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
          self.currentWorkspace = userProfile.default_workspace;
          self.initialized = true;


          pluginService.registerPlugin("admin", 'http://localhost:9001', "/admin");


          defered.resolve();
          $log.debug("User Profile :", userProfile);
        }, defered.reject);

        return defered.promise;
      };

      service.getUserProfile = function() {
        return this.userProfile;
      };


      service.updateUserProfile = function (userSettings) {
        this.userProfile.last_name = userSettings.last_name;
        this.userProfile.first_name = userSettings.first_name;
        this.userProfile.language = userSettings.language;
        this.userProfile.email = userSettings.email;
        
      }

      service.getCurrentWorkspace = function() {
        return this.userProfile.workspaces[this.currentWorkspace];
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

         for (var i = 0; i < this.userProfile.workspaces.length ; i++) {
          if(this.userProfile.workspaces[i].organisation_id === organisationId) {
            this.currentWorkspace = i;
          }
        }
        $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);

      };

      service.switchWorkspace = function(workspaceIndex) {
        this.currentWorkspace = workspaceIndex;
        $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);
        $location.path(this.getCurrentWorkspace().organisation_id+'/campaigns');
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
