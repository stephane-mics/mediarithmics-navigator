(function(){

  'use strict';

  var module = angular.module('core/datamart');

  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$routeParams', 'Restangular', 'core/datamart/common/Common', 'jquery',
    function($scope, $routeParams, Restangular, Common, $) {

      $scope.INITIAL_ACTIONS_PER_ACTIVITY = 4;
      $scope.INITIAL_VISITS_PER_AGENT = 1;

      // TODO: get organisationId from session, get appropriate datamartId
      $scope.datamartId = 8;

      $scope.agentUrl = Common.locations.all[3].href + "/" + $routeParams.userId + "/agents";
      $scope.itemUrl = "#" + Common.locations.all[1].href + "/";

      // fetch UserAccount
      $scope.activities = [];
      $scope.userEndpoint = Restangular.one('datamarts', $scope.datamartId).one('users', $routeParams.userId);
      $scope.userEndpoint.get().then(function (user) {
        $scope.user = user;
        $scope.getAgentsAndVisits($scope.INITIAL_VISITS_PER_AGENT);
      });

      // prevent dropdown from closing on checkbox interaction
      $('.dropdown-menu').click(function(e){
        e.stopPropagation();
      });

      // Callbacks

      // Loads all agents, then all their visits
      $scope.getAgentsAndVisits = function(visitLimit) {
        // fetch UserAgents
        $scope.userEndpoint.all('agents').getList().then(function (agents){
          $scope.agents = agents;
          for (var i = 0; i < $scope.agents.length; i++) {
            $scope.agents[i].visible = true;
            // fetch visits of each agent and call handler
            Restangular.one('datamarts', $scope.datamartId).one('agents', $scope.agents[i].id).all('visits').getList({ limit: visitLimit }).then($scope.handleVisits);
          }
        });
      };

      // Handles the loaded visits by constructing an activity for each visit, then loads all actions for each
      $scope.handleVisits = function(visits) {
        // if there are more visits avaialble, but a limit is set, show the 'load more' button
        if (visits.metadata.paging.count > visits.metadata.paging.limit) {
          $scope.showLoadMore = true;
        }
        // store visits in parent agent
        var agent = Common.collections.findById($scope.agents, visits.parentResource.id);
        agent.visits = visits;
        // iterate visits
        for (var j = 0; j < visits.length; j++) {
          // assemble an activity and a composite id for it
          var activity = { id: agent.id + '_' + visits[j].id, agent: agent, visit: visits[j] };
          $scope.activities.push(activity);
          // fetch actions of each visit
          Restangular.one('datamarts', $scope.datamartId).one('agents', visits.parentResource.id).one('visits', visits[j].id).all('activity').getList().then($scope.handleActions);
        }
      };

      // Handles the loaded actions of a visit by storing it back to the corresponding activity object
      $scope.handleActions = function(actions) {
        // find activity by id
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
      };

      // Reloads all agents,visits,actions without any limit
      $scope.loadMoreVisits = function() {
        $scope.showLoadMore = false;
        $scope.getAgentsAndVisits(null);
      };

      // Transforms a duration to human a readable 'X days Y hours Z minutes' format
      $scope.toHumanReadableDuration = function(duration) {
        var cd = 24 * 60 * 60 * 1000,
        ch = 60 * 60 * 1000,
        d = Math.floor(duration / cd),
        h = '0' + Math.floor( (duration - d * cd) / ch),
        m = '0' + Math.round( (duration - d * cd - h * ch) / 60000);
        return [d + ' days', h.substr(-2) + ' hours', m.substr(-2) + ' minutes'].join(' ');
      };

      // Determines the number of actions to display for a visit depending on it's expanded/collapsed state
      $scope.getLimit = function(activity) {
        if (activity && activity.expanded) {
          return activity.expanded ? activity.actions.length : $scope.INITIAL_ACTIONS_PER_ACTIVITY;
        } else {
          return $scope.INITIAL_ACTIONS_PER_ACTIVITY;
        }
      };

      // Determines if the entry corresponding to an agent in the filter box should be enabled or not
      $scope.isAgentEnabled = function(agent) {
        // count visible agents
        var visible = 0;
        for (var i = 0; i < $scope.agents.length; i++) {
          visible += $scope.agents[i].visible ? 1 : 0;
        }
        // disble checkbox for the last visible so that there is always at leas one visible
        if (visible <= 1) {
          return !agent.visible;
        } else {
          return true;
        }
      };

      // Returns the start_date property of the activity for ordering
      $scope.orderByVisitStartDate = function(activity) {
        return activity.visit.start_date;
      };
    }
  ]);

})();