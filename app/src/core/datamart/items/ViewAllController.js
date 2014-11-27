define(['./module'], function (module) {

  'use strict';


  module.controller('core/datamart/items/ViewAllController', [
    '$scope', '$route', 'Restangular', 'core/datamart/common/Common', 'core/common/auth/Session',
    function($scope, $route, Restangular, Common, Session) {

      $scope.baseUrl = '#' + Common.locations.current.href;

      $scope.datamartId = Session.getCurrentWorkspace().datamart_id;

      // fetch market definitions
      Restangular.one('datamarts', $scope.datamartId).one('default-catalog/markets/').getList().then(function (definedMarkets) {
        $scope.definedMarkets = definedMarkets;
        $scope.market = definedMarkets[0];
        $scope.language = definedMarkets[0].languages[0];

        // attach watchers: query with resetting the paging also
        $scope.$watchCollection('[searchTerms, market, language]', function() {
          $scope.refreshDatasheets(0, 10);
        });
      });

      $scope.refreshDatasheets = function refreshDatasheets(offset, limit) {
        // handle 'All' options in market and language selector
        var market = null;
        if ($scope.market !== null) {
          market = $scope.market.market;
        } else {
          $scope.language = null;
        }

        Restangular.one('datamarts', $scope.datamartId).all('itemInCatalogs/search/').getList({ terms: $scope.searchTerms, market: market, language: $scope.language, offset: offset, limit: limit})
          .then(function (result) {
            $scope.datasheets = result;
          });
      };

      // add languageMapping controls
      $scope.languageMapping = Common.languageMapping;

    }
  ]);

});
