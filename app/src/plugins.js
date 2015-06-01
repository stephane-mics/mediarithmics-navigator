define(['navigator'], function () {
  'use strict';

  function supportsHtml5Storage() {
    try {
      return 'localStorage' in window && window['localStorage'] !== null;
    } catch (e) {
      return false;
    }
  }

  function loadPlugin(moduleName, pluginBase, url) {
    define(moduleName + '.conf', [], function () {
      var data = {};
      var pluginService = {};

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

    require(["ngload!" + pluginBase + 'main.js', 'ngload', 'angularAMD'],
      function ngloadCallback(result, ngload, angularAMD) {
        angularAMD.processQueue();
      });
  }

  function setupLocalStorage() {
    if (supportsHtml5Storage) {
      var plugins = [];
      var pluginName = "admin";
      //plugins[0] = JSON.stringify({name: pluginName, pluginBase: config.ADMIN_PLUGIN_URL, url: "/admin"});
      plugins[0] = JSON.stringify({name: pluginName, pluginBase: "http://127.0.0.1:9001/", url: "/admin"});
      localStorage["plugins"] = JSON.stringify(plugins);
    }
  }

  function loadPlugins() {
    console.log(JSON.parse(localStorage["plugins"]));
    var plugins = JSON.parse(localStorage["plugins"]);
    for (var i = 0; i < plugins.length; i++) {
      var plugin = JSON.parse(plugins[i]);
      console.log("Name: ", plugin.name, "Plugin Base: ", plugin.pluginBase, "Url: ", plugin.url);
      loadPlugin(plugin.name, plugin.pluginBase, plugin.url);
    }
  }

  function asyncLoadPlugins() {
    var deferred = $.Deferred();
    setTimeout(function () {
      deferred.resolve(loadPlugins());
    }, 1000);
    return deferred;
  }

  console.log("Loading plugins");
  setupLocalStorage();
  console.log("Plugins loaded");
  return {
    loadPlugins: loadPlugins
  };
  //asyncLoadPlugins().then(define('loaded-plugins'));
});