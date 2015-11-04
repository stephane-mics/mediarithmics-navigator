define(['./module'], function (module) {

    'use strict';

    module.controller('core/datamart/queries/NewSegmentController', [
        '$scope', '$modalInstance', 'Restangular', '$location', 'core/common/auth/Session',

        function ($scope, $modalInstance, Restangular, $location, Session) {

            $scope.cancel = function() {
                $modalInstance.close();
            };

            $scope.$on("mics-new-segment-popup:query-save-complete", function (event, params) {
                var queryId = params.queryId;
                var segment = {
                    name : $scope.segment.name,
                    type : "USER_QUERY",
                    query_id : queryId
                };

                Restangular.all('audience_segments').post(segment, {organisation_id: Session.getCurrentWorkspace().organisation_id}).then(function success(){
                    $modalInstance.close();
                    $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/datamart/segments");
                }, function failure(){
                    $scope.error = "There was an error saving new segment";
                });
            });

            $scope.$on("mics-new-segment-popup:query-save-error", function (event, params) {
                $scope.error = "There was an error saving new query, errorId: " + params.reason.data.error_id;
            });


            $scope.submit = function() {
                $scope.$emit("mics-new-segment-popup:save-query");

            };
        }
    ]);

});
