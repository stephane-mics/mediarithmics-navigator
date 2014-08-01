define(['./module'], function (module) {
  "use strict";

  module.factory('core/common/ErrorService', [
    "$modal", "$rootScope", "$log",
    function ($modal, $rootScope, $log) {
      var service = {};

      var errorModal = null;


      service.showErrorModal = function(options) {
        var scope = $rootScope.$new(true);

        options = options || {};
        scope.messageType = options.messageType || "full";

        if (options.error instanceof Error) {
          $log.error(options.error);
        } else if (options.error && options.error.data) {
          scope.errorId = options.error.data.error_id;
        }
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




