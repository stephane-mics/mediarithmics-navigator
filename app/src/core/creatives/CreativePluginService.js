define(['./module'], function (module) {
  'use strict';


  /* define the Authentication service */
  module.factory('core/creatives/CreativePluginService', [
    '$log', '$q', 'lodash',
    function($log, $q, _) {

      var creativeTemplates = [{
        name : "Banner Quick Upload",
        editor_group_id : "com.mediarithmics.creative.display",
        editor_artifact_id : "basic-editor",
        image : "/images/plugins/creative-mcs-basic.png",
        editor : {
          create_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/create",
          edit_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/basic-editor/edit/{id}"
        }
      }, {
        name : "Banner Expert Mode",
        editor_group_id : "com.mediarithmics.creative.display",
        editor_artifact_id : "default-editor",
        image : "/images/plugins/creative-mcs-default.png",
        editor : {
          create_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/default-editor/create",
          edit_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/default-editor/edit/{id}"
        }
      }
      // UNCOMMENT TO ADD THE FACEBOOK AD EDITOR
      //  , {
      //  name : "Facebook Expert Mode",
      //  editor_group_id : "com.mediarithmics.creative.display",
      //  editor_artifact_id : "default-editor",
      //  image : "/images/plugins/creative-mcs-facebook.png",
      //  editor : {
      //    create_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/facebook/create",
      //    edit_path : "/{organisation_id}/creatives/com.mediarithmics.creative.display/default-editor/edit/{id}"
      //  }
      //}
      ];

      function CreativePluginService() {}

      CreativePluginService.prototype = {

        /**
         * Get all the creative templates, asynchronously.
         * @return {$q.promise} the promise with the templates.
         */
        getAllCreativeTemplates : function () {
          var deferred = $q.defer();

          setTimeout(function () {
            deferred.resolve(creativeTemplates);
          }, 0);

          return deferred.promise;
        },

        /**
         * Get the creative template for a given editor group/artifact id.
         * @param {String} editorGroupId the group id of the editor.
         * @param {String} editorArtifactId the artifact id of the editor.
         * @return {$q.promise} the promise with the template.
         */
        getCreativeTemplateFromEditor : function (editorGroupId, editorArtifactId) {
          var deferred = $q.defer();
          this.getAllCreativeTemplates().then(function success(templates){
            var matchingTemplate = _.find(templates, function (template) {
              return template.editor_group_id === editorGroupId && template.editor_artifact_id === editorArtifactId;
            });
            if (matchingTemplate) {
              deferred.resolve(matchingTemplate);
            } else {
              deferred.reject(new Error("can't find a template for " + editorGroupId + ":" + editorArtifactId));
            }
          });
          return deferred.promise;
        },

        /**
         * Get the creative editor for a given group/artifact id.
         * @param {String} editorGroupId the group id of the template.
         * @param {String} editorArtifactId the artifact id of the template.
         * @return {$q.promise} the promise with the editor.
         */
        getEditor : function(editorGroupId, editorArtifactId) {
          var deferred = $q.defer();

          this.getCreativeTemplateFromEditor(editorGroupId, editorArtifactId).then(
            function success(template){
              deferred.resolve(template.editor);
            }, deferred.reject
          );
          return deferred.promise;
        }
      };

      return new CreativePluginService();
    }
  ]);
});

