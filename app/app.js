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
    '/src/core/keywords/index.js',
    '/src/core/creatives/index.js',
    '/src/core/adgroups/index.js',
    '/src/core/usergroups/index.js',
    '/src/core/campaigns/index.js',
    '/src/core/placementlists/index.js',
    '/src/core/login/index.js',
    '/src/core/layout/index.js']
  , function (angularAMD) {
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
