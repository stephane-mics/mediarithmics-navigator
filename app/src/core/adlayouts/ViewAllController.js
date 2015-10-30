define(['./module'], function (module) {
  'use strict';

  module.controller('core/adlayouts/ViewAllController', [
    '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$state', '$stateParams',
    function ($scope, Restangular, Session, $location, $state, $stateParams) {
      var organisationId = Session.getCurrentWorkspace().organisation_id;
      $scope.organisationId = organisationId;
      $scope.adLayouts = [];
      $scope.maxElements = 10;
      $scope.page = 0;

      function getAdLayouts() {
        $scope.adLayouts = [];
        Restangular.all("ad_layouts").getList({organisation_id: organisationId}).then(function (adlayouts) {
          for (i = $scope.page; i < adlayouts.length && i < $scope.maxElements; ++i) {
            Restangular.one("ad_layouts", adlayouts[i].id).one("versions").get({organisation_id: organisationId}).then(function (versions) {
              versions.sort(function (a, b) {
                return a.id < b.id;
              });
              for (var j = 0; j < versions.length; ++j) {
                var d = new Date(versions[j].creation_date);
                versions[j].creation_date = d.toLocaleString();
              }
              $scope.adLayouts.push({currentVersion: versions[0], versions: versions.slice(1, versions.length)});
              console.log($scope.adLayouts);
            });
          }
        });
      }

      getAdLayouts();

      $scope.publish = function (adLayoutVersion, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }

        Restangular.one("ad_layouts", adLayoutVersion.ad_layout_id).one("versions", adLayoutVersion.id).customPUT({status: "PUBLISHED"}, undefined, {organisation_id: organisationId}).then(function () {
          adLayoutVersion.status = "PUBLISHED";
        }, function () {
          $log.debug("There was an error on publish");
        });
      };

      $scope.archive = function (adLayoutVersion, $event) {
        if ($event) {
          $event.preventDefault();
          $event.stopPropagation();
        }
        Restangular.one("ad_layouts", adLayoutVersion.ad_layout_id).one("versions", adLayoutVersion.id).remove({organisation_id: organisationId}).then(function () {
          adLayoutVersion.status = "ARCHIVED";
        }, function () {
          $log.debug("There was an error on archive");
        });
      };
    }
  ]);
});