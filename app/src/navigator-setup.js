
define(['angular'], function () {
    'use strict';

    var navigator = angular.module('navigator', [
      'ngCookies',
      'ngResource',
      'ngSanitize',
      'ngAnimate',
      'ngRoute',
      'restangular',
      'ngBootstrap',
      'ui.keypress',
      'ui.unique',
      'ui.router',
      'ct.ui.router.extras',
      'nvd3',
      'core/configuration',
      'core/adblock',
      'core/adlayouts',
      'core/assets',
      'core/exports',
      'core/bidOptimizer',
      'core/layout',
      'core/keywords',
      'core/adgroups',
      'core/usergroups',
      'core/campaigns',
      'core/creatives',
      'core/scenarios',
      'core/queries',
      'core/goals',
      'core/attributionmodels',
      'core/visitanalysers',
      'core/datamart',
      'core/login',
      'core/password',
      'core/common',
      'core/settings',
      'core/stylesheets'
    ]);

    return navigator;
  }
);
