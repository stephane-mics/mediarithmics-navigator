define([
  'angularAMD',
  'ngload',
  'moment',
  'jqCookie',
  'jqDaterangepicker',
  'ngCookies',
  'ngResource',
  'ngRoute',
  'restangular',
  'ngSanitize',
  'ngTable',
  'nvd3ChartDirectives',
  'ngBootstrap',
  'jsplumb',
  'ui',
  'ui.router',
  'ui.router.extras',
  'lodash',
  'core/configuration',
  'core/adblock/index',
  'core/queries/index',
  'core/goals/index',
  'core/scenarios/index',
  'core/keywords/index',
  'core/creatives/index',
  'core/adgroups/index',
  'core/usergroups/index',
  'core/campaigns/index',
  'core/placementlists/index',
  'core/login/index',
  'core/password/index',
  'core/datamart/index',
  'core/layout/index',
  'core/settings/index',
  'navigator',
  'plugins'
], function () {
  'use strict';

  console.log("Loaded App RequireJS. Loading App AngularJS.");

  var app = angular.module('app', [
    'navigator',
    'admin'
  ], function () {
    console.log("Loaded App AngularJS");
  });

  return app;
});