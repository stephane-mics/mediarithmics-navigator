/* global _ */
define(['./module.js'], function () {
  'use strict';


  /*
   *
   * DISPLAY Ad SERVICE
   *
   */

  var module = angular.module('core/creatives');

  
  module.factory('core/creatives/DisplayAdService', [
    '$q', 'Restangular', 'core/common/IdGenerator', 'core/creatives/DisplayAdContainer', '$log', 'core/common/auth/Session',

    function($q, Restangular, IdGenerator, DisplayAdContainer,  $log, Session) {

      var idCounter = 1;
      var service = {};

      service.reset = function() {

        this.displayAdCtn = null;
      };

      service.getDisplayAdValue = function() {

        $log.debug("> getDisplayAdValue, ctn=", this.displayAdCtn);
        return this.displayAdCtn.value;
      };

      service.getProperties = function() {

        $log.debug("> getProperties, ctn=", this.displayAdCtn);
        return this.displayAdCtn.properties;

      };

      // initEditDisplayAd : returns a promise on the display ad container
      service.initEditDisplayAd = function(creativeId) {

        $log.debug("> initEditDisplayAd creativeId = ", creativeId);

        var ctn = new DisplayAdContainer();
        this.displayAdCtn = ctn;
        return ctn.load(creativeId);
      };


      // save the display ad
      service.save = function() {

        if (this.displayAdCtn.id.indexOf('T') === -1 ) {
          return this.displayAdCtn.update();
        } else {
          return this.displayAdCtn.persist();
        }


      };

      return service;
    }
  ]);
});
