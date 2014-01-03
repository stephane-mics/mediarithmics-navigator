'use strict';

/* Services */

var campaignServices = angular.module('CampaignServices', ['ngResource']);

campaignServices.factory('Campaign', ['$resource',
  function($resource){
    return $resource('campaigns/:campaignId', {}, {
      query: {method:'GET', params:{campaignId:'campaigns'}, isArray:true}
    });
  }]);
