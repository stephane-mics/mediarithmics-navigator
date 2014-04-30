(function () {
  'use strict';


  /*
   *
   * DISPLAY CAMPAIGN SERVICE
   *
   */

  var module = angular.module('core/campaigns');


  /* define the Authentication service */
  module.factory('core/campaigns/DisplayCampaignService', [
    '$q', 'Restangular', 'core/common/IdGenerator', 'core/campaigns/AdGroupContainer', 'core/campaigns/CampaignContainer', '$log', 'core/common/auth/Session',
    function($q, Restangular, IdGenerator, AdGroupContainer, CampaignContainer, $log, Session) {

      var idCounter = 1;
      var service = {};

      /*
       *  Init methods
       */

      service.getDisplayNetworkCampaign = function () {
         var params = { organisation_id: Session.getCurrentWorkspace().organisation_id };
         return Restangular.all('display_network_campaign').getList(params).$object;
      }

      service.getDeepCampaignView = function (campaignId) {
        var root = Restangular.one('display_campaigns', campaignId);
          // send requests to get the value and the list of
          // ad group ids
        return root.get({view: "deep"});
      };


      service.initCreateCampaign = function(template) {


        var campaignCtn = new CampaignContainer();
        campaignCtn.id = IdGenerator.getId();
        campaignCtn.organisationId = Session.getCurrentWorkspace().organisation_id;

        // set currency ...
        this.campaignCtn = campaignCtn;

        var defered = $q.defer();
        defered.resolve(campaignCtn.id);
        return defered.promise;
      };

      service.initEditCampaign = function(campaignId) {

        var campaignCtn = new CampaignContainer();
        this.campaignCtn = campaignCtn;
        return campaignCtn.load(campaignId);
      };

      /*
       * Campaign methods
       *
       */

      service.getCampaignValue = function() {

        $log.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);
        return this.campaignCtn.value;

      };

      service.getCampaign = function() {

        $log.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);
        return this.campaignCtn;

      };

      service.setCampaignValue = function(campaign) {
        this.campaignCtn.value = campaign;
      };

      service.isCreationMode = function () {
        return this.getCampaignId().indexOf('T')=== 0;
      };

      service.isTemporaryId = function (id) {
        return id.indexOf('T') === 0;
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

      service.loadAdGroups = function () {
        _.each(this.campaignCtn.adGroups, function(elem) {elem.load();})
      }

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

      service.getAds = function(adGroupId) {
        return this.campaignCtn.getAdGroup(adGroupId).ads
      };

      service.setAdValue = function(adGroupId, ad) {
        var adContainer = this.campaignCtn.getAdGroup(adGroupId).getAd(ad.id);
        adContainer.value = ad;
      };

      service.removeAd = function(adGroupId, adId) {
        this.campaignCtn.getAdGroup(adGroupId).removeAd(adId);
      };

      service.getInventorySources = function () {
        return this.campaignCtn.getInventorySources();
      };

      service.addInventorySource = function (inventorySource) {

        $log.debug("> add inventory source to ", this.campaignCtn, inventorySource);
        return this.campaignCtn.addInventorySource(inventorySource);
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


      service.isInitialized = function (){
        return this.campaignCtn === undefined;
      }

      return service;
    }
  ]);
})();
