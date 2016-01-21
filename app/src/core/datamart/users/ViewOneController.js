define(['./module', 'moment-duration-format'], function (module) {

  'use strict';


  module.controller('core/datamart/users/ViewOneController', [
    '$scope', '$stateParams', 'Restangular', 'core/datamart/common/Common', 'jquery', 'core/common/auth/Session',
    'lodash', 'moment', '$log',
    function ($scope, $stateParams, Restangular, Common, $, Session, lodash, moment, $log) {

      $scope.INITIAL_VISITS = 10;

      $scope.datamartId = Session.getCurrentDatamartId();
      $scope.organisationId = $stateParams.organisation_id;
      $scope.debug = $stateParams.debug;

      $scope.activities = [];
      $scope.userEndpoint = Restangular.one('datamarts', $scope.datamartId);

      $scope.userEndpoint.one('user_profiles', $stateParams.userPointId).get().then(function (user) {
        $scope.user = Restangular.stripRestangular(user);
      });
      $scope.userEndpoint.customGETLIST('user_timelines/' + $stateParams.userPointId + '/user_activities', {live: $stateParams.live === "true"}).then(function (timelines) {
        $scope.timelines = timelines;
      });


      $scope.audienceSegments = [];
      function fetchAudienceSegment(segmentId){
        //TODO make segmentId
        Restangular.one('audience_segments', 1062).get().then(function (audienceSegment) {
          $scope.audienceSegments.push(audienceSegment);
         });
      }


      $scope.userEndpoint.one('user_segments', $stateParams.userPointId).getList().then(function (segments) {

        $scope.segments = segments;

        fetchAudienceSegment(1);
        for (var segmentIdx = 0; segmentIdx < $scope.segments.length; segmentIdx++) {
          fetchAudienceSegment($scope.segments[segmentIdx].segment_id);
        }

      });

      $scope.userAccountId = {email: "email@gmail.com"};
      $scope.emails = [
        {email: "email1@gmail.com", hash: "skljdnflsdjkfn", creationDate: moment(), last_activity: "lsdnflslkdjf", providers: {firstParty: {expirationDate: moment()}}},
        {email: "email2@gmail.com", hash: "sldgfnjlsdfnji", creationDate: moment(), last_activity: ";sdfgjkopsdlfgjk", providers: {firstParty: {expirationDate: moment()}}},
      ];
      $scope.devices = [
        {device: "TABLET", systemName: "WINDOWS", navigator: "CHROME", lastSeen: moment(),
          mappings: [
            {name: "dmpivitrack.com", value: "lskdnjld"},
            {name: "twengo.com", value: "lskdnjld"}
          ]}
      ];



      /**
       * User Identifiers
       */
      $scope.userEndpoint.one('user_identifiers', $stateParams.userPointId).getList().then(function (userIdentifiers) {

//        console.log(userIdentifiers);

      });




      /*
       TODO: actually,the loadMoreActions function just hides the load more button one the timeline view,because
       we load all the timeline in the first call (getAgentsAndVisits). we can rewrite this function when we implement the function to load
       just a part of the timeline
       */

      $scope.showMore = false;
      $scope.loadMoreActions = function () {
        $scope.showMore = false;

      };


    }
  ]);

});
