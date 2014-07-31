define(['./module'], function (module) {
  "use strict";

  module.factory('core/common/WaitingService', [
    "$modal",
    function ($modal) {
      var service = {};

      var waitingModal = null;

      service.showWaitingModal = function() {
        waitingModal = $modal.open({
          templateUrl: 'src/core/common/waiting.html',
          backdrop : 'static',
          keyboard : false
        });
        return waitingModal.result;
      };
      service.hideWaitingModal = function() {
        if(waitingModal) {
          waitingModal.close();
          waitingModal = null;
        }
      };

      return service;
    }
  ]);

});




