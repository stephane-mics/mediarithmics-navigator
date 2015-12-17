define(['./module'], function (module) {

    'use strict';

    module.controller('core/bidOptimizer/ViewAllController', [
        '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal', '$state', '$stateParams', "core/bidOptimizer/PropertyContainer",
        function ($scope, Restangular, Session, $location, $uibModal, $state, $stateParams, PropertyContainer) {
            var organisationId = Session.getCurrentWorkspace().organisation_id;


            function updateUsedModelId(bidOptimizerId, bidOptimizersUsedModel) {

                Restangular.one('bid_optimizers', bidOptimizerId).all("properties").getList().then(function (properties) {

                    for (var i = 0; i < properties.length; i++) {
                        // load the property container
                        var propertyCtn = new PropertyContainer(properties[i]);

                        if (propertyCtn.value.technical_name === "latest_model_id") {
                            if (propertyCtn.value.value !== null) {
                                bidOptimizersUsedModel[bidOptimizerId] = propertyCtn.value.value;
                               }
                        }

                        if (propertyCtn.value.technical_name === "overriding_model_id") {
                            if (propertyCtn.value.value.value !== null) {
                                bidOptimizersUsedModel[bidOptimizerId] = propertyCtn.value.value;
                                // if the overriding_model_id is defined , we break the loop to do not set it by the latest_model_id
                                break;
                            }
                        }
                    }

                });


            }

            $scope.bidOptimizersUsedModel = {};

            Restangular.all("bid_optimizers").getList({
                organisation_id: organisationId
            }).then(function (bidOptimizers) {
                $scope.bidOptimizers = bidOptimizers;

                for (var j = 0; j < $scope.bidOptimizers.length; j++) {
                    updateUsedModelId($scope.bidOptimizers[j].id, $scope.bidOptimizersUsedModel);

                }
            });
            $scope.organisationId = organisationId;

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


