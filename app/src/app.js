define(
  ['angularAMD',
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
    'ui',
    'ui.router',
    'ui.router.extras',
    'ngload',
    'lodash',
    'core/configuration',
    'core/adblock/index',
    'core/keywords/index',
    'core/creatives/index',
    'core/adgroups/index',
    'core/usergroups/index',
    'core/campaigns/index',
    'core/placementlists/index',
    'core/login/index',
    'core/datamart/index',
    'core/layout/index'], function (angularAMD) {
    'use strict';

    /*
     * Application Module
     */

    var navigator = angular.module('navigator', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngRoute',
      'restangular',
      'nvd3ChartDirectives',
      'ngBootstrap',
      'ui.keypress',
      'ui.unique',
      'ui.router',
      'ct.ui.router.extras',

      'core/configuration',
      'core/adblock',
      'core/layout',
      'core/keywords',
      'core/adgroups',
      'core/usergroups',
      'core/campaigns',
      'core/creatives',

      'core/datamart',
      'core/login',
      'core/common'
    ]);

    return navigator;
  });
