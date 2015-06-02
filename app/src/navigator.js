define(['app-setup', 'navigator-setup', 'angularAMD', 'lodash', 'async', 'jquery', 'plupload', 'd3', 'moment', 'ui.router.extras', 'exports', 'module'],
  function (app, navigator, angularAMD, lodash, async, jquery, plupload, d3, moment, uiRouterExtras, exports, module) {
    "use strict";

    navigator.factory('lodash', [
      function () {
        return lodash;
      }
    ]);

    navigator.factory('async', [
      function () {
        return async;
      }
    ]);

    navigator.factory('jquery', [
      function () {
        return jquery;
      }
    ]);

    navigator.factory('plupload', [
      function () {
        return plupload;
      }
    ]);

    navigator.factory('d3', [
      function () {
        return d3;
      }
    ]);

    navigator.factory('moment', [
      function () {
        return moment;
      }
    ]);

    // Load the brand css
    navigator.config(['core/configuration',
      function (configuration) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = configuration.ASSETS_URL + "/white_label/" + location.hostname + "/style.css";
        document.getElementsByTagName("head")[0].appendChild(link);
      }
    ]);

    // Configure the application
    navigator.config(["$stateProvider", "$logProvider", "$urlRouterProvider",
      function ($stateProvider, $logProvider, $urlRouterProvider) {
        $stateProvider
          .state('login', {
            url: '/login',
            templateUrl: 'src/core/login/main.html',
            publicUrl: true,
            sidebar: false
          })
          .state('email-sent', {
            url: '/email-sent',
            templateUrl: 'src/core/password/email-sent.html',
            publicUrl: true,
            sidebar: false
          })
          .state('request-password-reset', {
            url: '/request-password-reset?error',
            templateUrl: 'src/core/password/request-password-reset.html',
            publicUrl: true,
            sidebar: false
          })
          .state('set-password', {
            url: '/set-password?email&token',
            templateUrl: 'src/core/password/set-password.html',
            publicUrl: true,
            sidebar: false
          })
          .state('logout', {
            url: '/logout',
            templateUrl: 'src/core/login/logout.html',
            publicUrl: true,
            sidebar: false
          })
          .state('remember-me', {
            url: '/remember-me',
            templateUrl: 'src/core/login/remember-me.html',
            publicUrl: true,
            sidebar: false
          })
          .state('init-session/withOrganisation', {
            url: '/init-session/:organisationId',
            templateUrl: 'src/core/login/init-session.html',
            publicUrl: true,
            sidebar: false
          }).state('init-session/withoutOrganisation', {
            url: '/init-session',
            templateUrl: 'src/core/login/init-session.html',
            publicUrl: true,
            sidebar: false
          });

        $urlRouterProvider.when('/', '/home');
        $urlRouterProvider.when('', '/home');
        $urlRouterProvider.when('/home', '/campaigns');
        $logProvider.debugEnabled(true);
      }
    ]);

    // Configure the Restangular Service
    navigator.config(['RestangularProvider', 'core/configuration',
      function (RestangularProvider, configuration) {
        // Set the api entry point
        RestangularProvider.setBaseUrl(configuration.WS_URL);
        RestangularProvider.addRequestInterceptor(function (element, operation, what, url) {
          if (operation === "put") {
            delete element.metadata;
          }
          return element;
        });
        // Configure the response extractor
        RestangularProvider.setResponseExtractor(function (response, operation, what, url) {
          // This is a get for a list
          var newResponse;
          if (operation === "getList") {
            // This is an array
            newResponse = response.data;
            // Add paging to metadata
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

    return navigator;
  });
