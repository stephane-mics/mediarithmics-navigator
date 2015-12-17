define(['./module'], function (module) {

    'use strict';

    module.controller('core/bidOptimizer/reports/BidOptimizerReportsController', [
        '$scope', 'Restangular', 'core/common/auth/Session', '$stateParams',
        'core/bidOptimizer/PropertyContainer', '$uibModal', '$resource', 'core/configuration', 'core/common/auth/AuthenticationService',
        function ($scope, Restangular, Session, $stateParams, PropertyContainer, $uibModal, $resource, configuration, AuthenticationService) {

            var organisationId = Session.getCurrentWorkspace().organisation_id;
            $scope.organisationId = organisationId;

            $scope.bidOptimizerId = $stateParams.bidOptimizerId;

            $scope.showModelId = $stateParams.modelId;
            $scope.modelIdx = 0;

            Restangular.one('bid_optimizers', $scope.bidOptimizerId).get().then(function (bidOptimizer) {
                $scope.bidOptimizer = bidOptimizer;
            });
            $scope.properties = [];

            $scope.selectModel = function () {
                $uibModal.open({
                    animation: true,
                    templateUrl: 'src/core/bidOptimizer/reports/selectModel.html',
                    controller: 'core/bidOptimizer/reports/SelectModelController',
                    scope: $scope,
                    backdrop: true,
                    backdropClick: true,
                    resolve: {}
                });

            };


            Restangular.one('bid_optimizers', $scope.bidOptimizerId).all("properties").getList().then(function (properties) {
                for (var i = 0; i < properties.length; i++) {
                    // load the property container
                    var propertyCtn = new PropertyContainer(properties[i]);

                    $scope.properties.push(propertyCtn);
                    if (propertyCtn.value.technical_name === "latest_model_id") {
                        $scope.lastModelId = propertyCtn.value.value;
                    }

                    if (propertyCtn.value.technical_name === "overriding_model_id") {
                        $scope.overridingModel = propertyCtn.value.value;
                    }
                }

                if ($scope.overridingModel.value !== null) {
                    $scope.usedModel = $scope.overridingModel.value;
                }
                else {
                    $scope.usedModel = $scope.lastModelId.value;
                }

            });


            var modelCall = $resource(configuration.WS_URL + '/bid_optimizers/:bidOptimizerId/models/:modelId/files/technical_name=statistics', {}, {
                    get: {
                        method: 'GET',
                        headers: {'Authorization': AuthenticationService.getAccessToken()}
                    }
                }
            );

            modelCall.get({bidOptimizerId: $scope.bidOptimizerId, modelId: $scope.showModelId}, function (res) {

                $scope.report = res.$categorical_model_report;
                $scope.modelDate = res.$categorical_model_report.$date;


            });

        }
    ]);


});



