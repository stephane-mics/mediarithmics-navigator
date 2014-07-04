(function(){

  'use strict';

  var module = angular.module('core/placementlists');


  module.controller('core/placementlists/EditOneController', [
    '$scope', '$log', 'Restangular', 'core/common/auth/Session', 'lodash', '$routeParams', '$location', 'core/configuration', 'ngTableParams', '$window', 'core/common/auth/AuthenticationService', "$modal",
    function($scope, $log, Restangular, Session, _, $routeParams, $location, configuration, NgTableParams, $window, AuthenticationService, $modal) {
      var placementListId = $routeParams.placementlist_id;
      var type = $routeParams.type;

      $scope.isCreationMode = !placementListId;

      function showWaitingModal() {
        $scope.waitingModal = $modal.open({
          templateUrl: 'src/core/common/waiting.html',
          scope : $scope,
          backdrop : 'static',
          keyboard : false
        });
      }
      function hideWaitingModal() {
        if($scope.waitingModal) {
          $scope.waitingModal.close();
          $scope.waitingModal = null;
        }
      }

      $scope.tableParams = new NgTableParams({
        page: 1,            // show first page
        count: 10           // count per page
      }, {
        total: 0,           // length of data
        getData: function($defer, params) {
          Restangular.one('placement_lists', placementListId).all('placement_descriptors').getList({
            first_result: (params.page() - 1) * params.count(),
            max_results: params.count(),
            organisation_id: Session.getCurrentWorkspace().organisation_id
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
        url : $location.protocol() + ":" +  Restangular.one('placement_lists', placementListId).one("placement_descriptors").one("batch").getRestangularUrl() + "?organisation_id=" + Session.getCurrentWorkspace().organisation_id,
        filters : {
          mime_types: [
            {title : "CSV files", extensions : "csv,txt"}
          ],
          max_file_size: "2500kb"
        },
        init: {
          FileUploaded: function () {
            $scope.tableParams.reload();
            hideWaitingModal();
          },
          FilesAdded: function () {
            showWaitingModal();
            $scope.uploadError = null;
            $scope.$apply();
          },
          Error: function(up, err) {
            hideWaitingModal();
            $scope.uploadError = err.message;
            $scope.$apply();
          }
        }
      };

      $scope.goToCampaign = function (campaign) {
        switch(campaign.type) {
          case "DISPLAY":
            $location.path("/campaigns/display/report/" + campaign.id + "/basic");
            break;
          default:
            $location.path("/campaigns");
            break;
        }
      };

      $scope.downloadCSV = function () {
        var dlUrl = Restangular.one('placement_lists', placementListId).one("placement_descriptors").one("csv").getRestangularUrl() + "?organisation_id=" + Session.getCurrentWorkspace().organisation_id + "&access_token=" + encodeURIComponent(AuthenticationService.getAccessToken());
        $window.location = dlUrl;
      };
      $scope.deletePlacement = function (placement) {
        placement.remove({organisation_id:Session.getCurrentWorkspace().organisation_id}).then(function () {
          $scope.tableParams.reload();
        });
      };

      $scope.cancel = function () {
        $location.path("/library/placementlists");
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
          $location.path("/library/placementlists");
        }, function failure(){
          $log.info("failure");
        });
      };
    }
  ]);
})();

