(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common',
    function($scope, $routeParams, Restangular, Common) {

      // TODO: get organisationId from session, get appropriate datamartId
      $scope.datamartId = 8;

      $scope.agentUrl = Common.locations.all[3].href + "/" + $routeParams.userId + "/agents";

      // fetch Account
      var userEndpoint = Restangular.one('datamarts', 8).one('users', $routeParams.userId);
      userEndpoint.get().then(function (user) {
        if (user.account_creation_date) {
          //user.account_creation_date = new Date(parseInt(user.account_creation_date));
        }
        $scope.user = user;

        // fetch Agents
        userEndpoint.one('agents').get().then(function (agents){
          $scope.agents = agents;
        });
      });

      // click handler for Agents
      $scope.expandAgent = function($event){
        var agent = this.agent;
        if (agent.expanded) {
          // collapse
          agent.expanded = false;
          $event.currentTarget.classList.remove('active');
        } else {
          // expand, fetch last visits
          agent.expanded = true;
          $event.currentTarget.classList.add('active');
          Restangular.one('datamarts', 8).one('agents', agent.id).one('visits').one('last').get().then(function (visits) {
            agent.visits = visits;
          });
        }
        
      }
    }
  ]);

})();