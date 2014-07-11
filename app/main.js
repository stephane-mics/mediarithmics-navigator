require.config({

  paths: {
    "jquery": "../bower_components/jquery/jquery",
    "angular": "../bower_components/angular/angular",
    'angularAMD': '../bower_components/angularAMD/angularAMD',
    'ngload': '../bower_components/angularAMD/ngload',
    "jqCookie": "../bower_components/jquery-cookie/jquery.cookie",
    'core/configuration': '../conf/app-configuration',
    "jqDaterangepicker": "../bower_components/bootstrap-daterangepicker/daterangepicker",


    "lodash": "../bower_components/lodash/dist/lodash.compat",
    "d3": "../bower_components/d3/d3",
    "nv.d3": "../bower_components/nvd3/nv.d3",

    "moment": "../bower_components/momentjs/moment",
    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",

    "autofill-event": "../bower_components/autofill-event/src/autofill-event",


    "async": "../bower_components/async/lib/async",
    "moxie": "../bower_components/plupload/js/moxie",
    "plupload": "../bower_components/plupload/js/plupload.dev",


    // Angular JS modules
    "nvd3ChartDirectives": "../bower_components/angularjs-nvd3-directives/dist/angularjs-nvd3-directives",
    "ngResource": "../bower_components/angular-resource/angular-resource",
    "ngCookies": "../bower_components/angular-cookies/angular-cookies",
    "ngSanitize": "../bower_components/angular-sanitize/angular-sanitize",
    "ngRoute": "../bower_components/angular-route/angular-route",
    "restangular": "../bower_components/restangular/dist/restangular",
    "ui": "../bower_components/angular-ui-utils/ui-utils",
    "ngBootstrap": "../bower_components/ng-bs-daterangepicker/src/ng-bs-daterangepicker",
    "ngTable": "../bower_components/ng-table/ng-table",
    "checklist-model": "../bower_components/checklist-model/checklist-model",
    "ui.bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap-tpls"

  },
  shim: {
    'angular': {'exports': 'angular'},
    'angularAMD': ['angular'],
    "ngCookies": ['angular'],
    'ngResource': ['angular'],
    'ui.bootstrap': ['angular'],
    'ngSanitize': ['angular'],
    'ngRoute': ['angular'],
    'checklist-model': ['angular'],
    'restangular': ['ngResource', 'lodash'],
    'nvd3ChartDirectives': ['angular', 'd3'],
    'bootstrap': ['jquery'],
    'jqCookie': ['jquery'],
    'jqDaterangepicker': ['jquery'],
    "autofill-event": ['jquery'],
    'ngBootstrap': ['angular', 'bootstrap', 'jqDaterangepicker'],
    'ui': ['angular'],
    'ngTable': ['angular'],
    'core/configuration': ['angular'],
    'plupload': {deps:[ 'moxie'], "exports": "plupload"},
    "nv.d3": {deps: ['d3.global'], "exports": "nv"},
    'ngload': ['angularAMD']
  },
  deps: ['navigator']
});

// workaround for nvd3 using global d3
define("d3.global", ["d3"], function (_) {
  d3 = _;
});
