define(['./module'], function (module) {

    'use strict';

    module.controller('core/bidOptimizer/ViewAllController', [
        '$scope', 'Restangular', 'core/common/auth/Session', '$location', '$uibModal', '$state', '$stateParams', "core/bidOptimizer/PropertyContainer", "$q",
        function ($scope, Restangular, Session, $location, $uibModal, $state, $stateParams, PropertyContainer, $q) {
            $scope.organisationId = Session.getCurrentWorkspace().organisation_id;


            function updateUsedModelId(bidOptimizerId, bidOptimizersUsedModel) {

              $q.all([
                Restangular.one('bid_optimizers', bidOptimizerId).all("models").getList(),
                Restangular.one('bid_optimizers', bidOptimizerId).all("properties").getList()
              ]).then(function(res) {
                var models = res[0];
                var properties = res[1];

                var bidOptimizerType = properties.filter(function(prop) {
                  return prop.technical_name === "name" && prop.value.value;
                })[0].value.value;

                var modelId = null;

                if (bidOptimizerType  ===  "Click Prediction (DTLR)"){
                  var latest = properties.filter(function(prop) {
                    return prop.technical_name === "latest_model_id" && prop.value.value;
                  })[0];
                  var overriding = properties.filter(function(prop) {
                    return prop.technical_name === "overriding_model_id" && prop.value.value;
                  })[0];

                  modelId = (overriding || latest).value.value;
                }else{
                   modelId = properties.filter(function(prop) {
                   return prop.technical_name === "allocation_index" && prop.value.value;
                  })[0].value.value;

                }

                var modelExists = models.filter(function (model){
                  return model.id === modelId;
                })[0];

                if (modelExists) {
                  bidOptimizersUsedModel[bidOptimizerId] = modelId;
                }
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


