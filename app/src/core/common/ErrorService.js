define(['./module'], function (module) {
  "use strict";

  module.factory('core/common/ErrorService', [
    "$modal", "$rootScope",
    function ($modal, $rootScope) {
      var service = {};

      var errorModal = null;


      service.showErrorModal = function(options) {
        var scope = $rootScope.$new(true);

        options = options || {};
        scope.messageType = options.messageType || "full";
        scope.errorId = options.errorId;
        errorModal = $modal.open({
          scope: scope,
          templateUrl: 'src/core/common/error.html',
          controller: 'core/common/ErrorController',
          backdrop : 'static',
          keyboard : false
        });

        return errorModal.result;
      };
      service.hideErrorModal = function() {
        if(errorModal) {
          errorModal.close();
          errorModal = null;
        }
      };

      return service;
    }
  ]);

});




