'use strict';

function supportsHtml5Storage() {
  try {
    return 'localStorage' in window && window['localStorage'] !== null;
  } catch (e) {
    return false;
  }
}

function setupLocalStorage() {
  if (supportsHtml5Storage) {
    var plugins = [];
    var pluginName = "admin";
    //plugins[0] = JSON.stringify({name: pluginName, pluginBase: config.ADMIN_PLUGIN_URL, url: "/admin"});
    plugins[0] = JSON.stringify({
      name: pluginName,
      moduleName: pluginName + ".conf",
      pluginBase: "http://127.0.0.1:9001/",
      url: "/admin"
    });
    localStorage.moduleName = pluginName + ".conf";
    localStorage.plugins = JSON.stringify(plugins);
  }
}


setupLocalStorage();
console.log("Local storage setup");
