(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  module.factory("core/campaigns/AdGroupContainer", [
    "$q", "Restangular", "jquery", "core/common/IdGenerator",
    function ($q, Restangular, $, IdGenerator) {
      /*
       * Ad Group Container
       */

      var AdGroupContainer = function AdGroupContainer(value) {
        if (typeof value === "string") {
          this.id = value;
          this.value = {id:value};
        } else {

          this.value = value;
          this.id = value.id;
        }

        this.ads = [];
        this.removedAds = [];

        this.userGroups = [];
        this.removedUserGroups = [];

      };


      AdGroupContainer.prototype.load = function load() {
        var pValue = this.value.get();
        var pAds = this.value.getList('ads');
        var pUserGroups = this.value.getList('user_groups');
        //var pKeywords = root.getList('keyword_lists');
        //var pPlacements = root.getList('placement_lists');

        var self = this;

        var defered = $q.defer();
        //var list = [pValue, pAds, pUserGroups, pKeywords, pPlacements];
        var list = [pValue, pAds, pUserGroups];

        $q.all(list)
          .then(function (result) {
            self.value = result[0];
            self.id = self.value.id;
            self.ads = result[1];
            self.userGroups = result[2];

            //self.keywords =  result[3];
            //self.placements = result[4];

            // return the loaded container
            defered.resolve(self);

          }, function (reason) {

            defered.reject(reason);
          });

        // return the promise
        return defered.promise;

      };

      AdGroupContainer.prototype.addAd = function addAd(ad) {

        ad.id = IdGenerator.getId();
        this.ads.push(ad);

        return ad.id;
      };

      AdGroupContainer.prototype.removeAd = function removeAd(adId) {

        for (var i = 0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId) {
            this.ads.splice(i, 1);
            if (adId.indexOf("T") === -1) {
              this.removedAds.push(adId);
            }
            return;
          }
        }
      };

      AdGroupContainer.prototype.getAd = function getAd(adId) {

        for (var i = 0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId) {
            return this.ads[i];
          }
        }
      };

      AdGroupContainer.prototype.setAdValue = function setAdValue(ad) {
        var copiedValue = $.extend({}, ad);
        this.getAd(ad.id).value = copiedValue;
        this.getAd(ad.id).modified = true;
      };

      AdGroupContainer.prototype.addUserGroup = function addAd(userGroupSelection) {

        userGroupSelection.id = IdGenerator.getId();
        this.userGroups.push(userGroupSelection);

        return userGroupSelection.id;
      };

      AdGroupContainer.prototype.removeUserGroup = function removeUserGroup(userGroupId) {

        for (var i = 0; i < this.userGroups.length; i++) {
          if (this.userGroups[i].id === userGroupId) {
            this.userGroups.splice(i, 1);
            if (userGroupId.indexOf("T") === -1) {
              this.removedUserGroups.push(userGroupId);
            }
            return;
          }
        }
      };

      AdGroupContainer.prototype.persist = function persist(campaignId) {

        var defered = $q.defer();

        var self = this;

        Restangular.one('display_campaigns', campaignId).post('ad_groups', this.value)
          .then(function (adGroup) {
            var i;

            self.id = adGroup.id;

            // persist ads
            var pAds = [];
            for (i = 0; i < self.ads.length; i++) {
              var pAd = Restangular.one('display_campaigns', campaignId).one('ad_groups', adGroup.id).post('ads', self.ads[i]);
              pAds.push(pAd);
            }

            // persist user groups
            var pUserGroups = [];
            for (i = 0; i < self.userGroups.length; i++) {
              var pUserGroup = Restangular.one('display_campaigns', campaignId).one('ad_groups', adGroup.id).post('user_groups', self.userGroups[i]);
              pUserGroups.push(pUserGroup);
            }

            var pList = [];
            pList = pList.concat(pAds);
            pList = pList.concat(pUserGroups);
            $q.all(pList).then(function (result) {
              // return the ad group container as the promise results
              defered.resolve(self);
            }, function (reason) {
              defered.reject(reason);
            });
          }, function (reason) {
            defered.reject(reason);
          });

        return defered.promise;
      };

      AdGroupContainer.prototype.update = function update(campaignId) {

        var defered = $q.defer();

        var self = this;

        this.value.put()
          .then(function (adGroup) {
            var i;

            self.id = adGroup.id;

            // update ads
            var pAds = [], pAd;
            for (i = 0; i < self.ads.length; i++) {

              var ad = self.ads[i];
              if ((ad.id.indexOf('T') === -1) || (typeof(ad.modified) !== "undefined")) {
                // update the ad
                pAd = ad.put();
                pAds.push(pAd);

              } else {
                // create the ad
                pAd = Restangular.one('display_campaigns', campaignId)
                  .one('ad_groups', adGroup.id)
                  .post('ads', ad);
                pAds.push(pAd);

              }
            }

              // var pUserGroup = Restangular.one('display_campaigns', campaignId).one('ad_groups', adGroup.id).post('user_groups', self.userGroups[i]);
            // update user groups
            var pUserGroups = [], pUserGroup;
            for (i = 0; i < self.userGroups.length; i++) {

              var userGroup = self.userGroups[i];
              if ((userGroup.id.indexOf('T') === -1) || (typeof(userGroup.modified) !== "undefined")) {
                // update the user group
                pUserGroup = userGroup.put();
                pUserGroups.push(pUserGroup);

              } else {
                // create the user group
                pUserGroup = Restangular.one('display_campaigns', campaignId)
                  .one('ad_groups', adGroup.id)
                  .post('user_groups', userGroup);
                pUserGroups.push(pUserGroup);

              }
            }

            var pList = [];
            pList = pList.concat(pAds);
            pList = pList.concat(pUserGroups);

            $q.all(pList).then(function (result) {
              // return the ad group container as the promise results
              defered.resolve(self);
            }, function (reason) {
              defered.reject(reason);
            });

          }, function (reason) {
            defered.reject(reason);
          });

        return defered.promise;
      };

      return AdGroupContainer;
    }
  ]);
})();
