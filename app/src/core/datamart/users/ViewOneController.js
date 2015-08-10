define(['./module','moment-duration-format'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'jquery', 'core/common/auth/Session','lodash', 'moment',
    function($scope, $stateParams, Restangular, Common, $, Session, lodash, moment) {

      $scope.INITIAL_ACTIONS_PER_ACTIVITY = 4;
      $scope.INITIAL_VISITS = 10;

      $scope.datamartId = Session.getCurrentDatamartId();

      $scope.agentUrl = "#/datamart/users/" + $stateParams.userId + "/agents";
      $scope.itemUrl = "#datamart/items/";

      // fetch UserAccount
      $scope.activities = [];
      if ($stateParams.upid) {
        $scope.userEndpoint = Restangular.one('datamarts', $scope.datamartId).one('users/upid/', $stateParams.upid);
      } else {
        $scope.userEndpoint = Restangular.one('datamarts', $scope.datamartId).one('users', $stateParams.userId);
      }
      $scope.userEndpoint.get().then(function (user) {
        $scope.user = Restangular.stripRestangular(user);
        $scope.getAgentsAndVisits($scope.INITIAL_VISITS);
      });

      // prevent dropdown from closing on checkbox interaction
      $('.dropdown-menu').click(function(e){
        e.stopPropagation();
      });

      $scope.getMapKeys = function(obj){
        return Object.keys(obj);
      };

      // Callbacks

      // Loads all agents, then all their visits
      $scope.getAgentsAndVisits = function(visitLimit) {
        // fetch UserAgents
        $scope.userEndpoint.all('agents').getList().then(function (agents){
          $scope.agents = agents;
        });
        $scope.userEndpoint.all('timeline').getList().then(function (timeline){
          $scope.timeline = timeline;
          $scope.handleVisits(timeline);
        });
      };

      // Handles the loaded timeline by constructing an activity for each visit, then loads all actions for each
      $scope.handleVisits = function(timeline) {
        // if there are more visits avaialble, but a limit is set, show the 'load more' button

        $scope.showLoadMore = true;

        // store visits in parent agent
        // iterate visits
        for (var j = 0; j < timeline.length; j++) {
          // assemble an activity and a composite id for it
          var event = timeline[j];
          var agent = lodash.find($scope.agents,  {'user_agent_id':  event.agent_id});
          var activity = { id: agent.id + '_' + event.id, agent: agent, visit: event };

            activity.actions = [];
                    activity.expanded = false;
                    for (var k = 0; k < event.items.length; k++) {
                      var action = event.items[k];
                      // fetch action
                      if (action.$type === 'performed_action') {
                        action.details = Restangular.one('datamarts', $scope.datamartId).one('actions', action.action_id).get().$object;
                      }
                      // fetch item
                      if (action.$type === '$added_to_cart' || action.$type === '$viewed') {
                        activity.with_purchase = true;
//                        action.item = Restangular.one('datamarts', $scope.datamartId).one('items', action.datasheet_id).get().$object;
                      }
                      activity.actions.push(action);
                    }

            $scope.activities.push(activity);
          // fetch actions of each visit
//          Restangular.one('datamarts', $scope.datamartId).one('agents', visits.parentResource.id).one('visits', visits[j].id).all('activity').getList().then($scope.handleActions);
        }
      };

      // Handles the loaded actions of a visit by storing it back to the corresponding activity object
      $scope.handleActions = function(actions) {
        // find activity by id
        var activity = Common.collections.findById($scope.activities, actions.parentResource.parentResource.id + '_' + actions.parentResource.id);


      };

      // Reloads all agents,visits,actions without any limit
      $scope.loadMoreVisits = function() {
        $scope.showLoadMore = false;
        $scope.getAgentsAndVisits(null);
      };

      // Transforms a duration to human a readable 'X days Y hours Z minutes' format
      $scope.toHumanReadableDuration = function(duration) {
        return moment.duration(duration,'seconds').format("d [days] h [hours] m [minutes] s [seconds]");
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

});
