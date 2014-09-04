define(['./module'], function () {
  'use strict';

  var module = angular.module('core/creatives');

  /*
   * Creative list controller
   */

  module.controller('core/creatives/ListController', [
    '$scope', '$location', '$log', 'Restangular', 'core/creatives/DisplayAdService', 'core/common/auth/Session', '$modal', '$state', '$stateParams', 'core/creatives/CreativePluginService', 'lodash',
    function ($scope, $location, $log, Restangular,  DisplayAdService, Session, $modal, $state, $stateParams, creativePluginService, _) {

      $scope.organisationName = function (id ) { return Session.getOrganisationName(id);};
      $scope.administrator = Session.getCurrentWorkspace().administrator;

      var params = { organisation_id: Session.getCurrentWorkspace().organisation_id };
      if (Session.getCurrentWorkspace().administrator) {
        params = { administration_id: Session.getCurrentWorkspace().organisation_id };
      }

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
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + '/creatives/select-creative-template');
      };

      $scope.getEditUrlForCreative = _.memoize(function (creative) {
        var result = {url:""};
        var editorPromise = creativePluginService.getEditor(creative.editor_group_id,  creative.editor_artifact_id);
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
        $location.path( $scope.getEditUrlForCreative(creative) );
      };

      $scope.deleteCreative = function(creative) {
        var newScope = $scope.$new(true);
        newScope.creative = creative;
        $modal.open({
          templateUrl: 'src/core/creatives/delete.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/creatives/DeleteController'
        });
      };

      $scope.archiveCreative = function(creative) {
        var newScope = $scope.$new(true);
        newScope.creative = creative;
        $modal.open({
          templateUrl: 'src/core/creatives/archive.html',
          scope : newScope,
          backdrop : 'static',
          controller: 'core/creatives/ArchiveController'
        });
      };
      $scope.unArchiveCreative = function(creative) {
        creative.archived = false;

        creative.put().then(function (){
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
