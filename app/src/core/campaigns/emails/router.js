define(['./module'], function (module) {
  'use strict';

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/email/edit', {
          url: '/{organisation_id}/campaigns/email/edit/:campaign_id',
          templateUrl: 'src/core/campaigns/emails/edit-campaign.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        })
        .state('campaigns/email/create', {
          url: '/{organisation_id}/campaigns/email/edit',
          templateUrl: 'src/core/campaigns/emails/edit-campaign.html',
          data: {navbar: 'src/core/layout/header/navbar/empty-navbar/empty-navbar.html'}
        });
    }
  ]);

});
