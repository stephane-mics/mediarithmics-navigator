(function(){

  'use strict';

  angular.module('core/campaigns/expert', [
    'restangular',
    // TODO : circular deps ?
    'core/campaigns',
    'core/adgroups',
    'ui.bootstrap',
    "core/keywords"
  ]);

})();
