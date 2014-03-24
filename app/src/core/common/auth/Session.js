(function(){
  'use strict';

  var authModule = angular.module('core/common/auth');

  /* define the Authentication service */
  authModule.factory('core/common/auth/Session', [
    '$q', '$log', 'Restangular',
    function($q, $log, Restangular) {

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

      service.switchWorkspace = function(workspaceIndex) {

      };

      return service;
    }
  ]);
})();
