define(['app-setup', 'angularAMD'],
  function (app, angularAMD) {
    'use strict';

    app.run(['$rootScope', '$location', '$log', 'core/common/auth/AuthenticationService', 'core/common/auth/Session', "lodash", "core/login/constants", "core/common/ErrorReporting",
      function ($rootScope, $location, $log, AuthenticationService, Session, _, LoginConstants, ErrorReporting) {
        var defaults = _.partialRight(_.assign, function (a, b) {
          return typeof a === 'undefined' ? b : a;
        });

        ErrorReporting.setup();

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
            topbar: true
          });

          if (Session.isInitialized() && Session.getCurrentWorkspace().organisation_id !== toParams.organisation_id) {
            Session.updateWorkspace(toParams.organisation_id);
          }

          if (toState.data && toState.data.category){
            $rootScope.category = toState.data.category;
          } else {
            var urlMatch = toState.name.match(/\/?(\w+)\/?/);
            if (urlMatch) {
              $rootScope.category = urlMatch[1];
            }
          }

          $rootScope.topbar = options.topbar;
          if (!options.publicUrl) {

            if (AuthenticationService.hasAccessToken()) {
              if (AuthenticationService.hasRefreshToken()) {
                AuthenticationService.setupTokenRefresher();
              }
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

    angularAMD.bootstrap(app, true, document.body);
    return app;
  });
