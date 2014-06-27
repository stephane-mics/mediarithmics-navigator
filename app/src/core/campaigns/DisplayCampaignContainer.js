(function () {
  'use strict';

  var module = angular.module('core/campaigns');
  /*
   * Campaign Container
   */

  module.factory("core/campaigns/DisplayCampaignContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async", "core/campaigns/AdGroupContainer", "$log", 'core/common/promiseUtils',
    function($q, Restangular, IdGenerator, async, AdGroupContainer, $log, promiseUtils) {


      var DisplayCampaignContainer = function DisplayCampaignContainer(templateGroupId, templateArtifactId) {

        this.creationMode = true;

        this.adGroups = [];
        this.removedAdGroups = [];
        this.inventorySources = [];
        this.removedInventorySources = [];
        this.locations = [];
        this.removedLocations = [];

        this.value = {type:"DISPLAY", template_group_id: templateGroupId, template_artifact_id: templateArtifactId};
        $log.info("DisplayCampaignContainer", this.value);
      };

      DisplayCampaignContainer.prototype.load = function (campaignId) {

        var root = Restangular.one('display_campaigns', campaignId);
        // send requests to get the value and the list of
        // ad group ids
        var campaignResourceP = root.get();
        var AdGroupsListP = root.getList('ad_groups');
        var inventorySourcesP = root.getList('inventory_sources');
        var locationsP = root.getList('locations');

        var self = this;

        var defered = $q.defer();


        $q.all([campaignResourceP, AdGroupsListP, inventorySourcesP, locationsP])
        .then( function (result) {
          self.creationMode = false;
          self.value = result[0];
//          self.value.ad_groups = function () {
//            return _.map(self.ad_groups(), "value");
//          }
          self.id = self.value.id;
          var adGroups = result[1];
          self.inventorySources = result[2];
          self.locations = result[3];

          var adGroupsP = [];
          if (adGroups.length > 0) {

            for(var i=0; i < adGroups.length; i++) {
              // load the ad group container corresponding to the id list in ad groups
              var adGroupCtn = new AdGroupContainer(adGroups[i]);

              self.adGroups.push(adGroupCtn);
            }

            defered.resolve(self);

//            $q.all(adGroupsP).then(function(result) {
//
//              for(var i=0; i < result.length; i++) {
//
//              }
//
//              defered.resolve(self);
//
//            }, function(reason) {
//              defered.reject(reason);
//            });

          } else {
            // return the loaded container
            defered.resolve(self);
          }




        }, function(reason) {

          defered.reject(reason);
        });

        // return the promise
        return defered.promise;
      };

      DisplayCampaignContainer.prototype.getInventorySources = function () {
        return this.inventorySources;
      };


      DisplayCampaignContainer.prototype.addInventorySource = function (inventorySource) {
        this.inventorySources.push(inventorySource);
      };


      DisplayCampaignContainer.prototype.addPostalCodeLocation = function (location) {
        this.locations.push(location);
      };
      DisplayCampaignContainer.prototype.getLocations = function () {
        return this.locations;
      };
      DisplayCampaignContainer.prototype.removeLocation = function (locationId) {
        for (var i = 0; i < this.locations.length; i++) {
          if (this.locations[i].id === locationId) {
            if (locationId.indexOf("T") === -1) {
              this.removedLocations.push(this.locations[i]);
            }
            this.locations.splice(i, 1);
            return;
          }
        }
      };



      DisplayCampaignContainer.prototype.addAdGroup = function addAdGroup() {
        var adGroupCtn = new AdGroupContainer(IdGenerator.getId());

        this.adGroups.push(adGroupCtn);
        return adGroupCtn.id;
      };


      DisplayCampaignContainer.prototype.getAdGroup = function getAdGroup(id) {

        for(var i=0; i < this.adGroups.length; i++){
          if (this.adGroups[i].id === id) {
            return this.adGroups[i];
          }
        }
        return null;
      };


      DisplayCampaignContainer.prototype.removeAdGroup = function removeAdGroup(id) {

        for(var i=0; i < this.adGroups.length; i++){
          if (this.adGroups[i].id === id) {
            this.adGroups.splice(i, 1);
            if (id.indexOf("T") === -1) {
              this.removedAdGroups.push(id);
            }
            return;
          }
        }

      };



      var saveAdGroups = function (self, adGroups) {

        var defered = $q.defer();
        async.mapSeries(adGroups, function(adGroup, callback) {
          var action;

          if (adGroup.id.indexOf('T') === -1) {
            action = "update";
          } else {
            action = "persist";
            // reuse the name of the campaign for the ad group
            if (!adGroup.value.name) {
              adGroup.value.name = self.value.name;
            }
          }

          adGroup[action](self.id).then(function(result) {
            callback(null, result);
          }, function(reason) {
            callback(new Error(reason));
          });


        }, function(err, results){
          if (err) {
            defered.reject(err);
          } else {
            $log.info("ad groups saved");
            defered.resolve(self);
          }
        });

        return defered.promise;
      };

      /**
       * Create a task (to be used by async.series) to delete the given inventory source.
       * @param {Object} inventorySource the inventory source to delete.
       * @return {Function} the task.
       */
      function deleteInventorySourceTask(inventorySource) {
        return function (callback) {
          $log.info("deleting inventorySource", inventorySource.id);
          var promise;
          if (inventorySource.id && inventorySource.id.indexOf('T') === -1) {
            // delete the inventorySource
            promise = inventorySource.remove();
          } else {
            // the inventorySource was not persisted, nothing to do
            var deferred = $q.defer();
            promise = deferred.promise;
            deferred.resolve();
          }
          promiseUtils.bindPromiseCallback(promise, callback);
        };
      }

      /**
       * Create a task (to be used by async.series) to save the given inventory source.
       * @param {Object} inventorySource the inventory source to save.
       * @param {String} campaignId the id of the current campaign.
       * @return {Function} the task.
       */
      function saveInventorySourceTask(inventorySource, campaignId) {
        return function (callback) {
          $log.info("saving inventorySource", inventorySource.id);
          var promise;
          if ((inventorySource.id && inventorySource.id.indexOf('T') === -1) || (typeof(inventorySource.modified) !== "undefined")) {
            // update the inventory source
            // TODO 501 Not Implemented
            // promise = inventorySource.put();

            var deferred = $q.defer();
            promise = deferred.promise;
            deferred.resolve();

          } else {
            promise = Restangular
            .one('display_campaigns', campaignId)
            .post('inventory_sources', inventorySource);
          }
          promiseUtils.bindPromiseCallback(promise, callback);
        };
      }


      var saveInventorySources = function (self, campaignId) {
        var deferred = $q.defer(), tasks = [], i;
        for(i = 0; i < self.inventorySources.length ; i++) {
          tasks.push(saveInventorySourceTask(self.inventorySources[i], campaignId));
        }
        for(i = 0; i < self.removedInventorySources.length ; i++) {
          tasks.push(deleteInventorySourceTask(self.removedInventorySources[i]));
        }

        async.series(tasks, function (err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            $log.info("ad group saved");
            // return the ad group container as the promise results
            deferred.resolve(self);
          }

        });
        return deferred.promise;
      };


      /**
       * Create a task (to be used by async.series) to delete the given inventory source.
       * @param {Object} location the location to delete.
       * @return {Function} the task.
       */
      function deleteLocationTask(location) {
        return function (callback) {
          $log.info("deleting location", location.id);
          var promise;
          if (location.id && location.id.indexOf('T') === -1) {
            // delete the location
            promise = location.remove();
          } else {
            // the location was not persisted, nothing to do
            var deferred = $q.defer();
            promise = deferred.promise;
            deferred.resolve();
          }
          promiseUtils.bindPromiseCallback(promise, callback);
        };
      }

      /**
       * Create a task (to be used by async.series) to save the given inventory source.
       * @param {Object} location the inventory source to save.
       * @param {String} campaignId the id of the current campaign.
       * @return {Function} the task.
       */
      function saveLocationTask(location, campaignId) {
        return function (callback) {
          $log.info("saving location", location.id);
          var promise;
          if ((location.id && location.id.indexOf('T') === -1) || (typeof(location.modified) !== "undefined")) {
            // update the location
            // TODO 501 Not Implemented
            // promise = location.put();

            var deferred = $q.defer();
            promise = deferred.promise;
            deferred.resolve();

          } else {
            promise = Restangular
              .one('display_campaigns', campaignId)
              .post('locations', location);
          }
          promiseUtils.bindPromiseCallback(promise, callback);
        };
      }


      var saveLocations = function (self, campaignId) {
        var deferred = $q.defer(), tasks = [], i;
        for(i = 0; i < self.locations.length ; i++) {
          tasks.push(saveLocationTask(self.locations[i], campaignId));
        }
        for(i = 0; i < self.removedLocations.length ; i++) {
          tasks.push(deleteLocationTask(self.removedLocations[i]));
        }

        async.series(tasks, function (err, res) {
          if (err) {
            deferred.reject(err);
          } else {
            $log.info("ad group saved");
            // return the ad group container as the promise results
            deferred.resolve(self);
          }

        });
        return deferred.promise;
      };


      function persistDependencies(self, campaignId, adGroups) {
        return saveInventorySources(self, campaignId).then(function () {
          return saveLocations(self, campaignId).then(function () {
            return saveAdGroups(self, adGroups);
          });
        });
      }

      DisplayCampaignContainer.prototype.persist = function persist() {

        var deferred = $q.defer();

        var self = this;

        Restangular.all('display_campaigns').post(this.value, {organisation_id: this.organisationId})
        .then(angular.bind(this, function(campaign) {

          self.id = campaign.id;

          persistDependencies.call(null, self, campaign.id, self.adGroups).then(function() {
            deferred.resolve(campaign);
          }, deferred.reject);

        }), function(reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      };

      DisplayCampaignContainer.prototype.update = function update() {

        var deferred = $q.defer();

        var self = this;

        this.value.put().then(function(campaign) {

          persistDependencies.call(null, self, campaign.id, self.adGroups).then(function() {
            deferred.resolve(campaign);
          }, deferred.reject);

        }, function(reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      };

      return DisplayCampaignContainer;
    }
  ]);
})();

