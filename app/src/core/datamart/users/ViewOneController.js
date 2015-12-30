define(['./module','moment-duration-format'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'jquery', 'core/common/auth/Session',
      'lodash', 'moment', '$log',
    function($scope, $stateParams, Restangular, Common, $, Session, lodash, moment, $log) {

        $scope.INITIAL_VISITS = 10;

        $scope.datamartId = Session.getCurrentDatamartId();
        $scope.organisationId = $stateParams.organisation_id;
        $scope.debug = $stateParams.debug;
        // fetch UserAccount
        $scope.activities = [];
        if($stateParams.upid === 'my_user_point_id') {
            var WithCredentialRestangular = Restangular.withConfig(function(RestangularConfigurer) {
                RestangularConfigurer.setDefaultHttpFields({withCredentials: true});
            });
            $scope.userEndpoint = WithCredentialRestangular.one('datamarts', $scope.datamartId);
        } else {
            $scope.userEndpoint = Restangular.one('datamarts', $scope.datamartId);
        }
      

        if ($stateParams.upid) {
            $scope.userEndpoint.one('user_profiles', $stateParams.upid).get().then(function (user) {
                $scope.user = Restangular.stripRestangular(user);
            }, function(response) {
                $log.error("user_profiles/" + $stateParams.upid + " returned an error:", response.data.error);
                // $scope.error = response.data.error;
            });
        } else {
            $scope.userEndpoint.customGET('user_profiles/user_account_id='+ $stateParams.userId).then(function (user) {
                $scope.user = Restangular.stripRestangular(user);
            });
        }




// Loads all agents, then all their visits
        $scope.getAgentsAndVisits = function(visitLimit) {
            // fetch UserAgents
//        $scope.userEndpoint.all('agents').getList().then(function (agents){
//          $scope.agents = agents;
//        });

            if ($stateParams.upid) {
                $scope.userEndpoint.one('user_timelines', $stateParams.upid).customGETLIST('user_activities',{live: $stateParams.live === "true"}).then(function (timelines){
                    $scope.timelines = timelines;
                    //$scope.handleVisits(timeline);
                    $scope.showMore = true;
                }, function(response) {
                    $scope.error = response.data.error;
                });

            } else {
                var url = 'user_timelines/user_account_id='+ $stateParams.userId + "/user_activities?live="+ ($stateParams.live === "true");
                $scope.userEndpoint.customGETLIST(url).then(function (timelines){
                    $scope.timelines = timelines;
                    $scope.showMore = true;
                    //$scope.handleVisits(timeline);
                });
            }

        };

        $scope.getAgentsAndVisits($scope.INITIAL_VISITS);

        /*
        TODO: actually,the loadMoreActions function just hides the load more button one the timeline view,because
              we load all the timeline in the first call (getAgentsAndVisits). we can rewrite this function when we implement the function to load
              just a part of the timeline
         */
        $scope.loadMoreActions = function(){
            $scope.showMore = false;

        };


    }
  ]);

});
