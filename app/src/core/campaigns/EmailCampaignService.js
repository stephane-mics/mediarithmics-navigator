define(['./module.js'], function () {
  'use strict';

  /*
   *
   * EMAIL CAMPAIGN SERVICE
   *
   */

  var module = angular.module('core/campaigns');

  module.factory('core/campaigns/EmailCampaignService', [
    '$q', 'lodash', 'Restangular', 'core/common/IdGenerator', 'core/campaigns/EmailCampaignContainer', '$log', 'core/common/auth/Session',
    function($q, _, Restangular, IdGenerator, EmailCampaignContainer, $log, Session) {

      var service = {};

      /**
       * Prepare this service to hold a new campaign.
       * @param {Object} template the template to use.
       * @return {$q.promise} the promise of the creation.
       */
      service.initCreateCampaign = function(template) {


        var campaignCtn = new EmailCampaignContainer(template.template_group_id, template.template_artifact_id);
        campaignCtn.id = IdGenerator.getId();
        campaignCtn.organisationId = Session.getCurrentWorkspace().organisation_id;

        this.campaignCtn = campaignCtn;

        var defered = $q.defer();
        defered.resolve(campaignCtn.id);
        return defered.promise;
      };

      /**
       * Prepare this service to hold an existing campaign.
       * @param {String} campaignId the id of the campaign to load.
       * @param {Object} template the template of the campaign.
       * @return {$q.promise} the promise of the load.
       */
      service.initEditCampaign = function(campaignId, template) {

        var campaignCtn = new EmailCampaignContainer(template.template_group_id, template.template_artifact_id);
        this.campaignCtn = campaignCtn;
        return campaignCtn.load(campaignId);
      };

      /**
       * Return the campaign object.
       * @return {Restangular} the restangular instance of the campaign.
       */
      service.getCampaignValue = function() {
        $log.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);
        return this.campaignCtn.value;
      };

      /**
       * Return the campaign wrapper.
       * @return {EmailCampaignContainer} the campaign container.
       */
      service.getCampaign = function() {
        $log.debug("> getCampaignValue, campaignCtn=", this.campaignCtn);
        return this.campaignCtn;
      };

      /**
       * Set the campaign object.
       * @param {Restangular} campaign the restangular instance of the campaign.
       */
      service.setCampaignValue = function(campaign) {
        this.campaignCtn.value = campaign;
      };

      /**
       * Check if the service is in creation mode.
       * @return {Boolean} true if the service is holding a new campaign, false otherwise.
       */
      service.isCreationMode = function () {
        return this.getCampaignId().indexOf('T')=== 0;
      };

      /**
       * Check if an id is a temporary one.
       * @param {String} id the id to check.
       * @return {Boolean} true if the id is a temporary id, false otherwise.
       */
      service.isTemporaryId = function (id) {
        return id.indexOf('T') === 0;
      };

      /**
       * Return the id of the wrapped campaign.
       * @return {String} the id.
       */
      service.getCampaignId = function() {
        return this.campaignCtn.id;
      };


      /**
       * Save the wrapped campaign (creation/edition).
       * @return {$q.promise} the promise of the operation.
       */
      service.save = function() {
        if (this.campaignCtn.id.indexOf('T') === -1 ) {
          return this.campaignCtn.update();
        } else {
          return this.campaignCtn.persist();
        }
      };

      /**
       * Reset this service to an empty state (not containing any campaign).
       */
      service.reset = function () {
        this.campaignCtn = null;
      };

      /**
       * Check if the service is holding a campaign.
       * @return {Boolean} true if the service contains a campaign, false otherwise.
       */
      service.isInitialized = function (){
        return !!this.campaignCtn;
      };

      return service;
    }
  ]);
});

