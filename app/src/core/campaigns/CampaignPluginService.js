define(['./module'], function (module) {
  'use strict';

  /* define the Authentication service */
  module.factory('core/campaigns/CampaignPluginService', [
    '$log', '$q', 'lodash',
    function ($log, $q, _) {

      var campaignTemplates = [
        {
          name: "Desktop & Mobile",
          editor_version_id: "11",
          group_id: "com.mediarithmics.campaign.display",
          artifact_id: "default-template",
          image: "/images/plugins/multi-targeting-small.png",
          editor: {
            create_path: "/{organisation_id}/campaigns/display/expert/edit/{id}",
            edit_path: "/{organisation_id}/campaigns/display/expert/edit/{id}"
          }
        },
        {
          name: "Simplified Keywords Targeting",
          editor_version_id: "12",
          group_id: "com.mediarithmics.campaign.display",
          artifact_id: "keywords-targeting-template",
          image: "/images/plugins/keywords-targeting-small.png",
          editor: {
            create_path: "/{organisation_id}/campaigns/display/keywords",
            edit_path: "/{organisation_id}/campaigns/display/keywords/{id}"
          },
        },
        {
          name: "Email campaign Default Editor",
          editor_version_id: "17",
          group_id: "com.mediarithmics.campaign.email",
          artifact_id: "default-editor",
          image: "/images/plugins/email-campaign-expert-small.png",
          editor: {
            create_path: "/{organisation_id}/campaigns/email/edit",
            edit_path: "/{organisation_id}/campaigns/email/edit/{id}"
          }
        }
      ];

      function CampaignPluginService() {
      }

      CampaignPluginService.prototype = {
        /**
         * Get all the campaign templates, asynchronously.
         * @return {$q.promise} the promise with the templates.
         */
        getAllDisplayCampaignEditors: function () {
          var deferred = $q.defer();

          setTimeout(function () {
            deferred.resolve(campaignTemplates);
          }, 0);

          return deferred.promise;
        },

        getAllCampaignEditors : function () {

          return this.getAllDisplayCampaignEditors();
        },

        /**
         * Get the campaign template for a given group/artifact id.
         * @param {String} groupId the group id of the editor.
         * @param {String} artifactId the artifact id of the editor.
         * @return {$q.promise} the promise with the template.
         */
        getCampaignEditor: function (groupId, artifactId) {
          var deferred = $q.defer();
          this.getAllCampaignEditors().then(function success(editors) {
            var matchingEditor = _.find(editors, function (editor) {
              return editor.group_id === groupId && editor.artifact_id === artifactId;
            });
            if (matchingEditor) {
              deferred.resolve(matchingEditor);
            } else {
              deferred.reject(new Error("Can't find a template for group_id:" + groupId + " / artifact_id: " + artifactId));
            }
          });
          return deferred.promise;
        },

        /**
         * Get the campaign template for a given group/artifact id.
         * @param {String} editorVersionId the editor version id of the editor.
         * @return {$q.promise} the promise with the template.
         */
        getCampaignEditorFromVersionId: function (editorVersionId) {
          var deferred = $q.defer();
          this.getAllCampaignEditors().then(function success(editors) {
            var matchingEditor = _.find(editors, function (editor) {
              return editor.editor_version_id === editorVersionId;
            });
            if (matchingEditor) {
              deferred.resolve(matchingEditor);
            } else {
              deferred.reject(new Error("Can't find a template for editor version id" + editorVersionId));
            }
          });
          return deferred.promise;
        },

        /**
         * Get the campaign editor for a given group/artifact id.
         * @param {String} groupId the group id of the editor.
         * @param {String} artifactId the artifact id of the editor.
         * @return {$q.promise} the promise with the editor.
         */
        getEditor: function (groupId, artifactId) {
          var deferred = $q.defer();

          this.getCampaignEditor(groupId, artifactId).then(
            function success(template) {
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
