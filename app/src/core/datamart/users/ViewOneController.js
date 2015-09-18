define(['./module','moment-duration-format'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'jquery', 'core/common/auth/Session',
      'lodash', 'moment',
    function($scope, $stateParams, Restangular, Common, $, Session, lodash, moment) {

        $scope.INITIAL_ACTIONS_PER_ACTIVITY = 4;
        $scope.INITIAL_VISITS = 10;

        $scope.datamartId = Session.getCurrentDatamartId();

        $scope.agentUrl = '#/'  + $stateParams.organisation_id + '/datamart/users/' + $stateParams.userId + '/agents';
        $scope.itemUrl = '#/' + $stateParams.organisation_id + '/datamart/items/';


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
                $scope.getAgentsAndVisits($scope.INITIAL_VISITS);
            }, function(response) {
                $scope.error = response.data.error;
            });
        } else {
            $scope.userEndpoint.customGET('user_profiles/user_account_id='+ $stateParams.userId).then(function (user) {
                $scope.user = Restangular.stripRestangular(user);
                $scope.getAgentsAndVisits($scope.INITIAL_VISITS);
            });
        }


// Loads all agents, then all their visits
        $scope.getAgentsAndVisits = function(visitLimit) {
            // fetch UserAgents
//        $scope.userEndpoint.all('agents').getList().then(function (agents){
//          $scope.agents = agents;
//        });

            if ($stateParams.upid) {
                $scope.userEndpoint.one('user_timelines', $stateParams.upid).customGETLIST('',{live: $stateParams.live === "true"}).then(function (timeline){
                    $scope.timeline = timeline;
                    //$scope.handleVisits(timeline);
                }, function(response) {
                    $scope.error = response.data.error;
                });

            } else {
                var url = 'user_timelines/user_account_id='+ $stateParams.userId + "?live="+ ($stateParams.live === "true");
                $scope.userEndpoint.customGETLIST(url).then(function (timeline){
                    $scope.timeline = timeline;
                    //$scope.handleVisits(timeline);
                });
            }

        };









    }
  ]);

});
