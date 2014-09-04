define(['./module'], function (module) {
  "use strict";

  module.factory('core/common/IabService', [
    function () {
    var service = {};
    service.getAdSizes = function () {
      // see http://www.iab.net/guidelines/508676/508767/displayguidelines
      return [{
        name:"Universal Ad Package, Medium Rectangle",
        format:"300x250"
      }, {
        name:"Universal Ad Package, Rectangle",
        format:"180x150"
      }, {
        name:"Universal Ad Package, Wide Skyscraper",
        format:"160x600"
      }, {
        name:"Universal Ad Package, Leaderboard",
        format:"728x90"
      }, {
        name:"Display Rising Stars, Filmstrip",
        format:"300x600"
      }, {
        name:"Delisted (Deprecated) Ad Unit, Square Pop-Up",
        format:"250x250"
      }, {
        name:"Delisted (Deprecated) Ad Unit, Full Banner",
        format:"468x60"
      }, {
        name:"Delisted (Deprecated) Ad Unit, Half Banner",
        format:"234x60"
      }, {
        name:"Delisted (Deprecated) Ad Unit, Skyscraper",
        format:"120x600"
      }, {
        name:"Delisted (Deprecated) Ad Unit, Large Rectangle",
        format:"336x280"
      }];
    };
    return service;
  }
  ]);
});
