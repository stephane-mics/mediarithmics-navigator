(function(){

  'use strict';

  angular.module('core/campaigns/expert', [
    'restangular',
    // TODO : circular deps ?
    'core/campaigns',
    'core/creatives',
    'core/adgroups',
    'core/usergroups',
    'ui.bootstrap',
    "core/keywords",
    "core/placementlists",
    "core/location"
  ]);

})();
