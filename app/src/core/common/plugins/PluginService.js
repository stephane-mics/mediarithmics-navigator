define(['./module', 'navigator'], function (module, navigator) {
  'use strict';

  module.factory('core/common/plugins/pluginService', [ function () {
      var pluginService = {};

      pluginService.registerPlugin = function (moduleName, pluginBase, url) {
        navigator.app.$futureStateProvider.futureState({src: pluginBase + '/main.js', type: "ngload", "stateName": moduleName,
          "urlPrefix": url + "/home", properties: { "hello": "test" }});

        define(moduleName + '.conf', [], function () {
          var data = {};

          var pluginService = {};

          data.properties = { "hello": "test" };
          data.pluginBase = pluginBase;
          data.baseUrl = url;

          pluginService.getProperties = function () {
            return data.properties;
          };

          pluginService.getBaseTemplateUrl = function () {
            return data.pluginBase;
          };

          pluginService.getBaseUrl = function () {
            return data.baseUrl;
          };

          pluginService.createState = function (name, url, template, navbar) {
            //$log.debug("Creating: " + name + ", navbar: " + navbar);
            return {
              name: name,
              url: pluginService.getBaseUrl() + url,
              templateUrl: pluginService.getBaseTemplateUrl() + template,
              data: { navbar: pluginService.getBaseTemplateUrl() + navbar }
            };
          };

          pluginService.loadCss = function(template) {
            var link = document.createElement("link");
            link.type = "text/css";
            link.rel = "stylesheet";
            link.href = pluginService.getBaseTemplateUrl() + template;
            document.getElementsByTagName("head")[0].appendChild(link);
          };
          return pluginService;
        });
      };
      return pluginService;
    }
  ]);


});
