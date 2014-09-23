define(['./module', 'navigator'], function (module, navigator) {
	'use strict';

	var plugins = angular.module('core/common/plugins');

	plugins.factory('core/common/plugins/pluginService', [ '$q', '$log', '$document', 'Restangular', "jquery",
		function ($q, $log, $document, Restangular, $) {


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

					pluginService.createState = function (name, url, template) {
						return {
							name: name,
							url: pluginService.getBaseUrl() + url,
							templateUrl: pluginService.getBaseTemplateUrl() + template
						};
					};
					return pluginService;
				});
			};
			return pluginService;
		}
	]);


});