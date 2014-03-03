'use strict';

/*
 * Ad Group Container
 */

var AdGroupContainer = function AdGroupContainer($q, Restangular, IdGenerator)  {

	this.$q = $q;
	this.IdGenerator = IdGenerator;
	this.Restangular = Restangular;
	this.value = {};
	this.ads = [];
	this.removedAds = [];

}

AdGroupContainer.prototype.load = function load(campaignId, adGroupId) {

	var root = Restangular.one('campaigns', campaignId).one('ad_groups',adGroupId);

	pValue = root.get();
	pAds = root.getList('ads');
	pUserGroups = root.getList('user_groups');
	pKeywords = root.getList('keyword_lists');
	pPlacements = root.getList('placement_lists');

	var self = this;

 	var deferred = $q.defer();

	$q.all([pValue, pAds, pUserGroups, pKeywords, pPlacements])
        .then( function (result) {        	
			self.value = result[0];
			self.id = self.value.id;
			self.ads = result[1];
			self.userGroups = result[2];
			self.keywords =  result[3];
			self.placements = result[4];

			// return the loaded container
			defered.resolve(self);

        }, function(reason) {

        	defered.reject(reason);
        });	

    // return the promise 
    return deferred.promise;

}

AdGroupContainer.prototype.addAd = function addAd() {
	
	var ad = {};
	ad.id = this.IdGenerator.getId();
	this.ads.push(ad);

	return ad.id;
}

AdGroupContainer.prototype.removeAd = function removeAd(adId) {

	for(var i=0; i < this.ads.length; i++) {
		if (this.ads[i].id == adId)  {
			this.ads.splice(i, 1);				
			if (id.indexOf("T") == -1) removedAds.push(adId);
			return;
		}
	}	
}

AdGroupContainer.prototype.getAd = function getAd(adId) {

	for(var i=0; i < this.ads.length; i++) {
		if (this.ads[i].id == adId)  {
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

	Restangular.one('campaigns',campaignId).post('ad_groups',this.value)
		.then(function(adGroup) {

			self.id = adGroup.id;

			// persist ads
			var pAds = [];
			for(var i=0; i < self.ads.length; i++) {
				var pAd = Restangular.one('campaigns', campaignId).one('ad_groups', adGroup.id).post('ads', self.ads[i].value);
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

	Restangular.one('campaigns',campaignId).one('ad_groups',this.id).put(this.value)
		.then(function(adGroup) {

			self.id = adGroup.id;

			// update ads
			var pAds = [];
			for(var i=0; i < self.ads.length; i++) {
				var ad = self.ads[i];
				if  ( (ad.id.indexOf('T') == -1) || (typeof(ad.modified) != "undefined") ) {
					// update the ad
					var pAd = Restangular.one('campaigns', campaignId)
										 .one('ad_groups', adGroup.id)
										 .one('ads', ad.id)
										 .put(ad.value);
					pAds.push(pAd);

				} else {
					// create the ad 
					var pAd = Restangular.one('campaigns', campaignId)
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
}

/*
 * Campaign Container
 */

var CampaignContainer = function CampaignContainer($q, Restangular, IdGenerator) {

	this.IdGenerator = IdGenerator;
	this.adGroups = [];
  	this.removedAdGroups = [];
  	this.value = {type:"DISPLAY"}
  	this.$q = $q;
  	this.Restangular = Restangular
};

CampaignContainer.prototype.load = function (campaignId) {

	var root = this.Restangular.one('campaigns', campaignId);
 	// send requests to get the value and the list of
 	// ad group ids
	pValue = root.get();
	pAdGroups = root.getList('ad_groups');

	var self = this;

 	var deferred = this.$q.defer();


	this.$q.all([pValue, pAdGroups])
        .then( function (result) {        	
			self.value = result[0];
			self.id = self.value.id;
			var adGroups = result[1];

			var pArray = [];
			if (adGroups.length > 0) {

				for(var i=0; i < adGroups.length; i++) {
					// load the ad group container corresponding to the id list in ad groups
					var AdGroupCtn = new AdGroupContainer(this.$q, this.Restangular, this.IdGenerator);
					pArray.push(adGroupCtn.load(self.id, adGroups[i].id));
				}

				this.$q.all(pArray).then(function(result) {

					for(var i=0; i < result.length; i++) {
						self.adGroups.push(result[i]);
					}

					defered.resolve(self);

				}, function(reason) {
					defered.reject(reason);
				})

			} else {
				// return the loaded container
				defered.resolve(self);				
			}




        }, function(reason) {

        	defered.reject(reason);
        });	

    // return the promise 
    return deferred.promise;
};

CampaignContainer.prototype.addAdGroup = function addAdGroup() {
	var adGroupCtn = new AdGroupContainer();
	adGroupCtn.id = IdGenerator.getId();
	this.adGroups.push(adGroupCtn);
	return adGroupCtn.id;
};


CampaignContainer.prototype.getAdGroup = function getAdGroup(id) {

	for(var i=0; i < this.adGroups.length; i++){
		if (this.adGroups[i].id == id) return this.adGroups[i].value;
	}
	return null;	
};

CampaignContainer.prototype.persist = function persist() {

	var defered = this.$q.defer();

	var self = this;

	this.Restangular.all('campaigns').post(this.value)
		.then(function(campaign) {

			self.id = campaign.id;

			var pArray = [];

			if (self.adGroups.length > 0) {

				for(var i=0; i < adGroups.length; i++) {
					// persist the ad group container 
					pArray.push(adGroups[i].persist(self.id));
				}

				this.$q.all(pArray).then(function(result) {

					defered.resolve(self);

				}, function(reason) {
					defered.reject(reason);
				})

			} else {
				// return the loaded container
				defered.resolve(self);				
			}

		}, function(reason) {
			defered.reject(reason);
		});

	return defered.promise
};

CampaignContainer.prototype.update = function update() {

	var defered = this.$q.defer();

	var self = this;

	this.Restangular.one('campaigns', this.id).put(this.value)
		.then(function(campaign) {			

			var pArray = [];
			if (self.adGroups.length > 0) {

				for(var i=0; i < adGroups.length; i++) {
					var adGroup = adGroups[i];
					if (adGroup.id.indexOf('T') == -1) {
						pArray.push(adGroup.update(self.id));

					} else {
						// persist the ad group container 
						pArray.push(adGroup.persist(self.id));
					}
				}

				this.$q.all(pArray).then(function(result) {

					defered.resolve(self);

				}, function(reason) {
					defered.reject(reason);
				})

			} else {
				// return the loaded container
				defered.resolve(self);				
			}

		}, function(reason) {
			defered.reject(reason);
		});

	return defered.promise
};


/*
 *
 * DISPLAY CAMPAIGN SERVICE
 *
 */

var displayCampaignService = angular.module('displayCampaignService', ['restangular']);


/* define the Authentication service */
displayCampaignService.factory('DisplayCampaignService', ['$q', 'Restangular', 'IdGenerator',

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
  			return campaignCtn.load(campaignId)
  		};

  		/*
  		 * Campaign methods
  		 *
  		 */

  		service.getCampaignValue = function() {

  			var defered = $q.defer();
  			console.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);

  			if (this.campaignCtn.id.indexOf('T') == -1 ) {

  				this.campaignCtn.load().then(function(campaignCtn) {
  					defered.resolve(campaignCtn.value)
  				});

  			} else defered.resolve(service.campaignCtn.value);

  			return defered.promise;

  		};

  		service.setCampaignValue = function(campaign) {
  			this.campaignCtn.value = campaign;
  		};

  		/*
  		 * Ad Group methods
  		 * 		 
  		 */

  		service.addAdGroup = function() {
  			
  			return this.campaignCtn.addAdGroup();
  		};

  		service.getAdGroupValue = function(id) {
  			
  			return this.campaignCtn.getAdGroup(id).value;
  		};

  		service.setAdGroupValue = function(adGroup) {
  			var adGroupContainer = this.campaignCtn.getAdGroup(id);
  			adGroupContainer.value = adGroup;
  		};

  		service.removeAdGroup = function(id) {
  			this.campaignCtn.removeAdGroup(id);
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

  			if (this.campaignCtn.id.indexOf('T') == -1 ) return this.campaignCtn.update();
  			else return this.campaignCtn.persist();


  		};

  		// reset method
  		service.reset = function () {

  			campaignCtn = null;
  		};



      	return service;
}]);
