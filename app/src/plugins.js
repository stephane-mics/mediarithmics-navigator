(function () {
  'use strict';

  define("optional", [], {
    load: function (moduleName, parentRequire, onload, config) {
      var onLoadSuccess = function (moduleInstance) {
        // Module successfully loaded, call the onload callback so that
        // RequireJS can work its internal magic.
        onload(moduleInstance);
      };

      var onLoadFailure = function (err) {
        // Optional module failed to load.
        var failedId = err.requireModules && err.requireModules[0];

        // Undefine the module to cleanup internal stuff in requireJS
        requirejs.undef(failedId);

        // Now define the module instance as a simple empty object
        // (NOTE: you can return any other value you want here)
        define(failedId, [], function () {
          return false;
        });

        // Now require the module make sure that requireJS thinks
        // that is it loaded. Since we've just defined it, RequireJS
        // will not attempt to download any more script files and
        // will just call the onLoadSuccess handler immediately.
        parentRequire([failedId], onLoadSuccess);
      };

      parentRequire([moduleName], onLoadSuccess, onLoadFailure);
    }
  });

  /**
   * Retrieve plugins info from local storage
   * Define all plugins and add them to the plugins module dependencies in order to link them to the navigator app
   */
  var pluginsToRequire = [];

  if (localStorage.plugins) {
    var definePlugin = function (pluginInfo) {
      if (window.PLUGINS_CONFIGURATION[pluginInfo.name]) {
        pluginsToRequire.push({
          name: pluginInfo.name,
          url: window.PLUGINS_CONFIGURATION[pluginInfo.name].url + '/' + pluginInfo.setupFile
        });
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
    };

    var pluginsInfo = JSON.parse(localStorage.plugins);
    for (var i = 0; i < pluginsInfo.length; ++i) {
      definePlugin(pluginsInfo[i]);
    }
  }

  /**
   * RequireJS Plugins Module
   * Load plugins by calling them through require dependency retrieval function.
   * Each plugin depends on a .conf module that is generated above.
   */
  define(['navigator', 'optional'], function () {
    var requirePlugin = function (plugin) {
      require(["optional!" + plugin.url], function (loaded) {
        if (window.PLUGINS_CONFIGURATION[plugin.name]) {
          window.PLUGINS_CONFIGURATION[plugin.name].isLoaded = loaded;
        }
      });
    };

    for (var i = 0; i < pluginsToRequire.length; ++i) {
      requirePlugin(pluginsToRequire[i]);
    }
  });
}());