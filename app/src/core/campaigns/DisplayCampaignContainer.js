(function () {
  'use strict';

  var module = angular.module('core/campaigns');
  /*
   * Campaign Container
   */

  module.factory("core/campaigns/DisplayCampaignContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async", "core/campaigns/AdGroupContainer", "$log",
    function($q, Restangular, IdGenerator, async, AdGroupContainer, $log) {


      var DisplayCampaignContainer = function DisplayCampaignContainer(templateGroupId, templateArtifactId) {

        this.creationMode = true;

        this.adGroups = [];
        this.removedAdGroups = [];
        this.inventorySources = undefined;
        this.addedInventorySources = [];

        this.value = {type:"DISPLAY", template_group_id: templateGroupId, template_artifact_id: templateArtifactId};
        $log.info("DisplayCampaignContainer", this.value);
      };

      DisplayCampaignContainer.prototype.load = function (campaignId) {

        var root = Restangular.one('display_campaigns', campaignId);
        // send requests to get the value and the list of
        // ad group ids
        var campaignResourceP = root.get();
        var AdGroupsListP = root.getList('ad_groups');

        var self = this;

        var defered = $q.defer();


        $q.all([campaignResourceP, AdGroupsListP])
        .then( function (result) {
          self.creationMode = false;
          self.value = result[0];
//          self.value.ad_groups = function () {
//            return _.map(self.ad_groups(), "value");
//          }
          self.id = self.value.id;
          var adGroups = result[1];

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
        if(this.inventorySources === undefined && !this.creationMode) {
          this.inventorySources =  this.value.getList('inventory_sources');

        } else if (this.inventorySources === undefined) {
          this.inventorySources = {$object:[]};

        }
        return this.inventorySources.$object;

      };


      DisplayCampaignContainer.prototype.addInventorySource = function (inventorySource) {
        this.addedInventorySources.push(inventorySource);
        if(this.inventorySources !== undefined) {
          this.inventorySources.$object.push(inventorySource);
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



      var saveAdGroups = function (self, adGroups, defered) {

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
      };

      DisplayCampaignContainer.prototype.persist = function persist() {

        var defered = $q.defer();

        var self = this;

        Restangular.all('display_campaigns').post(this.value, {organisation_id: this.organisationId})
        .then(angular.bind(this, function(campaign) {

          self.id = campaign.id;

          var pArray = [];


          var adGroups = self.adGroups;
          saveAdGroups(self, adGroups, defered);

        }), function(reason) {
          defered.reject(reason);
        });

        return defered.promise;
      };

      DisplayCampaignContainer.prototype.update = function update() {

        var defered = $q.defer();

        var self = this;

        this.value.put().then(function(campaign) {

          var adGroups = self.adGroups;

          if (self.addedInventorySources.length !== 0) {
            async.mapSeries(self.addedInventorySources, function(inventorySource, callback) {
              self.inventorySources.$object.post(inventorySource).then(function(result) {
                callback(null, result);
              }, function(reason) {
                callback(new Error(reason));
              });
            });
          }


          saveAdGroups(self, adGroups, defered);

        }, function(reason) {
          defered.reject(reason);
        });

        return defered.promise;
      };

      return DisplayCampaignContainer;
    }
  ]);
})();

