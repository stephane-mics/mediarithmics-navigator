define(['navigator', 'angularAMD', 'lodash', 'async', 'jquery', 'plupload', 'd3', 'moment', 'ui.router.extras', 'exports', 'module', 'plugins'],
  function (navigator, angularAMD, lodash, async, jquery, plupload, d3, moment, uiRouterExtras, exports, module, plugins) {
  "use strict";

    console.log("In navigator setup");
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

  /**
   * Add an event listener on $stateChangeStart to restrict access to secured part of the app
   */
  navigator.run(['$rootScope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', "lodash", "core/login/constants",
    function ($rootScope, $location, $log, AuthenticationService, Session, _, LoginConstants) {
      console.log("You lost. Navigator running...");
      var defaults = _.partialRight(_.assign, function (a, b) {
        return typeof a === 'undefined' ? b : a;
      });

      function updateWorkspaces() {
        $rootScope.currentOrganisation = Session.getCurrentWorkspace().organisation_name;
        $rootScope.currentOrganisationId = Session.getCurrentWorkspace().organisation_id;
      }

      $rootScope.$on(LoginConstants.WORKSPACE_CHANGED, updateWorkspaces);
      $rootScope.$on(LoginConstants.LOGIN_SUCCESS, updateWorkspaces);

      $rootScope.$on('$stateChangeStart', function (event, toState, toParams, fromState, fromParams) {
        $log.debug("$stateChangeSuccess  toState : ", toState);

        var options = defaults(toState, {
          publicUrl: false,
          sidebar: true,
          topbar: true
        });

        if (Session.isInitialized() && Session.getCurrentWorkspace().organisation_id !== toParams.organisation_id) {
          Session.updateWorkspace(toParams.organisation_id);
        }
        $rootScope.sidebar = options.sidebar;
        var urlMatch = toState.name.match(/\/?(\w+)\/?/);
        if (urlMatch) {
          $rootScope.category = urlMatch[1];
        }
        $rootScope.topbar = options.topbar;
        if (!options.publicUrl) {

          if (AuthenticationService.hasAccessToken()) {
            if (!Session.isInitialized()) {
              AuthenticationService.pushPendingPath($location.url());
              if (toParams.organisation_id) {
                $location.path('/init-session/' + toParams.organisation_id);
              } else {
                $location.path('/init-session');
              }
            }
          } else if (AuthenticationService.hasRefreshToken()) {
            // Keep the current path in memory
            AuthenticationService.pushPendingPath($location.url());
            // Redirect to the remember-me page
            $location.path('/remember-me');
          } else {
            AuthenticationService.pushPendingPath($location.url());
            // Redirect to login
            $location.path('/login');
          }
        }
      });
    }
  ]);

  angularAMD.bootstrap(navigator, true, document.body);
});
