(function () {
  'use strict';

  var module = angular.module('core/campaigns');

  module.factory("core/campaigns/AdGroupContainer", [
    "$q", "Restangular", "jquery", "core/common/IdGenerator",
    function($q, Restangular, $, IdGenerator) {
      /*
       * Ad Group Container
       */

      var AdGroupContainer = function AdGroupContainer() {

        this.value = {};
        this.ads = [];
        this.removedAds = [];

      };

      AdGroupContainer.prototype.load = function load(campaignId, adGroupId) {

        var root = Restangular.one('display_campaigns', campaignId).one('ad_groups',adGroupId);

        var pValue = root.get();
        var pAds = root.getList('ads');
        //var pUserGroups = root.getList('user_groups');
        //var pKeywords = root.getList('keyword_lists');
        //var pPlacements = root.getList('placement_lists');

        var self = this;

        var defered = $q.defer();
        //var list = [pValue, pAds, pUserGroups, pKeywords, pPlacements];
        var list = [pValue, pAds];

        $q.all(list)
        .then( function (result) {
          self.value = result[0];
          self.id = self.value.id;
          self.ads = result[1];

          //self.userGroups = result[2];
          //self.keywords =  result[3];
          //self.placements = result[4];

          // return the loaded container
          defered.resolve(self);

        }, function(reason) {

          defered.reject(reason);
        });

        // return the promise
        return defered.promise;

      };

      AdGroupContainer.prototype.addAd = function addAd() {

        var ad = {};
        ad.id = IdGenerator.getId();
        this.ads.push(ad);

        return ad.id;
      };

      AdGroupContainer.prototype.removeAd = function removeAd(adId) {

        for(var i=0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId)  {
            this.ads.splice(i, 1);
            if (adId.indexOf("T") === -1) {
              this.removedAds.push(adId);
            }
            return;
          }
        }
      };

      AdGroupContainer.prototype.getAd = function getAd(adId) {

        for(var i=0; i < this.ads.length; i++) {
          if (this.ads[i].id === adId)  {
            return this.ads[i];
          }
        }
      };

      AdGroupContainer.prototype.setAdValue = function setAdValue(ad) {
        var copiedValue = $.extend({}, ad);
        this.getAd(ad.id).value = copiedValue;
        this.getAd(ad.id).modified = true;
      };

      AdGroupContainer.prototype.persist = function persist(campaignId) {

        var defered = $q.defer();

        var self = this;

        Restangular.one('display_campaigns', campaignId).post('ad_groups', this.value)
        .then(function(adGroup) {

          self.id = adGroup.id;

          // persist ads
          var pAds = [];
          for(var i=0; i < self.ads.length; i++) {
            var pAd = Restangular.one('display_campaigns', campaignId).one('ad_groups', adGroup.id).post('ads', self.ads[i].value);
            pAds.push(pAd);
          }

          var pList =[];
          pList.concat(pAds);
          $q.all(pList).then(function(result) {
            // return the ad group container as the promise results
            defered.resolve(self);
          }, function(reason) {
            defered.reject(reason);
          });
        }, function(reason) {

        });

        return defered.promise;
      };

      AdGroupContainer.prototype.update = function update(campaignId) {

        var defered = $q.defer();

        var self = this;

        this.value.put()
        .then(function(adGroup) {

          self.id = adGroup.id;

          // update ads
          var pAds = [], pAd;
          for(var i=0; i < self.ads.length; i++) {

            var ad = self.ads[i];
            if  ( (ad.id.indexOf('T') === -1) || (typeof(ad.modified) !== "undefined") ) {
              // update the ad
              pAd = Restangular.one('campaigns', campaignId)
              .one('ad_groups', adGroup.id)
              .one('ads', ad.id)
              .put(ad.value);
              pAds.push(pAd);

            } else {
              // create the ad
              pAd = Restangular.one('campaigns', campaignId)
              .one('ad_groups', adGroup.id)
              .post('ads', ad.value);
              pAds.push(pAd);

            }
          }

          var pList =[];
          pList = pList.concat(pAds);

          $q.all(pList).then(function(result) {
            // return the ad group container as the promise results
            defered.resolve(self);
          }, function(reason) {
            defered.reject(reason);
          });

        }, function(reason) {
          defered.reject(reason);
        });

        return defered.promise;
      };

      return AdGroupContainer;
    }
  ]);
})();
