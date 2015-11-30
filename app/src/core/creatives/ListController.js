define(['./module'], function (module) {
  'use strict';

  /**
   * Creative list controller
   */

  module.controller('core/creatives/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/common/auth/Session', '$uibModal', '$state', '$stateParams', 'core/creatives/CreativePluginService', 'lodash', '$filter',
    function ($scope, $location, $log, Restangular, Session, $uibModal, $state, $stateParams, creativePluginService, _, $filter) {

      $scope.currentPageCreative = 1;
      $scope.itemsPerPage = 10;

      $scope.filteredCreatives = function () {
        var list1 = $filter('filter')($scope.creatives, $scope.creativename);
        return $filter('filter')(list1, $scope.creativeformat);
      };

      $scope.organisationName = function (id) {
        return Session.getOrganisationName(id);
      };
      $scope.administrator = Session.getCurrentWorkspace().administrator;

      var params = {
        max_results: 200,
        organisation_id: Session.getCurrentWorkspace().organisation_id
      };

      $scope.displayArchived = false;

      $scope.$watch('displayArchived', function (newValue, oldValue, scope) {
        // uncomment to filter archived
        params.archived = newValue;

        Restangular.all('creatives').getList(params).then(function (creatives) {
          $scope.creatives = creatives;
        });
      });

      $scope.newCreative = function () {
        $log.debug("> newCreative ");
        $location.path('/' + Session.getCurrentWorkspace().organisation_id + '/creatives/select-creative-template');
      };

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
