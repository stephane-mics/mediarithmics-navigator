(function(){

  'use strict';

  var module = angular.module('core/campaigns');

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
        .when('/campaigns/select-campaign-template', {
          templateUrl:'src/core/campaigns/create.html',
          topbar : false
        })
        .when('/campaigns/display/expert/edit/:campaign_id', {
          templateUrl:'src/core/campaigns/expert/edit-campaign.html',
          topbar : false
        })
        .when('/campaigns/display/expert/edit/:campaign_id/edit-ad-group/:ad_group_id', {
          templateUrl:'src/core/campaigns/expert/edit-ad-group.html',
          topbar : false
        })
        .when('/campaigns', {
          templateUrl: 'src/core/campaigns/list.html'
        });
    }
  ]);

})