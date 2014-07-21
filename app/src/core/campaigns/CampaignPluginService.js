define(['./module'], function () {
  'use strict';


  var module = angular.module('core/campaigns');


  /* define the Authentication service */
  module.factory('core/campaigns/CampaignPluginService', [
    '$log', '$q', 'lodash',
    function($log, $q, _) {

      var campaignTemplates = [{
        name : "Multi Targeting",
        template_group_id : "com.mediarithmics.campaign.display",
        template_artifact_id : "default-template",
        image : "/images/plugins/multi-targeting-small.png",
        editor : {
          create_path : "/{organisation_id}/campaigns/display/expert/edit/{id}",
          edit_path : "/{organisation_id}/campaigns/display/expert/edit/{id}"
        }
      }, {
        name : "Keywords Targeting",
        template_group_id : "com.mediarithmics.campaign.display",
        template_artifact_id : "keywords-targeting-template",
        image : "/images/plugins/keywords-targeting-small.png",
        editor : {
          create_path : "/{organisation_id}/campaigns/display/keywords",
          edit_path : "/{organisation_id}/campaigns/display/keywords/{id}"
        }
      }, {
        name : "Email campaign",
        template_group_id : "com.mediarithmics.campaign.email",
        template_artifact_id : "expert-template",
        image : "/images/plugins/email-campaign-expert-small.png",
        editor : {
          create_path : "/{organisation_id}/campaigns/email/expert",
          edit_path : "/{organisation_id}/campaigns/email/expert/{id}"
        }
      }];

      function CampaignPluginService() {}

      CampaignPluginService.prototype = {

        /**
         * Get all the campain templates, asynchronously.
         * @return {$q.promise} the promise with the templates.
         */
        getAllCampaignTemplates : function () {
          var deferred = $q.defer();

          setTimeout(function () {
            deferred.resolve(campaignTemplates);
          }, 0);

          return deferred.promise;
        },

        /**
         * Get the campaign template for a given group/artifact id.
         * @param {String} templateGroupId the group id of the template.
         * @param {String} templateArtifactId the artifact id of the template.
         * @return {$q.promise} the promise with the template.
         */
        getCampaignTemplate : function (templateGroupId, templateArtifactId) {
          var deferred = $q.defer();
          this.getAllCampaignTemplates().then(function success(templates){
            var matchingTemplate = _.find(templates, function (template) {
              return template.template_group_id === templateGroupId && template.template_artifact_id === templateArtifactId;
            });
            if (matchingTemplate) {
              deferred.resolve(matchingTemplate);
            } else {
              deferred.reject(new Error("can't find a template for " + templateGroupId + ":" + templateArtifactId));
            }
          });
          return deferred.promise;
        },

        /**
         * Get the campaign editor for a given group/artifact id.
         * @param {String} templateGroupId the group id of the template.
         * @param {String} templateArtifactId the artifact id of the template.
         * @return {$q.promise} the promise with the editor.
         */
        getEditor : function(templateGroupId, templateArtifactId) {
          var deferred = $q.defer();

          this.getCampaignTemplate(templateGroupId, templateArtifactId).then(
            function success(template){
              deferred.resolve(template.editor);
            }, deferred.reject
          );


          return deferred.promise;
        }
      };

      return new CampaignPluginService();
    }
  ]);
});

