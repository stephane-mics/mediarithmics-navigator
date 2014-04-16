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

    'core/configuration',
    'core/layout',
    'core/keywords',
    'core/adgroups',
    'core/campaigns',
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
        publicUrl : true
      })
      .when('/logout', {
        templateUrl: 'src/core/login/logout.html',
        publicUrl : true
      })
      .when('/remember-me', {
        templateUrl: 'src/core/login/remember-me.html',
        publicUrl : true
      })
      .when('/init-session', {
        templateUrl: 'src/core/login/init-session.html',
        publicUrl : true
      });

      $routeProvider
      .when('/home', {
        redirectTo: '/display-campaigns'
      })
      .when('/display-campaigns', {
        templateUrl: 'src/core/campaigns/list.html'
      })
      .when('/display-campaigns/select-campaign-template', {
        templateUrl: 'src/core/campaigns/create.html'
      })
      .when('/display-campaigns/expert/edit-campaign/:campaign_id', {
        templateUrl:'src/core/campaigns/expert/edit-campaign.html'
      })
      .when('/display-campaigns/expert/edit-ad-group/:ad_group_id', {
        templateUrl:'src/core/campaigns/expert/edit-ad-group.html'
      })
       .when('/display-campaigns/edit-expert/:campaign_id', {
        templateUrl:'src/core/campaigns/expert/edit-campaign.html'
      })

      .when('/route-not-found', {
      });

      // TODO: move these to non-public and authenticate
      $routeProvider
      .when('/datamart', {
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

      // configure the response extractor
      RestangularProvider.setResponseExtractor(function(response, operation, what, url) {

        // This is a get for a list
        var newResponse;
        if (operation === "getList") {

          // this is an array
          newResponse = response.data;
          // metadata ..
          // newResponse.metadata = response.data.meta;
        } else {

          // This is an element
          newResponse = response.data;

          // add paging to metadata (datamart)
          newResponse.metadata = {
            paging: {
              count: response.count,
              offset: response.offset,
              limit: response.limit
            }
          };

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

      $rootScope.$on('$routeChangeStart', function (event, next, current) {

        $log.debug("$routeChangeStart  next : ", next);

        if (!next.publicUrl) {

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
