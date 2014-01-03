'use strict';

/*
 * Application Module 
 */

var navigatorApp = angular.module('mediarithmicsNavigatorApp', [
  'ngCookies',
  'ngResource',
  'ngSanitize',
  'ngRoute',
  'CampaignControllers',
  'CampaignServices',
  'CreativeControllers'
]);

// configure the application
navigatorApp.config(function ($routeProvider) {
    $routeProvider
      .when('/', {
        templateUrl: 'views/main.html',
        controller: 'MainCtrl'
      })
      .when('/campaigns', {
        templateUrl: 'views/campaign-list.html',
        controller: 'CampaignListCtrl'
      })
      .when('/campaigns/:campaignId', {
        templateUrl: 'views/campaign.html',
        controller: 'CampaignCtrl'
      }) 
      .when('/creatives', {
        templateUrl: 'views/creative-list.html',
        controller: 'CreativeListCtrl'
      })
      .otherwise({
        redirectTo: '/'
      });
  });
