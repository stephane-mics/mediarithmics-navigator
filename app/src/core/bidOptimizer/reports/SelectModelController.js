define(['./module'], function (module) {
    'use strict';

    module.controller('core/bidOptimizer/reports/SelectModelController', [
        '$scope', 'Restangular','$stateParams','$uibModalInstance',"core/bidOptimizer/PropertyContainer",
        function ($scope, Restangular,$stateParams,$uibModalInstance,PropertyContainer) {

            $scope.modelsIdDate = [];
            $scope.currentPage = 1;
            $scope.itemsPerPage = 10;

            Restangular.one('bid_optimizers', $scope.bidOptimizerId).all("properties").getList().then(function (properties) {

                for (var i = 0; i < properties.length; i++) {
                    // load the property container
                    var propertyCtn = new PropertyContainer(properties[i]);

                    if (propertyCtn.value.technical_name === "latest_model_id") {
                        if (propertyCtn.value.value !== null) {
                            $scope.currentModel = propertyCtn.value.value;
                        }
                    }

                    if (propertyCtn.value.technical_name === "overriding_model_id") {
                        if (propertyCtn.value.value.value !== null) {
                            $scope.currentModel = propertyCtn.value.value;
                            // if the overriding_model_id is defined , we break the loop to do not set it by the latest_model_id
                            break;
                        }
                    }
                }

            });

            Restangular.one('bid_optimizers', $scope.bidOptimizerId).getList('models')
                .then(function (models) {
                    // the service return models sorting by date, we need to reverse the traverse to
                    // show latest models first
                    for (var i = models.length - 1 ; i >= 0 ; i--) {
                        $scope.modelsIdDate.push({modelId: models[i].id, date: models[i].creation_date});
                    }
                });

            $scope.cancel = function () {
                $uibModalInstance.dismiss('cancel');
            };

        }
    ]);
});


