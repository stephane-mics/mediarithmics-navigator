(function(){
  'use strict';

  /* Services */
  var utilServices = angular.module('core/common');


  /* define the Authentication service */
  utilServices.factory('core/common/IdGenerator', function() {

    var service = {};
    service.counter = 0;

    service.getId = function(){
      service.counter += 1;
      return 'T'+service.counter;
    };

    return service;
  });
})();

