define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/select-campaign-template', {
          url:'/{organisation_id}/campaigns/select-campaign-template',
          templateUrl:'src/core/campaigns/create.html'
        })
        .state('campaigns/display/expert/edit', {
          url:'/{organisation_id}/campaigns/display/expert/edit/{campaign_id}',
          templateUrl:'src/core/campaigns/expert/edit-campaign.html'
        })
        .state('campaigns/display/expert/edit/campaign/edit-ad-group', {
          url:'/{organisation_id}/campaigns/display/expert/edit/:campaign_id/edit-ad-group/:ad_group_id',
          templateUrl:'src/core/campaigns/expert/edit-ad-group.html'
        })
        .state('campaigns', {
          url:'/{organisation_id}/campaigns',
          templateUrl: 'src/core/campaigns/list.html'
        })
        .state('allCampaigns', {
          url:'/campaigns',
          templateUrl: 'src/core/campaigns/list.html'
        });
    }
  ]);

});