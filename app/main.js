require.config({
  baseUrl: "/src",
  paths: {
    "jquery": "../bower_components/jquery/jquery",
    "angular": "../bower_components/angular/angular",
    "angularAMD": "../bower_components/angularAMD/angularAMD",
    "ngload": "../bower_components/angularAMD/ngload",
    "jqCookie": "../bower_components/jquery-cookie/jquery.cookie",
    "moment": "../bower_components/momentjs/moment",
    "jsplumb": "../bower_components/jsplumb/dist/js/dom.jsPlumb-1.7.2",

    "lodash": "../bower_components/lodash/dist/lodash.compat",
    "d3": "../bower_components/d3/d3",
    "nv.d3": "nvd3-templates/nv.d3",

    "bootstrap": "../bower_components/bootstrap/dist/js/bootstrap",
    "jqDaterangepicker": "../bower_components/bootstrap-daterangepicker/daterangepicker",

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
    "ui.router": "../bower_components/angular-ui-router/release/angular-ui-router",
    "ui.router.extras": "../bower_components/ui-router-extras/release/ct-ui-router-extras",
    "ngBootstrap": "../bower_components/ng-bs-daterangepicker/src/ng-bs-daterangepicker",
    "ngTable": "../bower_components/ng-table/ng-table",
    "checklist-model": "../bower_components/checklist-model/checklist-model",
    "ui.bootstrap": "../bower_components/angular-bootstrap/ui-bootstrap-tpls"
  },
  shim: {
    'angular': {deps: ['jquery'], exports: 'angular'},
    'angularAMD': ['angular'],
    'ngCookies': ['angular'],
    'ngResource': ['angular'],
    'ui.bootstrap': ['angular'],
    'ngSanitize': ['angular'],
    'ngRoute': ['angular'],
    'checklist-model': ['angular'],
    'restangular': ['ngResource', 'lodash'],
    'nvd3ChartDirectives': ['angular', 'd3'],
    'bootstrap': ['jquery'],
    'jqCookie': ['jquery'],
    'jqDaterangepicker': ['jquery', 'moment'],
    'autofill-event': ['jquery'],
    'ngBootstrap': ['angular', 'bootstrap', 'jqDaterangepicker'],
    'ui': ['angular'],
    'ngTable': ['angular'],
    'plupload': {deps: ['moxie'], exports: 'plupload'},
    'ui.router': ['angular'],
    'ui.router.extras': ['angular', 'ui.router'],
    'nv.d3': {deps: ['nvd3-templates/d3.global']},
    'ngload': ['angularAMD'],
    // Navigator configuration
    'core/configuration': ['angular']
  },
  deps: ['navigator-setup']
});