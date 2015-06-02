'use strict';

define('admin.conf', ['navigator'], function () {
  var data = {};
  var pluginService = {};

  data.pluginBase = "http://127.0.0.1:9001/";
  data.baseUrl = "/admin";

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

/**
 * Plugins Require Module
 * Load plugins by calling them through require dependency retrieval function.
 * Each plugin depends on a .conf module that is generated above.
 */
// TODO Make a list of plugins urls to be retrieved like 'http://127.0.0.1:9001/main.js'
define(['app', 'navigator', 'http://127.0.0.1:9001/main.js'], function () {
  //function loadPlugins() {
  //  console.log("Loading plugins -> ", JSON.parse(localStorage.plugins));
  //  var plugins = JSON.parse(localStorage.plugins);
  //  for (var i = 0; i < plugins.length; i++) {
  //    var plugin = JSON.parse(plugins[i]);
  //    console.log("Name: ", plugin.name, "Plugin Base: ", plugin.pluginBase, "Url: ", plugin.url);
  //  }
  //}
  //
  //loadPlugins();
}());