define(['./module'], function (module) {
  'use strict';

  module.controller('core/common/properties/AdLayoutSelectController', ['$scope', '$uibModalInstance', 'propAdLayout', 'displayAdRenderers', 'Restangular',
    function ($scope, $modalInstance, propAdLayout, displayAdRenderers, Restangular) {
      $scope.selectedAdLayout = {id: propAdLayout.id};
      $scope.selectedVersion = {id: propAdLayout.version};

      console.log("Selected layout: ", $scope.selectedAdLayout, ", version: ", $scope.selectedVersion);

      function setupAdLayoutVersions(adLayoutId) {
        Restangular.one("ad_layouts/" + adLayoutId + "/versions").getList("", {"statuses": "DRAFT,PUBLISHED", "organisation_id": $scope.organisationId}).then(function (versions) {
          if (versions.length) {
            $scope.versions = versions;
            if (!$scope.selectedVersion.id) {
              $scope.selectedVersion = versions[0];
            }
          } else {
            $scope.versions = null;
            $scope.selectedVersion = {id: null};
          }
        });
      }

      // Setup and select Ad Layout
      Restangular.one("ad_layouts").getList("", {"organisation_id": $scope.organisationId}).then(function (adLayouts) {
        if (adLayouts.length) {
          $scope.adLayouts = adLayouts;
          if (!$scope.selectedAdLayout.id) {
            $scope.selectedAdLayout = adLayouts[0];
          }
          setupAdLayoutVersions($scope.selectedAdLayout.id);
        }
      });

      // Setup Ad Layout version once the selected Ad Layout is set
      $scope.selectAdLayout = function (adLayout) {
        $scope.selectedAdLayout = adLayout;
        $scope.selectedVersion = {id: null};
        console.log("adLayout:", adLayout);
        if (adLayout && adLayout.id) {
          $scope.property.value.id = adLayout.id;
          setupAdLayoutVersions(adLayout.id);
        }
      };

      $scope.selectVersion = function(version) {
        $scope.selectedVersion = version;
      };

      $scope.done = function () {
        console.log("Selected Ad Layout: " + $scope.selectedAdLayout.id + ",  Version: " + $scope.selectedVersion.id);
        $modalInstance.close({adLayout: $scope.selectedAdLayout, version: $scope.selectedVersion});
      };

      $scope.cancel = function () {
        $modalInstance.dismiss(false);
      };
    }]);
});