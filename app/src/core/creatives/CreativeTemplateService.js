/* global _ */
(function () {
  'use strict';

  /*
   *
   * DISPLAY Ad SERVICE
   *
   */

  var module = angular.module('core/creatives');

  
  module.factory('core/creatives/CreativeTemplateService', [
    '$q', 'Restangular', 'core/common/IdGenerator', '$log', 'core/common/auth/Session',
    function($q, Restangular, IdGenerator,  $log, Session) {

      var idCounter = 1;
      var service = {};

      return service;
    }
  ]);
})();