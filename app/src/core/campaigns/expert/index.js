(function(){

  'use strict';

  angular.module('core/campaigns/expert', [
    'restangular',
    // TODO : circular deps ?
    'core/campaigns',
    'core/adgroups',
    'core/usergroups',
    'ui.bootstrap',
    "core/keywords"
  ]);

})();
