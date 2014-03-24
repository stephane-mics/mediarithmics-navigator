(function(){

  'use strict';

  angular.module('core/campaigns/expert', [
    'restangular',
    // TODO : circular deps ?
    'core/campaigns',
    'ui.bootstrap',
    "core/keywords"
  ]);

})();
