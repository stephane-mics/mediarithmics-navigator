(function () {
  'use strict';

  var module = angular.module('core/campaigns');
  /*
   * Campaign Container
   */

  module.factory("core/campaigns/EmailCampaignContainer", [
    "$q", "Restangular", "core/common/IdGenerator", "async", "$log",
    function($q, Restangular, IdGenerator, async, $log) {


      var EmailCampaignContainer = function EmailCampaignContainer(templateGroupId, templateArtifactId) {

        this.creationMode = true;

        this.value = {type:"EMAIL", template_group_id: templateGroupId, template_artifact_id: templateArtifactId};
      };

      /**
       * Load an existing email campaign from the server.
       * @param {String} campaignId the id of the campaign.
       * @return {$q.promise} a promise of the loaded campaign.
       */
      EmailCampaignContainer.prototype.load = function (campaignId) {

        var root = Restangular.one('email_campaigns', campaignId);
        // send requests to get the value and the list of
        // ad group ids
        var campaignResourceP = root.get();

        var self = this;

        var defered = $q.defer();


        $q.all([campaignResourceP])
        .then( function (result) {
          self.creationMode = false;
          self.value = result[0];
          self.id = self.value.id;

          // return the loaded container
          defered.resolve(self);

        }, function(reason) {
          defered.reject(reason);
        });

        // return the promise
        return defered.promise;
      };


      /**
       * Create a new email campaign.
       * @return {$q.promise} a promise of the save operation.
       */
      EmailCampaignContainer.prototype.persist = function persist() {

        var deferred = $q.defer();

        Restangular.all('email_campaigns').post(this.value, {organisation_id: this.organisationId})
        .then(function(campaign) {
          deferred.resolve(campaign);
        }, function(reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      };

      /**
       * Save an existing email campaign.
       * @return {$q.promise} a promise of the save operation.
       */
      EmailCampaignContainer.prototype.update = function update() {

        var deferred = $q.defer();

        this.value.put().then(function(campaign) {
          deferred.resolve(campaign);
        }, function(reason) {
          deferred.reject(reason);
        });

        return deferred.promise;
      };

      return EmailCampaignContainer;
    }
  ]);
})();

