define(['./module'], function () {

  'use strict';

  var module = angular.module('core/campaigns');

  module.config([
    "$stateProvider",
    function ($stateProvider) {
      $stateProvider
        .state('campaigns/select-campaign-template', {
          url:'/campaigns/select-campaign-template',
          templateUrl:'src/core/campaigns/create.html',
          topbar : false
        })
        .state('campaigns/display/expert/edit', {
          url:'/campaigns/display/expert/edit/{campaign_id}',
          templateUrl:'src/core/campaigns/expert/edit-campaign.html',
          topbar : false
        })
        .state('campaigns/display/expert/edit/:campaign_id/edit-ad-group/:ad_group_id', {
          url:'/campaigns/display/expert/edit/:campaign_id/edit-ad-group/:ad_group_id',
          templateUrl:'src/core/campaigns/expert/edit-ad-group.html',
          topbar : false
        })
        .state('campaigns', {
          url:'/campaigns',
          templateUrl: 'src/core/campaigns/list.html'
        });
    }
  ]);

});