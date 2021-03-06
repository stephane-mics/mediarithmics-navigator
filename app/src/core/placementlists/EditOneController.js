define(['./module'], function () {

  'use strict';

  var module = angular.module('core/placementlists');


  module.controller('core/placementlists/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$stateParams', '$location', 'core/configuration', 'ngTableParams', '$window', 'core/common/auth/AuthenticationService', "core/common/WaitingService",
    function($scope, $log, Restangular, Session, _, $stateParams, $location, configuration, NgTableParams, $window, AuthenticationService, waitingService) {
      var placementListId = $stateParams.placementlist_id;
      var type = $stateParams.type;

      $scope.isCreationMode = !placementListId;


      $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 10           // count per page
      }, {
        total: 0,           // length of data
        getData: function($defer, params) {
          Restangular.one('placement_lists', placementListId).all('placement_descriptors').getList({
            first_result: (params.page() - 1) * params.count(),
            max_results: params.count()
          }).then(function (descriptors) {
            // update table params
            params.total(descriptors.metadata.paging.count);
            // set new data
            $defer.resolve(descriptors);
          });
        }
      });

      if (!placementListId) {
        $scope.placementList = {
          group_type : type
        };
      } else {
        Restangular.one('placement_lists', placementListId).get().then(function (placementList) {
          $scope.placementList = placementList;
        });
        // Restangular.one('placement_lists', placementListId).all("generator_campaigns").getList().then(function (campaigns) {
          // $scope.generatorCampains = campaigns;
        // });
        // Restangular.one('placement_lists', placementListId).all("consumer_campaigns").getList().then(function (campaigns) {
          // $scope.consumerCampains = campaigns;
        // });
      }
      $scope.pluploadOptions = {
        multi_selection: true,
        url : $location.protocol() + ":" +  Restangular.one('placement_lists', placementListId).one("placement_descriptors").one("batch").getRestangularUrl(),
        filters : {
          mime_types: [
            {title : "CSV files", extensions : "csv,txt"}
          ],
          max_file_size: "2500kb"
        },
        init: {
          FileUploaded: function () {
            $scope.tableParams.reload();
            waitingService.hideWaitingModal();
          },
          FilesAdded: function () {
            waitingService.showWaitingModal();
            $scope.uploadError = null;
            $scope.$apply();
          },
          Error: function(up, err) {
            waitingService.hideWaitingModal();
            $scope.uploadError = err.message;
            $scope.$apply();
          }
        }
      };

      $scope.goToCampaign = function (campaign) {
        switch(campaign.type) {
          case "DISPLAY":
            $location.path( '/' + campaign.organisation_id + "/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path("/campaigns");
            break;
        }
      };

      $scope.downloadCSV = function () {
        var dlUrl = Restangular.one('placement_lists', placementListId).one("placement_descriptors").one("csv").getRestangularUrl() + "?access_token=" + encodeURIComponent(AuthenticationService.getAccessToken());
        $window.location = dlUrl;
      };
      $scope.deletePlacement = function (placement) {
        placement.remove({organisation_id:Session.getCurrentWorkspace().organisation_id}).then(function () {
          $scope.tableParams.reload();
        });
      };

      $scope.cancel = function () {
        $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/placementlists");
      };

      $scope.next = function () {
        var promise = null;
        if(placementListId) {
          promise = $scope.placementList.put();
        } else {
          promise = Restangular.all('placement_lists').post($scope.placementList, {organisation_id: Session.getCurrentWorkspace().organisation_id});
        }
        promise.then(function success(campaignContainer){
          $log.info("success");
          $location.path( '/' + Session.getCurrentWorkspace().organisation_id + "/library/placementlists");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
});

