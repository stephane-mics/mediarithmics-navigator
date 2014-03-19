'use strict';

/*
 * Ad Group Container
 */

var AdGroupContainer = function AdGroupContainer($q, Restangular, IdGenerator) {

  this.$q = $q;
  this.IdGenerator = IdGenerator;
  this.Restangular = Restangular;
  this.value = {};
  this.ads = [];
  this.removedAds = [];

};

AdGroupContainer.prototype.load = function load(campaignId, adGroupId) {

  var root = this.Restangular.one('display_campaigns', campaignId).one('ad_groups',adGroupId);

  var pValue = root.get();
  var pAds = root.getList('ads');
  //var pUserGroups = root.getList('user_groups');
  //var pKeywords = root.getList('keyword_lists');
  //var pPlacements = root.getList('placement_lists');

  var self = this;

  var defered = this.$q.defer();
  //var list = [pValue, pAds, pUserGroups, pKeywords, pPlacements];
  var list = [pValue, pAds];

  this.$q.all(list)
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
  ad.id = this.IdGenerator.getId();
  this.ads.push(ad);

  return ad.id;
};

AdGroupContainer.prototype.removeAd = function removeAd(adId) {

  for(var i=0; i < this.ads.length; i++) {
    if (this.ads[i].id === adId)  {
      this.ads.splice(i, 1);
      if (id.indexOf("T") === -1) {
        removedAds.push(adId);
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

  var defered = this.$q.defer();

  var self = this;

  this.Restangular.one('display_campaigns', campaignId).post('ad_groups', this.value)
  .then(function(adGroup) {

    self.id = adGroup.id;

    // persist ads
    var pAds = [];
    for(var i=0; i < self.ads.length; i++) {
      var pAd = this.Restangular.one('display_campaigns', campaignId).one('ad_groups', adGroup.id).post('ads', self.ads[i].value);
      pAds.push(pAd);
    }

    var pList =[];
    pList.concat(pAds);
    self.$q.all(pList).then(function(result) {
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

  var defered = this.$q.defer();

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

    self.$q.all(pList).then(function(result) {
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

/*
 * Campaign Container
 */

var CampaignContainer = function CampaignContainer($q, Restangular, IdGenerator) {

  this.IdGenerator = IdGenerator;
  this.adGroups = [];
  this.removedAdGroups = [];
  this.value = {type:"DISPLAY"};
  this.$q = $q;
  this.Restangular = Restangular;
};

CampaignContainer.prototype.load = function (campaignId) {

  var root = this.Restangular.one('display_campaigns', campaignId);
  // send requests to get the value and the list of
  // ad group ids
  var pValue = root.get();
  var pAdGroups = root.getList('ad_groups');

  var self = this;

  var defered = this.$q.defer();


  this.$q.all([pValue, pAdGroups])
  .then( function (result) {
    self.value = result[0];
    self.id = self.value.id;
    var adGroups = result[1];

    var pArray = [];
    if (adGroups.length > 0) {

      for(var i=0; i < adGroups.length; i++) {
        // load the ad group container corresponding to the id list in ad groups
        var adGroupCtn = new AdGroupContainer(self.$q, self.Restangular, self.IdGenerator);
        pArray.push(adGroupCtn.load(self.id, adGroups[i].id));
      }

      self.$q.all(pArray).then(function(result) {

        for(var i=0; i < result.length; i++) {
          self.adGroups.push(result[i]);
        }

        defered.resolve(self);

      }, function(reason) {
        defered.reject(reason);
      });

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

CampaignContainer.prototype.addAdGroup = function addAdGroup() {
  var adGroupCtn = new AdGroupContainer(this.$q, this.Restangular, this.IdGenerator);
  adGroupCtn.id = this.IdGenerator.getId();
  this.adGroups.push(adGroupCtn);
  return adGroupCtn.id;
};


CampaignContainer.prototype.getAdGroup = function getAdGroup(id) {

  for(var i=0; i < this.adGroups.length; i++){
    if (this.adGroups[i].id === id) {
      return this.adGroups[i];
    }
  }
  return null;
};


CampaignContainer.prototype.removeAdGroup = function removeAdGroup(id) {

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

CampaignContainer.prototype.persist = function persist() {

  var defered = this.$q.defer();

  var self = this;

  this.Restangular.all('campaigns').post(this.value, {organisation_id: this.organisationId})
  .then(function(campaign) {

    self.id = campaign.id;

    var pArray = [];

    if (self.adGroups.length > 0) {

      for(var i=0; i < this.adGroups.length; i++) {
        // persist the ad group container
        pArray.push(this.adGroups[i].persist(self.id));
      }

      this.$q.all(pArray).then(function(result) {

        defered.resolve(self);

      }, function(reason) {
        defered.reject(reason);
      });

    } else {
      // return the loaded container
      defered.resolve(self);
    }

  }, function(reason) {
    defered.reject(reason);
  });

  return defered.promise;
};

CampaignContainer.prototype.update = function update() {

  var defered = this.$q.defer();

  var self = this;

  this.value.put().then(function(campaign) {

    var adGroups = self.adGroups;

    async.mapSeries(adGroups, function(adGroup, callback) {

      if (adGroup.id.indexOf('T') === -1) {
        // update the ad group
        adGroup.update(self.id).then(function(result) {
          callback(null, result);
        }, function(reason) {
          callback(new Error(reason));
        });

      } else {
        // persist the ad group container
        adGroup.persist(self.id).then(function(result) {
          callback(null, result);
        }, function(reason) {
          callback(new Error(reason));
        });
      }

    }, function(err, results){

      if (err) {
        defered.reject(err);
      } else {
        defered.resolve(results);
      }
    });


  }, function(reason) {
    defered.reject(reason);
  });

  return defered.promise;
};


/*
 *
 * DISPLAY CAMPAIGN SERVICE
 *
 */

var displayCampaignService = angular.module('displayCampaignService', ['restangular']);


/* define the Authentication service */
displayCampaignService.factory('DisplayCampaignService', [
  '$q', 'Restangular', 'IdGenerator',
  function($q, Restangular, IdGenerator) {

    var idCounter = 1;
    var service = {};

    /*
     *  Init methods
     */

    service.initCreateCampaign = function(template, organisationId) {


      var campaignCtn = new CampaignContainer($q, Restangular, IdGenerator);
      campaignCtn.id = IdGenerator.getId();
      campaignCtn.organisationId = organisationId;

      // set currency ...
      this.campaignCtn = campaignCtn;

      var defered = $q.defer();
      defered.resolve(campaignCtn.id);
      return defered.promise;
    };

    service.initEditCampaign = function(campaignId) {

      var campaignCtn = new CampaignContainer($q, Restangular, IdGenerator);
      this.campaignCtn = campaignCtn;
      return campaignCtn.load(campaignId);
    };

    /*
     * Campaign methods
     *
     */

    service.getCampaignValue = function() {

      console.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);
      return this.campaignCtn.value;

    };

    service.setCampaignValue = function(campaign) {
      this.campaignCtn.value = campaign;
    };

    service.getCampaignId = function() {
      return this.campaignCtn.id;
    };

    /*
     * Ad Group methods
     *
     */

    service.addAdGroup = function() {

      return this.campaignCtn.addAdGroup();
    };

    service.getAdGroupValue = function(id) {

      return Restangular.copy(this.campaignCtn.getAdGroup(id).value);
    };

    service.setAdGroupValue = function(id, adGroup) {
      var adGroupContainer = this.campaignCtn.getAdGroup(id);
      adGroupContainer.value = adGroup;
    };

    service.removeAdGroup = function(id) {
      this.campaignCtn.removeAdGroup(id);
    };

    service.getAdGroupValues = function() {
      var values = [];
      for(var i=0; i < this.campaignCtn.adGroups.length; i++) {
        values.push(this.campaignCtn.adGroups[i].value);
      }
      return values;
    };

    service.resetAdGroup = function(id) {
      if (id.indexOf('T') !== -1) {
        this.campaignCtn.removeAdGroup(id);
      }
    };


    /*
     * Ad methods
     */

    service.addAd = function(adGroupId) {
      return this.campaignCtn.getAdGroup(adGroupId).addAd();
    };

    service.getAdValue = function(adGroupId, adId) {

      return this.campaignCtn.getAdGroup(adGroupId).getAd(adId).value;
    };

    service.setAdValue = function(adGroupId, ad) {
      var adContainer = this.campaignCtn.getAdGroup(adGroupId).getAd(ad.id);
      adContainer.value = ad;
    };

    service.removeAd = function(adGroupId, adId) {
      this.campaignCtn.getAdGroup(adGroupId).removeAd(adId);
    };


    // save the campaign
    service.save = function() {

      if (this.campaignCtn.id.indexOf('T') === -1 ) {
        return this.campaignCtn.update();
      } else {
        return this.campaignCtn.persist();
      }


    };

    // reset method
    service.reset = function () {

      this.campaignCtn = null;
    };



    return service;
  }
]);
