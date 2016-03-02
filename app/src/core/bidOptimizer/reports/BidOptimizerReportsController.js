define(['./module'], function (module) {

    'use strict';

    module.controller('core/bidOptimizer/reports/BidOptimizerReportsController', [
        '$scope', 'Restangular', 'core/common/auth/Session', '$stateParams',
        'core/bidOptimizer/PropertyContainer', '$uibModal', '$resource', 'core/configuration', 'core/common/auth/AuthenticationService',
        function ($scope, Restangular, Session, $stateParams, PropertyContainer, $uibModal, $resource, configuration, AuthenticationService) {

            $scope.organisationId = Session.getCurrentWorkspace().organisation_id;

            $scope.bidOptimizerId = $stateParams.bidOptimizerId;

            $scope.showModelId = $stateParams.modelId;
            $scope.modelIdx = 0;
            $scope.statsLoading = true;

            $scope.properties = [];

            function fetchDtlrReport(){
             Restangular.one('bid_optimizers', $scope.bidOptimizerId).all("properties").getList().then(function (properties) {

                 var latest = properties.filter(function(prop) {
                     return prop.technical_name === "latest_model_id" && prop.value.value;
                 })[0];
                 var overriding = properties.filter(function(prop) {
                     return prop.technical_name === "overriding_model_id" && prop.value.value;
                 })[0];

                 $scope.usedModel = (overriding || latest).value.value;

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
                 $scope.statsLoading =false;

             });

            }


            function fetchDynamicAllocationReport(){
                var modelCall = $resource(configuration.WS_URL + '/bid_optimizers/:bidOptimizerId/models/:modelId/files/technical_name=allocation_table', {}, {
                         get: {
                             method: 'GET',
                             headers: {'Authorization': AuthenticationService.getAccessToken()}
                         }
                     }
                 );

                 modelCall.get({bidOptimizerId: $scope.bidOptimizerId, modelId: $scope.showModelId}, function (res) {
                     $scope.report = res.$dynamic_allocation_model_report;
                     $scope.modelDate = res.$dynamic_allocation_model_report.$date;
                     $scope.statsLoading =false;

                 });

            }


            Restangular.one('bid_optimizers', $scope.bidOptimizerId).get().then(function (bidOptimizer) {
                $scope.bidOptimizer = bidOptimizer;
                switch (bidOptimizer.engine_artifact_id){
                    case "dynamic-allocation":
                        $scope.technical_name = "allocation_table";
                        fetchDynamicAllocationReport();
                        break;
                    case "dtlr":
                        $scope.technical_name = "statistics";
                        fetchDtlrReport();
                        break;
                }

            });

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




        }
    ]);


});



