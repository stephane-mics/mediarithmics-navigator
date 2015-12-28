define(['./module'], function (module) {
  'use strict';

  /**
   * Creative list controller
   */

  module.controller('core/creatives/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/common/auth/Session', '$uibModal', '$state', '$stateParams', 'core/creatives/CreativePluginService', 'lodash', '$filter', 'core/configuration',
    function ($scope, $location, $log, Restangular, Session, $uibModal, $state, $stateParams, creativePluginService, _, $filter, configuration) {
      /**
       * Variables
       */
      // Pagination
      $scope.currentPageCreative = 1;
      $scope.itemsPerPage = 10;
      // Archived
      $scope.displayArchived = false;
      var archivedParams = {
        max_results: 200,
        organisation_id: Session.getCurrentWorkspace().organisation_id
      };
      // Identify administrator
      $scope.organisationName = function (id) {
        return Session.getOrganisationName(id);
      };
      $scope.administrator = Session.getCurrentWorkspace().administrator;
      // Creative Templates
      creativePluginService.getAllCreativeTemplates().then(function (templates) {
        $scope.creativeTemplates = templates;
      });
      // Quick Creative Upload Options
      $scope.pluploadOptions = {
        multi_selection: true,
        url: configuration.ADS_UPLOAD_URL + "?organisation_id=" + Session.getCurrentWorkspace().organisation_id,
        filters: {
          mime_types: [
            {title: "Image files", extensions: "jpg,jpeg,png,gif"},
            {title: "Flash files", extensions: "swf"}
          ],
          max_file_size: "200kb"
        }
      };
      $scope.uploadOptions = {
        files: $scope.assets,
        automaticUpload: false,
        filesOverride: false,
        uploadedFiles: []
      };
      // Creative Edit Url
      $scope.getEditUrlForCreative = _.memoize(function (creative) {
        var result = {url: ""};
        var editorPromise = creativePluginService.getEditor(creative.editor_group_id, creative.editor_artifact_id);
        editorPromise.then(function success(editor) {
          result.url = editor.edit_path.replace(/{id}/g, creative.id).replace(/{organisation_id}/, Session.getCurrentWorkspace().organisation_id);
        }, function failure() {
          result.url = "/";
        });

        return result;
      }, function resolver(creative) {
        return creative.id;
      });

      /**
       * Watchers
       */

      $scope.$watch('displayArchived', function (newValue, oldValue, scope) {
        // uncomment to filter archived
        archivedParams.archived = newValue;

        Restangular.all('creatives').getList(archivedParams).then(function (creatives) {
          $scope.creatives = creatives;
        });
      });

      /**
       * Methods
       */

      $scope.create = function (template) {

        if (template.editor_group_id === "com.mediarithmics.creative.display" && template.editor_artifact_id === "basic-editor") {
          var modal = $uibModal.open({
            templateUrl: 'src/core/creatives/plugins/display-ad/basic-editor/upload-creative.html',
            scope: $scope,
            backdrop: 'static',
            controller: 'core/creatives/plugins/display-ad/basic-editor/UploadCreativeController',
            size: 'lg'
          });
          modal.result.then(function(savedCreatives) {
            if (savedCreatives) {
              $state.transitionTo($state.current, $stateParams, {
                reload: true, inherit: true, notify: true
              });
            }
          });
        } else {
          var organisationId = Session.getCurrentWorkspace().organisation_id;
          var location = template.editor.create_path.replace(/{id}/g, "").replace(/{organisation_id}/, organisationId);
          $location.path(location);
        }
      };

      $scope.filteredCreatives = function () {
        var list1 = $filter('filter')($scope.creatives, $scope.creativename);
        return $filter('filter')(list1, $scope.creativeformat);
      };

      $scope.showCreative = function (creative) {
        $location.path($scope.getEditUrlForCreative(creative));
      };

      $scope.deleteCreative = function (creative) {
        var newScope = $scope.$new(true);
        newScope.creative = creative;
        $uibModal.open({
          templateUrl: 'src/core/creatives/delete.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/creatives/DeleteController'
        });
      };

      $scope.archiveCreative = function (creative) {
        var newScope = $scope.$new(true);
        newScope.creative = creative;
        $uibModal.open({
          templateUrl: 'src/core/creatives/archive.html',
          scope: newScope,
          backdrop: 'static',
          controller: 'core/creatives/ArchiveController'
        });
      };

      $scope.unArchiveCreative = function (creative) {
        creative.archived = false;

        creative.put().then(function () {
          // $state.reload();
          // see https://github.com/angular-ui/ui-router/issues/582
          $state.transitionTo($state.current, $stateParams, {
            reload: true, inherit: true, notify: true
          });
        });
      };
    }
  ]);

});
