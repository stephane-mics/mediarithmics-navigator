define(['angularAMD','app', 'lodash', 'async', 'jquery','plupload', 'd3', 'moment'], function (angularAMD, navigatorApp, lodash, async, jquery, plupload, d3, moment) {
  "use strict";

  navigatorApp.factory('lodash', [
    function () {
      return lodash;
    }
  ]);

  navigatorApp.factory('async', [
    function () {
      return async;
    }
  ]);

  navigatorApp.factory('jquery', [
    function () {
      return jquery;
    }
  ]);

  navigatorApp.factory('plupload', [
    function () {
      return plupload;
    }
  ]);

  navigatorApp.factory('d3', [
    function () {
      return d3;
    }
  ]);

  navigatorApp.factory('moment', [
    function () {
      return moment;
    }
  ]);

// configure the application
  navigatorApp.config([
    "$stateProvider", "$logProvider","$urlRouterProvider",
    function ($stateProvider, $logProvider, $urlRouterProvider) {

      $stateProvider
        .state('login', {
          url:'/login',
          templateUrl: 'src/core/login/main.html',
          publicUrl: true,
          sidebar: false
        })
        .state('logout', {
          url:'/logout',
          templateUrl: 'src/core/login/logout.html',
          publicUrl: true,
          sidebar: false
        })
        .state('remember-me', {
          url:'/remember-me',
          templateUrl: 'src/core/login/remember-me.html',
          publicUrl: true,
          sidebar: false
        })
        .state('init-session', {
          url:'/init-session',
          templateUrl: 'src/core/login/init-session.html',
          controller:'core/login/InitSessionController',
          publicUrl: true,
          sidebar: false
        });

$urlRouterProvider.when('/home', '/campaigns');
        

      // TODO: move these to non-public and authenticate
      $stateProvider
        .state('datamart/overview', {
          url:'/datamart/overview',
          templateUrl: 'src/core/datamart/index.html',
          publicUrl: true
        })
        .state('datamart/items', {
          url:'/datamart/items',
          templateUrl: 'src/core/datamart/items/view.all.html',
          publicUrl: true
        })
        .state('datamart/items/:itemId', {
          url:'/datamart/items/:itemId',
          templateUrl: 'src/core/datamart/items/view.one.html',
          publicUrl: true
        })
        .state('datamart/categories/', {
          url:'/datamart/categories',
          templateUrl: 'src/core/datamart/categories/browse.html',
          publicUrl: true
        })
        .state('datamart/categories/:categoryId', {
          url:'/datamart/categories/:categoryId',
          templateUrl: 'src/core/datamart/categories/browse.html',
          publicUrl: true
        })
        .state('datamart/users', {
          url:'/datamart/users',
          templateUrl: 'src/core/datamart/users/view.all.html',
          publicUrl: true
        })
        .state('datamart/users/:userId', {
          url:'/datamart/users/:userId',
          templateUrl: 'src/core/datamart/users/view.one.html',
          publicUrl: true
        });

      
      $stateProvider.state("admin/home",

        angularAMD.route({
            templateUrl: 'src/admin/views/organisation-list.html',
            controller:'OrganisationListController',
            controllerUrl: 'admin/controllers/organisation'
        })
    );
      $logProvider.debugEnabled(true);
    }
  ]);
   
   
// configure the Restangular Service
  navigatorApp.config([
    'RestangularProvider', 'core/configuration',
    function (RestangularProvider, configuration) {

      // set the api entry point
      RestangularProvider.setBaseUrl(configuration.WS_URL);

      RestangularProvider.addRequestInterceptor(function (element, operation, what, url) {
        if (operation === "put") {
          delete element.metadata;
        }
        return element;

      });

      // configure the response extractor
      RestangularProvider.setResponseExtractor(function (response, operation, what, url) {

        // This is a get for a list
        var newResponse;
        if (operation === "getList") {

          // this is an array
          newResponse = response.data;

          // add paging to metadata
          newResponse.metadata = {
            paging: {
              count: response.count,
              offset: response.offset,
              limit: response.limit
            }
          };
        } else {
          // This is an element
          newResponse = response.data;
        }
        return newResponse;
      });


    }
  ]);


  /* work to be performed after module loading */

// add an event listener on $routeChangeStart to restrict access to
// secured part of the app

  navigatorApp.run([
    '$rootScope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', "lodash", "core/login/constants","$state",
    function ($rootScope, $location, $log, AuthenticationService, Session, _, LoginConstants, $state) {

      var defaults = _.partialRight(_.assign, function (a, b) {
        return typeof a === 'undefined' ? b : a;
      });

      function updateWorkspaces() {
        $rootScope.currentOrganisation = Session.getCurrentWorkspace().organisation_name;
      }

      $rootScope.$on(LoginConstants.WORKSPACE_CHANGED, updateWorkspaces);
      $rootScope.$on(LoginConstants.LOGIN_SUCCESS, updateWorkspaces);

      $rootScope.$on('$stateChangeStart', function (event, next, current) {

        $log.debug("$stateChangeSuccess  next : ", next);


        var options = defaults(next, {
          publicUrl: false,
          sidebar: true,
          topbar: true
        });
        $rootScope.sidebar = options.sidebar;
        var urlMatch = $location.url().match(/\/([^\/]+)\/?/);
        if (urlMatch) {
          $rootScope.category = urlMatch[1];
        }
        $rootScope.topbar = options.topbar;
          if (!options.publicUrl) {

          if (AuthenticationService.hasAccessToken()) {

            if (!Session.isInitialized()) {

              AuthenticationService.pushPendingPath($location.url());
              $location.path('/init-session');
            }


          } else if (AuthenticationService.hasRefreshToken()) {

            // keep the current path in memory
            AuthenticationService.pushPendingPath($location.url());

            // redirect to the remember-me page
            $location.path('/remember-me');

          } else {

            // redirect to login
            $location.path('/login');

          }
        }
      });

            
    }
  ]);

var r = angularAMD.bootstrap(navigatorApp, true, document.body);
  return  navigatorApp;
});