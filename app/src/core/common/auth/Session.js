(function(){
  'use strict';

  var authModule = angular.module('core/common/auth');

  /* define the Authentication service */
  authModule.factory('core/common/auth/Session', [
    '$q', '$location', '$log', '$rootScope','Restangular', 'core/login/constants',
    function($q,$location , $log, $rootScope, Restangular, LoginConstants) {

      var service = {};
      service.initialized = false;

      service.isInitialized = function () {
        return this.initialized;
      };

      service.init = function() {

        var defered = $q.defer();
        var self = this;

        Restangular.one('connected_user').get().then(function(userProfile){
          self.userProfile = userProfile;
          self.currentWorkspace = userProfile.default_workspace;
          self.initialized = true;
          defered.resolve();
          $log.debug("User Profile :", userProfile);
        });

        return defered.promise;
      };

      service.getUserProfile = function() {
        return this.user;
      };

      service.getCurrentWorkspace = function() {
        return this.userProfile.workspaces[this.currentWorkspace];
      };

      service.getOrganisationName = function(id) {
        var w = _.select(this.userProfile.workspaces, function (w) {
          return w.organisation_id == id;
        })[0];

        return w.organisation_name;
      };

      service.getWorkspaces = function () {
        var result = [];
        for (var i = 0; i < this.userProfile.workspaces.length ; i++) {
          result.push({idx: i, organisationName: this.userProfile.workspaces[i].organisation_name})
        }
        return result;

      };


      service.switchWorkspace = function(workspaceIndex) {
        this.currentWorkspace = workspaceIndex;
        $rootScope.$broadcast(LoginConstants.WORKSPACE_CHANGED);
        $location.path('/home');
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
})();
