(function () {
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
    'core/datamart',
    'core/login',
    'core/common',
  ]);

  navigatorApp.factory('lodash', [
    '$window',
    function($window) {
      return $window._;
    }
  ]);

  navigatorApp.factory('async', [
    '$window',
    function($window) {
      return $window.async;
    }
  ]);

  navigatorApp.factory('jquery', [
    '$window',
    function($window) {
      return $window.jQuery;
    }
  ]);

  navigatorApp.factory('plupload', [
    '$window',
    function($window) {
      return $window.plupload;
    }
  ]);

  navigatorApp.factory('d3', [
    '$window',
    function($window) {
      return $window.d3;
    }
  ]);

  navigatorApp.factory('moment', [
    '$window',
    function($window) {
      return $window.moment;
    }
  ]);

  // configure the application
  navigatorApp.config([
    "$routeProvider", "$logProvider",
    function ($routeProvider, $logProvider) {

      $routeProvider
      .when('/', {
        redirectTo: '/home',
        publicUrl : true
      })
      .when('/login', {
        templateUrl: 'src/core/login/main.html',
        publicUrl : true,
        sidebar : false
      })
      .when('/logout', {
        templateUrl: 'src/core/login/logout.html',
        publicUrl : true,
        sidebar : false
      })
      .when('/remember-me', {
        templateUrl: 'src/core/login/remember-me.html',
        publicUrl : true,
        sidebar : false
      })
      .when('/init-session', {
        templateUrl: 'src/core/login/init-session.html',
        publicUrl : true,
        sidebar : false
      });

      $routeProvider
      .when('/home', {
        redirectTo: '/campaigns'
      })
      .when('/route-not-found', {
      });

      // TODO: move these to non-public and authenticate
      $routeProvider
      .when('/datamart/overview', {
        templateUrl: 'src/core/datamart/index.html',
        publicUrl : true
      })
      .when('/datamart/items', {
        templateUrl: 'src/core/datamart/items/view.all.html',
        publicUrl : true
      })
      .when('/datamart/items/:itemId', {
        templateUrl: 'src/core/datamart/items/view.one.html',
        publicUrl : true
      })
      .when('/datamart/categories/', {
        templateUrl: 'src/core/datamart/categories/browse.html',
        publicUrl : true
      })
      .when('/datamart/categories/:categoryId', {
        templateUrl: 'src/core/datamart/categories/browse.html',
        publicUrl : true
      })
      .when('/datamart/users', {
        templateUrl: 'src/core/datamart/users/view.all.html',
        publicUrl : true
      })
      .when('/datamart/users/:userId', {
        templateUrl: 'src/core/datamart/users/view.one.html',
        publicUrl : true
      });

      $routeProvider
      .otherwise({
        publicUrl: true,
        templateUrl: 'src/core/layout/route-not-found.html'
      });
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
        if(operation === "put") {
          delete element.metadata;
        }
        return element;

      });

      // configure the response extractor
      RestangularProvider.setResponseExtractor(function(response, operation, what, url) {

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


  navigatorApp.config(['$httpProvider', function ($httpProvider) {

    $httpProvider.interceptors.push(['$q', function ($q){

      return {
        'response' : function(response) {
          return response;
        },

        'responseError': function(rejection) {
          return rejection;

          /*

             if (rejection.status == 401) {

          // check if the error is an AccesTokenCreationError or a RefreshTokenCreationError

          // check if the AuthenticationService is already trying to reconnect

          AuthenticationService.createAccessToken().then(function() {
          // success
          console.log("http interceptor : acces token renewed successfully");

          // resend the queue requests

          },
          function() {
          // failure : redirect to login page

          // flush the queue requests

          // redirect
          $location.path('/login');
          });


          }

*/
        }
      };
    }]);
  }]);


  /* work to be performed after module loading */

  // add an event listener on $routeChangeStart to restrict access to
  // secured part of the app

  navigatorApp.run([
    '$rootScope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', "lodash", "core/login/constants",
    function ($rootScope, $location, $log, AuthenticationService, Session, _, LoginConstants) {

      var defaults = _.partialRight(_.assign, function(a, b) {
        return typeof a === 'undefined' ? b : a;
      });

      function updateWorkspaces() {
        $rootScope.currentOrganisation = Session.getCurrentWorkspace().organisation_name;
      }
      $rootScope.$on(LoginConstants.WORKSPACE_CHANGED, updateWorkspaces);
      $rootScope.$on(LoginConstants.LOGIN_SUCCESS, updateWorkspaces);

      $rootScope.$on('$routeChangeStart', function (event, next, current) {

        $log.debug("$routeChangeStart  next : ", next);


        var options = defaults(next, {
          publicUrl : false,
          sidebar : true,
          topbar : true
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
})();
