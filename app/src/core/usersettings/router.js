define(['./module'], function () {

  'use strict';

  var module = angular.module('core/usersettings');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('usersettings', {
          url:'/usersettings',
          templateUrl:'src/core/usersettings/edit-user-settings.html',
          topbar : false
        });
    }
  ]);

});