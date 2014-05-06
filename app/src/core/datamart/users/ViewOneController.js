(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common',
    function($scope, $routeParams, Restangular, Common) {

      $scope.ACTIONS_PER_ACTIVITY = 4;
      $scope.VISITS_PER_AGENT = 3;

      // TODO: get organisationId from session, get appropriate datamartId
      $scope.datamartId = 8;

      $scope.agentUrl = Common.locations.all[3].href + "/" + $routeParams.userId + "/agents";
      $scope.itemUrl = "#" + Common.locations.all[1].href + "/";

      $scope.activities = [];

      // fetch UserAccount
      var userEndpoint = Restangular.one('datamarts', $scope.datamartId).one('users', $routeParams.userId);
      userEndpoint.get().then(function (user) {
        $scope.user = user;

        // fetch UserAgents
        userEndpoint.one('agents').get().then(function (agents){
          $scope.agents = agents;
          for (var i = 0; i < agents.length; i++) {
            agents[i].enabled = true;
            // fetch visits of each agent
            Restangular.one('datamarts', $scope.datamartId).one('agents', agents[i].id).all('visits').getList().then(function (visits) {
              // store visits in parent agent
              var agent = Common.collections.findById($scope.agents, visits.parentResource.id);
              agent.visits = visits;
              // iterate visits
              for (var j = 0; j < visits.length; j++) {
                // assemble an activity
                var activity = { id: agent.id + '_' + visits[j].id, agent: agent, visit: visits[j] };
                $scope.activities.push(activity);
                // fetch actions of each visit
                Restangular.one('datamarts', $scope.datamartId).one('agents', visits.parentResource.id).one('visits', visits[j].id).all('activity').getList().then(function (actions) {
                  // find activity object by id
                  var activity = Common.collections.findById($scope.activities, actions.parentResource.parentResource.id + '_' + actions.parentResource.id);
                  if (activity) {
                    activity.actions = [];
                    activity.expanded = false;
                    for (var k = 0; k < actions.length; k++) {
                      var action = actions[k];
                      // fetch action
                      if (action.activity_type === 'performed_action') {
                        action.details = Restangular.one('datamarts', $scope.datamartId).one('actions', action.action_id).get().$object;
                      }
                      // fetch item
                      if (action.activity_type === 'purchase_item' || action.activity_type === 'view_item') {
                        activity.with_purchase = true;
                        action.item = Restangular.one('datamarts', $scope.datamartId).one('items', action.datasheet_id).get().$object;
                      }
                      activity.actions.push(action);
                    }
                  }
                });
              }
            });
          }
        });
      });

      $scope.toHumanReadableDuration = function(duration) {
        var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(duration / cd),
        h = '0' + Math.floor( (duration - d * cd) / ch),
        m = '0' + Math.round( (duration - d * cd - h * ch) / 60000);
        return [d + ' days', h.substr(-2) + ' hours', m.substr(-2) + ' minutes'].join(' ');
      };

      $scope.getLimit = function(activity) {
        if (activity && activity.expanded) {
          return activity.expanded ? activity.actions.length : $scope.ACTIONS_PER_ACTIVITY;
        } else {
          return $scope.ACTIONS_PER_ACTIVITY;
        }
      };

      $scope.orderByVisitStartDate = function(activity) {
        return activity.visit.start_date;
      };

      // prevent dropdown from closing on checkbox interaction
      $('.dropdown-menu').click(function(e){
        e.stopPropagation();
      });
    }
  ]);

})();
