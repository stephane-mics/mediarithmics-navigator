define(['./module'], function (module) {

    'use strict';

    module.controller('core/bidOptimizer/ViewAllController', [
        '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal', '$state', '$stateParams', "core/bidOptimizer/PropertyContainer",
        function ($scope, Restangular, Session, $location, $uibModal, $state, $stateParams, PropertyContainer) {
            $scope.organisationId = Session.getCurrentWorkspace().organisation_id;


            function updateUsedModelId(bidOptimizerId, bidOptimizersUsedModel) {

                Restangular.one('bid_optimizers', bidOptimizerId).all("properties").getList().then(function (properties) {

                    var latest = properties.filter(function(prop) {
                        return prop.technical_name === "latest_model_id" && prop.value.value;
                    })[0];
                    var overriding = properties.filter(function(prop) {
                        return prop.technical_name === "overriding_model_id" && prop.value.value;
                    })[0];

                    bidOptimizersUsedModel[bidOptimizerId] = (overriding || latest).value.value;

                });


            }

            $scope.bidOptimizersUsedModel = {};

            Restangular.all("bid_optimizers").getList({
                organisation_id: $scope.organisationId
            }).then(function (bidOptimizers) {
                $scope.bidOptimizers = bidOptimizers;

                for (var j = 0; j < $scope.bidOptimizers.length; j++) {
                    updateUsedModelId($scope.bidOptimizers[j].id, $scope.bidOptimizersUsedModel);

                }
            });

            $scope.createBidOptimizer = function () {
                var uploadModal = $uibModal.open({
                    templateUrl: 'src/core/bidOptimizer/create.html',
                    scope: $scope,
                    backdrop: 'static',
                    controller: 'core/bidOptimizer/CreateController',
                    size: "lg"
                });
                uploadModal.result.then(function () {
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


