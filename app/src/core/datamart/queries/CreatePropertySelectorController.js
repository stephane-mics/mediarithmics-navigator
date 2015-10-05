define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/CreatePropertySelectorController', [
        '$scope', '$modalInstance', 'Restangular', 'core/common/auth/Session', 'core/datamart/queries/common/Common',

        function ($scope, $modalInstance, Restangular, Session, Common) {

            $scope.propertyTypes = Object.keys(Common.propertySelectorOperators);

            $scope.cancel = function() {
                $modalInstance.close();
            };

            $scope.done = function() {
                Restangular.one('datamarts', $scope.propertySelector.datamart_id).all('property_selectors').post($scope.propertySelector).then(function() {
                    $scope.$emit("mics-datamart-query:addProperty");
                    $modalInstance.close();
                }, function() {
                    $scope.error = "There was an error saving property";
                });
            };
        }
    ]);

});
