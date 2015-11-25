define(['./module'], function (module) {
  'use strict';

  module.controller('core/common/properties/AdLayoutSelectController', ['$scope', '$uibModalInstance', 'propAdLayout', 'Restangular',
    function ($scope, $modalInstance, propAdLayout, Restangular) {

      $scope.selected = {};
console.log("Prop adlayout: ", propAdLayout);
      // Setup and select Ad Layout
      Restangular.one("ad_layouts").getList("", {"organisation_id": $scope.organisationId}).then(function (adLayouts) {
        if (adLayouts.length) {
          $scope.adLayouts = adLayouts;
          if (typeof propAdLayout.id !== 'undefined') {
            for (var i = 0; i < adLayouts.length; ++i) {
              if (adLayouts[i].id === propAdLayout.id) {
                $scope.selected.adLayout = adLayouts[i];
              }
            }
          } else {
            $scope.selected.adLayout = adLayouts[0];
          }
        }
      });

      // Setup Ad Layout version once the selected Ad Layout is set
      $scope.$watch('selected.adLayout', function (adLayout) {
        console.log("adLayout:", adLayout);
        if (adLayout && adLayout.id) {
          $scope.property.value.id = adLayout.id;
          Restangular.one("ad_layouts/" + adLayout.id + "/versions").getList("", {"organisation_id": $scope.organisationId}).then(function (versions) {
            console.log("versions:", versions);
            if (versions.length) {
              $scope.versions = versions;
              if (typeof propAdLayout.version !== 'undefined') {
                for (var i = 0; i < versions.length; ++i) {
                  if (versions[i].id === $scope.property.value.id) {
                    $scope.selected.version = versions[i];
                  }
                }
              } else {
                $scope.selected.version = versions[0];
              }
            } else {
              $scope.versions = 'undefined';
              $scope.selected.version = 'undefined';
            }
          });
        }
      });

      $scope.done = function () {
        console.log("Ok adlayouid: " +$scope.selected.adLayout.id + "  version: " + $scope.selected.version.id);
        $modalInstance.close({id: $scope.selected.adLayout.id, version: $scope.selected.version.id});
      };

      $scope.cancel = function () {
        $modalInstance.dismiss(false);
      };
    }]);
});