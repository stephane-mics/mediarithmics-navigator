define(['./module'], function (module) {
  'use strict';

  module.factory('core/common/auth/Session', [
    '$q', '$location', '$log', '$rootScope', 'Restangular', 'core/login/constants',  'core/configuration', 'core/common/auth/AuthenticationService', 'async',
    function ($q, $location, $log, $rootScope, Restangular, LoginConstants, coreConfig, AuthenticationService, async) {
      var service = {};
      service.initialized = false;

      var expirationTimer = null;

      service.isInitialized = function () {
        return this.initialized;
      };

      service.init = function (organisationId) {
        var deferred = $q.defer();
        var self = this;

        async.parallel({
            connectedUser: function (callback) {
                Restangular.one('connected_user').get().then(function (userProfile) {
                  callback(null, userProfile);
                }, function (err) {
                    callback(err);
                });
            },
            cookies: function (callback) {
                Restangular.withConfig(function(RestangularConfigurer) {
                    RestangularConfigurer.setDefaultHttpFields({withCredentials: true});
                }).one('my_cookies').get().then(function (response) {
                    callback(null, response.cookies);
                }, function (err) {
                    callback(err);
                });
             }
        }, function (err, results){
            if (err){
                deferred.reject(err);
            } else {

              self.userProfile = results.connectedUser;
              self.cookies = results.cookies;

              $log.debug("Initialize session with user profile:", self.userProfile);
              $log.debug("Loaded cookies:", self.cookies);

              if (!expirationTimer && AuthenticationService.hasAccessToken() && !AuthenticationService.hasRefreshToken()) {
                var expirationDate = AuthenticationService.getAccessTokenExpirationDate();
                var waitTime = expirationDate.getTime() - new Date().getTime() + 1 * 1000;
                expirationTimer = setTimeout(function () {
                  var isExpired = AuthenticationService.getAccessTokenExpirationDate().getTime() < new Date().getTime();
                  if (isExpired) {
                    $rootScope.$emit("global-message", {
                      message: "Your session has expired, you should log in again."
                    });
                  }
                }, waitTime);
              }

              if (organisationId) {
                $log.debug("Fetching organisation : ", organisationId);
                service.updateWorkspace(organisationId).then(function () {
                  self.initialized = true;
                  deferred.resolve();
                });
              } else {
                if (self.userProfile.default_workspace in self.userProfile.workspaces) {
                  self.currentWorkspace = self.userProfile.workspaces[self.userProfile.default_workspace];
                } else if (self.userProfile.workspaces.length) {
                  $log.warn("default_workspace", self.userProfile.default_workspace, "is invalid, using the first one");
                  self.currentWorkspace = self.userProfile.workspaces[0];
                } else {
                  $log.error("Can't set self.currentWorkspace, default_workspace =", self.userProfile.default_workspace, "workspaces =", self.userProfile.workspaces);
                }
                $log.debug("Use default : ", self.currentWorkspace);
                self.initialized = true;
                deferred.resolve();
              }
            }
        });

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
        if (!service.hasDatamart()) {
          return null;
        }
        var datamarts = service.getCurrentWorkspace().datamarts;
        if (datamarts.length) {
          return datamarts[0].datamart_id;
        }
      };

      service.hasDatamart = function () {
        return service.getCurrentWorkspace() && service.getCurrentWorkspace().datamarts.length > 0;
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
              $location.path(result.organisation_id + '/campaigns/display');
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

        if (expirationTimer) {
          clearTimeout(expirationTimer);
          expirationTimer = null;
        }
      };

      return service;
    }
  ]);
});
