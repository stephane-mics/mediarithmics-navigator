define(['./module'], function (module) {
  'use strict';

  module.factory('core/common/auth/Session', [
    '$q', '$location', '$log', '$rootScope', 'Restangular', 'core/login/constants',  'core/configuration',
    function ($q, $location, $log, $rootScope, Restangular, LoginConstants, coreConfig) {
      var service = {};
      service.initialized = false;

      service.isInitialized = function () {
        return this.initialized;
      };

      service.init = function (organisationId) {
        var deferred = $q.defer();
        var self = this;

        Restangular.one('connected_user').get().then(function (userProfile) {
          $log.debug("Initialize session with user profile:", userProfile);
          self.userProfile = userProfile;
          if (organisationId) {
            $log.debug("fetching organisation : ", organisationId);
            service.updateWorkspace(organisationId).then(function () {
              self.initialized = true;
              deferred.resolve();
            });
          } else {
            self.currentWorkspace = userProfile.workspaces[userProfile.default_workspace];
            $log.debug("use default : ", self.currentWorkspace);
            self.initialized = true;
            deferred.resolve();
          }
        }, deferred.reject);
        return deferred.promise;
      };

      service.getUserProfile = function () {
        return this.userProfile;
      };

      service.getCurrentWorkspace = function () {
        return this.currentWorkspace;
      };

      service.getOrganisationName = function (id) {
        return this.getCurrentWorkspace().organisation_name;
      };

      service.getWorkspaces = function () {
        var result = [];
        for (var i = 0; i < this.userProfile.workspaces.length; i++) {
          result.push({
            idx: i,
            organisationName: this.userProfile.workspaces[i].organisation_name,
            organisationId: this.userProfile.workspaces[i].organisation_id
          });
        }
        return result;
      };

      service.getCurrentDatamartId = function () {
        return service.getCurrentWorkspace().datamarts[0].datamart_id;
      };

      service.hasDatamart = function () {
        return service.getCurrentWorkspace().datamarts.length > 0;
      };

      service.updateWorkspace = function (organisationId) {
        if (organisationId) {
          return service.setWorkspace(organisationId, true);
        } else {
          return service.setWorkspace(service.getCurrentWorkspace().organisation_id, true);
        }
      };

      service.setWorkspace = function (organisationId, noredirect) {
        $log.debug("setWorkspace: ", organisationId);
        var self = this;
        if (!self.currentWorkspace || organisationId !== self.currentWorkspace.organisation_id) {
          var promise = Restangular.one('organisations', organisationId).one('workspace').get();
          promise.then(function (result) {
            self.currentWorkspace = result;
            $log.debug("Broadcast workspace change event ", result);
            $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);
            if (!noredirect) {
              $location.path(result.organisation_id + '/campaigns');
            }
          });
          return promise;
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
