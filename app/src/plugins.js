'use strict';

/**
 * Retrieve plugins info from local storage
 * Define all plugins and add them to the plugins module dependencies in order to link them to the navigator app
 */
var pluginsModuleDependencies = ['navigator'];
if (localStorage.plugins) {
  var pluginsInfo = JSON.parse(localStorage.plugins);
  for (var i = 0; i < pluginsInfo.length; ++i) {
    var pluginInfo = pluginsInfo[i];
    pluginsModuleDependencies.push(window.PLUGINS_CONFIGURATION[pluginInfo.name].url + pluginInfo.setupFile);
    define(pluginInfo.moduleName, ['navigator'], function () {
      var data = {};
      var pluginService = {};

      data.baseTemplateUrl = window.PLUGINS_CONFIGURATION[pluginInfo.name].url;
      data.baseUrl = pluginInfo.urn;

      pluginService.getProperties = function () {
        return data.properties;
      };

      pluginService.getBaseTemplateUrl = function () {
        return data.baseTemplateUrl;
      };

      pluginService.getBaseUrl = function () {
        return data.baseUrl;
      };

      pluginService.createState = function (name, url, template, navbar) {
        return {
          name: name,
          url: pluginService.getBaseUrl() + url,
          templateUrl: pluginService.getBaseTemplateUrl() + template,
          data: {navbar: pluginService.getBaseTemplateUrl() + navbar}
        };
      };

      pluginService.loadCss = function (template) {
        var link = document.createElement("link");
        link.type = "text/css";
        link.rel = "stylesheet";
        link.href = pluginService.getBaseTemplateUrl() + template;
        document.getElementsByTagName("head")[0].appendChild(link);
      };

      return pluginService;
    });
  }
}

/**
 * Plugins Require Module
 * Load plugins by calling them through require dependency retrieval function.
 * Each plugin depends on a .conf module that is generated above.
 */
define(pluginsModuleDependencies);