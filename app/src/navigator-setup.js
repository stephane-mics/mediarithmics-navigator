define([], function () {
    'use strict';

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
      'core/scenarios',
      'core/queries',
      'core/goals',
      'core/datamart',
      'core/login',
      'core/password',
      'core/common',
      'core/settings'
    ]);

    return navigator;
  }
);