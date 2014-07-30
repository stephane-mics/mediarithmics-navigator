define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns/emails');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/email/expert/edit', {
          url:'/{organisation_id}/campaigns/email/expert/:campaign_id',
          templateUrl: 'src/core/campaigns/emails/index.html',
          topbar : false
        }).state('campaigns/email/expert/create', {
          url:'/{organisation_id}/campaigns/email/expert',
          templateUrl: 'src/core/campaigns/emails/index.html',
          topbar : false
        });
    }
  ]);

});

