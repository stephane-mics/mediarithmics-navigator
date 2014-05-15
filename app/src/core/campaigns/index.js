(function(){

  'use strict';

  var module = angular.module('core/campaigns', [
    'core/creative',
    'core/campaigns/expert',
    'core/campaigns/keywords',
    'core/campaigns/report',
    'restangular'
  ]);

  module.config([
    "$routeProvider",
    function ($routeProvider) {
      $routeProvider
        .when('/display-campaigns/expert/edit/:campaign_id', {
          templateUrl:'src/core/campaigns/expert/edit-campaign.html',
          topbar : false
        })
        .when('/display-campaigns/expert/edit/:campaign_id/edit-ad-group/:ad_group_id', {
          templateUrl:'src/core/campaigns/expert/edit-ad-group.html',
          topbar : false
        })
        .when('/display-campaigns', {
          templateUrl: 'src/core/campaigns/list.html'
        });
    }
  ]);

})();
