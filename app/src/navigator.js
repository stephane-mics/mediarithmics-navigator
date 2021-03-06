define(['angularAMD', 'app', 'lodash', 'async', 'jquery', 'plupload', 'd3', 'moment', 'ui.router.extras', 'exports','module'], function (angularAMD, navigator, lodash, async, jquery, plupload, d3, moment,uiRouterExtras, exports, module) {
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

// configure the application
  navigator.config([
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
          .state('init-session/withOrganisation', {
            url:'/init-session/:organisationId',
            templateUrl: 'src/core/login/init-session.html',
            publicUrl: true,
            sidebar: false
          }).state('init-session/withoutOrganisation', {
            url:'/init-session',
            templateUrl: 'src/core/login/init-session.html',
            publicUrl: true,
            sidebar: false
          });

      $urlRouterProvider.when('/', '/home');
      $urlRouterProvider.when('/home', '/campaigns');


      // TODO: move these to non-public and authenticate
      $stateProvider
        .state('datamart/overview', {
          url:'/datamart/overview',
          templateUrl: 'src/core/datamart/index.html'
        })
        .state('datamart/items', {
          url:'/datamart/items',
          templateUrl: 'src/core/datamart/items/view.all.html'
        })
        .state('datamart/items/:catalogId/:itemId', {
          url:'/datamart/items/:catalogId/:itemId',
          templateUrl: 'src/core/datamart/items/view.one.html'
        })
        .state('datamart/categories/:catalogId', {
          url:'/datamart/categories/:catalogId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/categories/:catalogId/:categoryId', {
          url:'/datamart/categories/:catalogId/:categoryId',
          templateUrl: 'src/core/datamart/categories/browse.html'
        })
        .state('datamart/users', {
          url:'/datamart/users',
          templateUrl: 'src/core/datamart/users/view.all.html'
        })
        .state('datamart/users/:userId', {
          url:'/datamart/users/:userId',
          templateUrl: 'src/core/datamart/users/view.one.html'
        });


      $logProvider.debugEnabled(true);
    }
  ]);


// configure the Restangular Service
  navigator.config([
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

  navigator.config([
    '$futureStateProvider',
    function ($futureStateProvider) {
      function ngloadStateFactory($q, futureState) {
        var ngloadDeferred = $q.defer();
        require([ "ngload!" + futureState.src , 'ngload', 'angularAMD'],
          function ngloadCallback(result, ngload, angularAMD) {
            angularAMD.processQueue();
            ngloadDeferred.resolve(result.entryState);
          });
        return ngloadDeferred.promise;
      }

      $futureStateProvider.stateFactory('ngload', ngloadStateFactory);

      navigator.$futureStateProvider = $futureStateProvider;
    }]);


  /* work to be performed after module loading */

// add an event listener on $routeChangeStart to restrict access to
// secured part of the app

  navigator.run([
    '$rootScope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', "lodash", "core/login/constants","$state",
    function ($rootScope, $location, $log, AuthenticationService, Session, _, LoginConstants, $state) {

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
              if(toParams.organisation_id) {
                $location.path('/init-session/'+toParams.organisation_id);
              } else {
                $location.path('/init-session');

              }
            }
          } else if (AuthenticationService.hasRefreshToken()) {
            // keep the current path in memory
            AuthenticationService.pushPendingPath($location.url());

            // redirect to the remember-me page
            $location.path('/remember-me');
          } else {

            AuthenticationService.pushPendingPath($location.url());
            // redirect to login
            $location.path('/login');
          }
        }
      });

    }
  ]);

  var r = angularAMD.bootstrap(navigator, true, document.body);
  exports.app = navigator;


});
