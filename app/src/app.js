define(
  ['angularAMD',
    'ngCookies',
    'jqCookie',
    'ngResource',
    'ngRoute',
    'restangular',
    'ngSanitize',
    'ngTable',
    'nvd3ChartDirectives',
    'ngBootstrap',
    'ui',
    'lodash',
    'core/configuration',
    'core/keywords/index',
    'core/creatives/index',
    'core/adgroups/index',
    'core/usergroups/index',
    'core/campaigns/index',
    'core/placementlists/index',
    'core/login/index',
    'core/layout/index'], function (angularAMD) {
    'use strict';

    /*
     * Application Module
     */

    var navigatorApp = angular.module('navigatorApp', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'restangular',
      'nvd3ChartDirectives',
      'ngBootstrap',
      'ui.keypress',
      'ui.unique',

      'core/configuration',
      'core/layout',
      'core/keywords',
      'core/adgroups',
      'core/usergroups',
      'core/campaigns',
      'core/creatives',
//    'core/datamart',
      'core/login',
      'core/common'
    ]);

    return navigatorApp;
  });
